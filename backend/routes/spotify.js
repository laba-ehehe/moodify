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

// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  console.log('Token received:', req.spotifyToken ? 'Yes' : 'No');
  console.log('Mood requested:', mood);

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio features provided' });
  }

  try {
    // Verify token
    try {
      const profileTest = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Token is valid, user:', profileTest.data.display_name);
    } catch (tokenError) {
      console.error('Token validation failed:', tokenError.response?.status);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Search for tracks based on mood
    console.log('Searching for tracks based on mood:', mood);
    
    const moodSearchTerms = {
      happy: 'happy upbeat cheerful',
      sad: 'sad melancholy emotional',
      energetic: 'energetic workout pump',
      calm: 'calm relaxing peaceful',
      angry: 'angry aggressive intense',
      romantic: 'love romantic tender',
      party: 'party dance club',
      nostalgic: 'classic oldies throwback',
      focused: 'focus concentration study',
      sleepy: 'sleep relax calm',
      workout: 'workout gym pump',
      neutral: 'pop hits popular',
      confident: 'confident powerful strong',
      dreamy: 'dreamy ethereal atmospheric',
      groovy: 'groovy funky disco',
      lonely: 'lonely solitude alone',
      hopeful: 'hopeful optimistic uplifting',
      anxious: 'anxious nervous tense',
      meditative: 'meditation zen mindful',
      playful: 'playful fun silly',
      motivated: 'motivated inspiration success',
      contemplative: 'contemplative thoughtful',
      cool: 'cool jazz smooth',
      excited: 'excited thrilled energetic',
      'road-trip': 'road trip driving',
      cooking: 'cooking kitchen jazz',
      studying: 'study focus concentration',
      rebellious: 'rebellious punk rock',
      vintage: 'vintage retro classic',
      tropical: 'tropical summer beach',
      dark: 'dark gothic industrial'
    };
    
    const searchQuery = moodSearchTerms[mood] || moodSearchTerms.neutral;
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=50&market=US`;
    
    console.log('Search URL:', searchUrl);
    
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (searchResponse.data.tracks && searchResponse.data.tracks.items.length > 0) {
      let tracks = searchResponse.data.tracks.items;
      tracks.sort((a, b) => b.popularity - a.popularity);
      
      console.log(`Found ${tracks.length} tracks, returning top ${limit}`);
      
      return res.json({
        tracks: tracks.slice(0, limit),
        seeds: []
      });
    }

    // Fallback search
    console.log('No tracks found, trying fallback');
    const fallbackSearch = await axios.get(
      `https://api.spotify.com/v1/search?q=year:2020-2024&type=track&limit=${limit}&market=US`,
      {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (fallbackSearch.data.tracks && fallbackSearch.data.tracks.items.length > 0) {
      return res.json({
        tracks: fallbackSearch.data.tracks.items,
        seeds: []
      });
    }

    throw new Error('Unable to get any tracks from Spotify');

  } catch (error) {
    console.error('Recommendations error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Failed to get recommendations',
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

module.exports = router;