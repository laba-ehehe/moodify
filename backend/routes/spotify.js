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

// Updated genre mapping with ONLY verified Spotify seed genres
const MOOD_TO_GENRES = {
  happy: ['pop', 'dance', 'funk', 'disco', 'happy'],
  energetic: ['dance', 'electronic', 'house', 'techno', 'edm'],
  calm: ['chill', 'ambient', 'acoustic', 'classical', 'jazz'],
  sad: ['acoustic', 'piano', 'singer-songwriter', 'blues', 'sad'],
  romantic: ['r-n-b', 'soul', 'latin', 'pop', 'jazz'],
  focus: ['ambient', 'classical', 'chill', 'acoustic', 'instrumental'],
  angry: ['metal', 'hard-rock', 'rock', 'punk', 'alternative'],
  party: ['dance', 'club', 'edm', 'pop', 'electronic'],
  nostalgic: ['rock', 'blues', 'folk', 'country', 'oldies'],
  neutral: ['pop', 'indie', 'alternative', 'electronic', 'rock'],
  // Additional moods from your analyzer
  motivated: ['rock', 'pop', 'electronic', 'alternative', 'indie'],
  contemplative: ['ambient', 'classical', 'acoustic', 'chill', 'folk'],
  cool: ['jazz', 'funk', 'electronic', 'indie', 'alternative'],
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
    const seed_genres = genres.slice(0, 5).join(',');

    // Build base parameters
    const params = new URLSearchParams({
      limit: String(Math.min(limit, 100)), // Spotify max is 100
      market: 'US',
      seed_genres
    });

    // Add audio features with proper bounds checking
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

    res.json(response.data);
  } catch (error) {
    console.error('Recommendations error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 404) {
      console.error('404 Error - This usually means invalid seed genres or malformed request');
    }
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to get recommendations',
      details: error.response?.data,
      status: error.response?.status
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