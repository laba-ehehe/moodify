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

// Simple genre mapping without dynamic API calls
const MOOD_TO_GENRES = {
  happy: ['pop', 'party', 'dance', 'indie-pop', 'happy'],
  energetic: ['edm', 'dance', 'work-out', 'house', 'electronic'],
  calm: ['chill', 'ambient', 'acoustic', 'new-age', 'classical'],
  sad: ['sad', 'piano', 'acoustic', 'singer-songwriter', 'blues'],
  romantic: ['romance', 'r-n-b', 'soul', 'latin', 'pop'],
  focus: ['ambient', 'classical', 'chill', 'study', 'acoustic'],
  angry: ['metal', 'hard-rock', 'rock', 'punk', 'alt-rock'],
  party: ['party', 'dance', 'club', 'edm', 'pop'],
  nostalgic: ['rock', 'blues', 'folk', 'country', 'oldies'],
  neutral: ['pop', 'indie', 'alternative', 'electronic', 'rock']
};

// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio features provided' });
  }

  try {
    // Use simple genre mapping instead of API call
    const genres = MOOD_TO_GENRES[mood] || MOOD_TO_GENRES.neutral;
    const seed_genres = genres.slice(0, 5).join(',');

    // Filter only valid Spotify parameters
    const allowedParams = {};
    const validKeys = ['target_energy', 'target_valence', 'target_danceability', 
                      'target_acousticness', 'target_mode'];
    
    validKeys.forEach(key => {
      if (features[key] !== undefined) {
        allowedParams[key] = String(features[key]);
      }
    });

    const params = new URLSearchParams({
      limit: String(limit),
      market: 'US',
      seed_genres,
      ...allowedParams
    });

    const response = await axios.get(
      `https://api.spotify.com/v1/recommendations?${params}`, 
      {
        headers: { 
          'Authorization': `Bearer ${req.spotifyToken}` 
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Recommendations error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get recommendations',
      details: error.response?.data 
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

// Get track audio features
// router.get('/audio-features/:trackId', authenticateSpotify, async (req, res) => {
//   const { trackId } = req.params;
  
//   try {
//     const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
//       headers: {
//         'Authorization': `Bearer ${req.spotifyToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Audio features error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ 
//       error: 'Failed to get audio features' 
//     });
//   }
// });

module.exports = router;