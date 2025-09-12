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
  console.log('Token first 20 chars:', req.spotifyToken?.substring(0, 20));
  console.log('Mood requested:', mood);

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio features provided' });
  }

  try {
    // First, let's verify the token works by getting user profile
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
    
    // Extended mood search terms for better results
    const moodSearchTerms = {
      happy: 'happy upbeat cheerful joy positive',
      sad: 'sad melancholy emotional ballad slow',
      energetic: 'energetic workout pump high energy dance',
      calm: 'calm relaxing peaceful ambient chill',
      angry: 'angry aggressive intense metal rock',
      romantic: 'love romantic tender sweet couple',
      party: 'party dance club rave friday night',
      nostalgic: 'classic oldies throwback 90s 80s',
      focused: 'focus concentration study instrumental',
      sleepy: 'sleep relax calm night peaceful',
      workout: 'workout gym pump motivation training',
      neutral: 'pop hits top 40 popular trending',
      // Add new moods
      confident: 'confident powerful strong boss empowerment',
      dreamy: 'dreamy ethereal atmospheric ambient',
      groovy: 'groovy funky disco soul rhythm',
      lonely: 'lonely solitude alone melancholy',
      hopeful: 'hopeful optimistic uplifting inspiring',
      anxious: 'anxious nervous tense worried',
      meditative: 'meditation zen mindful spiritual',
      playful: 'playful fun silly happy kids',
      motivated: 'motivated inspiration success achievement',
      contemplative: 'contemplative thoughtful reflection',
      cool: 'cool jazz smooth sophisticated',
      excited: 'excited thrilled energetic hype',
      'road-trip': 'road trip driving highway travel',
      cooking: 'cooking kitchen jazz bossa nova',
      studying: 'study focus concentration lofi',
      rebellious: 'rebellious punk rock alternative',
      vintage: 'vintage retro classic oldies',
      tropical: 'tropical summer beach reggaeton latin',
      dark: 'dark gothic industrial metal'
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
      // Filter tracks to match mood better based on audio features if available
      let tracks = searchResponse.data.tracks.items;
      
      // Sort tracks by popularity to get better quality results
      tracks.sort((a, b) => b.popularity - a.popularity);
      
      console.log(`Found ${tracks.length} tracks, returning top ${limit}`);
      
      return res.json({
        tracks: tracks.slice(0, limit),
        seeds: []
      });
    }

    // Fallback: search for popular music from recent years
    console.log('No tracks found for mood, trying fallback search');
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
    console.error('Recommendations error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Failed to get recommendations',
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