const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to check auth token
const authenticateSpotify = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  req.spotifyToken = token;
  next();
};

// Get user profile
router.get('/me', authenticateSpotify, async (req, res) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to get user profile'
    });
  }
});

// FIXED: Using only VALID Spotify seed genres
// You can verify these at: https://developer.spotify.com/console/get-available-genre-seeds/
const MOOD_TO_GENRES = {
  happy: ['pop', 'dance', 'funk', 'disco', 'happy'],
  energetic: ['dance', 'electronic', 'house', 'techno', 'edm'],
  calm: ['chill', 'ambient', 'acoustic', 'classical', 'jazz'],
  sad: ['acoustic', 'piano', 'blues', 'sad'], // Removed 'singer-songwriter' - not valid
  romantic: ['r-n-b', 'soul', 'latin', 'pop', 'jazz'],
  focus: ['ambient', 'classical', 'chill', 'acoustic', 'study'], // Changed 'instrumental' to 'study'
  angry: ['metal', 'hard-rock', 'rock', 'punk', 'alt-rock'], // Changed 'alternative' to 'alt-rock'
  party: ['dance', 'club', 'edm', 'pop', 'electronic'],
  nostalgic: ['rock', 'blues', 'folk', 'country'], // Removed 'oldies' - not valid
  neutral: ['pop', 'indie', 'alt-rock', 'electronic', 'rock'], // Changed 'alternative' to 'alt-rock'
  // Additional moods from your analyzer
  motivated: ['rock', 'pop', 'electronic', 'alt-rock', 'indie'], // Changed 'alternative' to 'alt-rock'
  contemplative: ['ambient', 'classical', 'acoustic', 'chill', 'folk'],
  cool: ['jazz', 'funk', 'electronic', 'indie', 'alt-rock'], // Changed 'alternative' to 'alt-rock'
  excited: ['dance', 'pop', 'electronic', 'funk', 'disco']
};

// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio features provided' });
  }

  try {
    // Get genres for the mood (fallback to neutral if mood not found)
    const genres = MOOD_TO_GENRES[mood] || MOOD_TO_GENRES.neutral;
    
    // Spotify allows max 5 seed genres
    const selectedGenres = genres.slice(0, 5);
    const seed_genres = selectedGenres.join(',');

    console.log('Using mood:', mood);
    console.log('Selected genres:', selectedGenres);

    // Build base parameters
    const params = new URLSearchParams({
      limit: String(Math.min(limit, 100)), // Spotify max is 100
      market: 'US',
      seed_genres
    });

    // Add audio features with proper bounds checking and formatting
    if (features.energy !== undefined && features.energy >= 0 && features.energy <= 1) {
      params.append('target_energy', String(Number(features.energy).toFixed(2)));
    }
    if (features.valence !== undefined && features.valence >= 0 && features.valence <= 1) {
      params.append('target_valence', String(Number(features.valence).toFixed(2)));
    }
    if (features.danceability !== undefined && features.danceability >= 0 && features.danceability <= 1) {
      params.append('target_danceability', String(Number(features.danceability).toFixed(2)));
    }
    if (features.acousticness !== undefined && features.acousticness >= 0 && features.acousticness <= 1) {
      params.append('target_acousticness', String(Number(features.acousticness).toFixed(2)));
    }
    
    // Add tempo if provided (BPM range typically 0-200)
    if (features.tempo !== undefined && features.tempo >= 0 && features.tempo <= 200) {
      params.append('target_tempo', String(Math.round(features.tempo)));
    }

    const requestUrl = `https://api.spotify.com/v1/recommendations?${params.toString()}`;
    console.log('Spotify API request URL:', requestUrl);
    console.log('Request headers:', {
      'Authorization': `Bearer ${req.spotifyToken.substring(0, 20)}...`
    });

    const response = await axios.get(requestUrl, {
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`
      }
    });

    console.log('Spotify API response status:', response.status);
    console.log('Number of tracks returned:', response.data.tracks?.length || 0);

    // If no tracks returned, try with fewer parameters
    if (!response.data.tracks || response.data.tracks.length === 0) {
      console.log('No tracks returned, trying with fewer parameters...');
      
      // Try with just genres and energy/valence
      const fallbackParams = new URLSearchParams({
        limit: String(Math.min(limit, 100)),
        market: 'US',
        seed_genres: selectedGenres.slice(0, 3).join(','), // Use fewer genres
        target_energy: String(Number(features.energy || 0.5).toFixed(2)),
        target_valence: String(Number(features.valence || 0.5).toFixed(2))
      });

      const fallbackResponse = await axios.get(
        `https://api.spotify.com/v1/recommendations?${fallbackParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${req.spotifyToken}`
          }
        }
      );

      return res.json(fallbackResponse.data);
    }

    res.json(response.data);
  } catch (error) {
    console.error('Recommendations error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 404) {
      console.error('404 Error - Invalid seed genres or malformed request');
      console.error('Attempted genres:', MOOD_TO_GENRES[mood] || MOOD_TO_GENRES.neutral);
    }
    
    // Provide more specific error message
    const errorMessage = error.response?.data?.error?.message || 'Failed to get recommendations';
    
    res.status(error.response?.status || 500).json({
      error: errorMessage,
      details: error.response?.data,
      status: error.response?.status,
      attemptedMood: mood,
      attemptedGenres: MOOD_TO_GENRES[mood] || MOOD_TO_GENRES.neutral
    });
  }
});

// Create playlist
router.post('/create-playlist', authenticateSpotify, async (req, res) => {
  const { name, description, trackUris, userId } = req.body;

  try {
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name, description, public: false },
      {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const playlistId = playlistResponse.data.id;

    if (trackUris && trackUris.length > 0) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: trackUris },
        {
          headers: {
            'Authorization': `Bearer ${req.spotifyToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    res.json(playlistResponse.data);
  } catch (error) {
    console.error('Create playlist error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create playlist'
    });
  }
});

module.exports = router;