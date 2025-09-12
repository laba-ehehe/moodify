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

// Complete mood to genre mappings - using only valid Spotify seed genres
const MOOD_TO_GENRES = {
  // Original moods
  happy: ['pop', 'dance', 'funk', 'disco', 'happy'],
  energetic: ['dance', 'electronic', 'house', 'techno', 'edm'],
  calm: ['chill', 'ambient', 'acoustic', 'classical', 'jazz'],
  sad: ['acoustic', 'piano', 'blues', 'soul', 'indie'],
  romantic: ['r-n-b', 'soul', 'latin', 'pop', 'jazz'],
  angry: ['metal', 'hard-rock', 'rock', 'punk', 'heavy-metal'],
  party: ['dance', 'club', 'edm', 'pop', 'electronic'],
  nostalgic: ['rock', 'blues', 'folk', 'country', 'soul'],
  neutral: ['pop', 'indie', 'alternative', 'electronic', 'rock'],
  
  // Focus/Work moods
  focused: ['ambient', 'classical', 'chill', 'acoustic', 'minimal-techno'],
  motivated: ['rock', 'pop', 'electronic', 'alternative', 'indie'],
  contemplative: ['ambient', 'classical', 'acoustic', 'chill', 'folk'],
  studying: ['study', 'piano', 'classical', 'ambient', 'chill'],
  
  // Chill/Relaxing moods
  sleepy: ['ambient', 'new-age', 'piano', 'sleep', 'rainy-day'],
  dreamy: ['dream-pop', 'ambient', 'synth-pop', 'psych-rock', 'new-age'],
  meditative: ['ambient', 'new-age', 'indian', 'world-music', 'soundtracks'],
  
  // Upbeat/Active moods
  cool: ['jazz', 'funk', 'electronic', 'indie', 'alternative'],
  excited: ['dance', 'pop', 'electronic', 'funk', 'disco'],
  confident: ['hip-hop', 'power-pop', 'rock', 'indie', 'pop'],
  playful: ['k-pop', 'j-pop', 'pop', 'disney', 'kids'],
  groovy: ['funk', 'disco', 'groove', 'soul', 'afrobeat'],
  
  // Emotional/Introspective moods
  lonely: ['singer-songwriter', 'acoustic', 'indie-folk', 'emo', 'ambient'],
  hopeful: ['gospel', 'soul', 'folk', 'indie', 'pop'],
  anxious: ['post-rock', 'ambient', 'minimal-techno', 'idm', 'experimental'],
  melancholic: ['indie-folk', 'acoustic', 'ambient', 'post-rock', 'singer-songwriter'],
  
  // Activity-based moods
  workout: ['work-out', 'edm', 'drum-and-bass', 'hardstyle', 'power-metal'],
  'road-trip': ['road-trip', 'rock', 'indie', 'country', 'alternative'],
  cooking: ['jazz', 'bossa-nova', 'french', 'latino', 'world-music'],
  
  // Cultural/Genre-specific moods
  rebellious: ['punk', 'punk-rock', 'grunge', 'garage', 'hardcore'],
  vintage: ['rockabilly', 'doo-wop', 'swing', 'jazz', 'soul'],
  tropical: ['reggaeton', 'tropical', 'dancehall', 'soca', 'afrobeat'],
  dark: ['goth', 'industrial', 'dark-ambient', 'black-metal', 'darkwave']
};

// Seed tracks for different moods (using popular tracks as seeds for fallback)
const MOOD_SEED_TRACKS = {
  happy: ['3n3Ppam7vgaVa1iaRUc9Lp', '32OlwWuMpZ6b0aN2RZOeMS'],
  energetic: ['2aoo2jlRnM3A0NyLQqMN2f', '0VjIjW4GlUZAMYd2vXMi3b'],
  calm: ['0U0ldCRmgCqhVvD6ksG63j', '1301WleyT98MSxVHPZCA6M'],
  sad: ['3XOTEO5qe5lbIe0sf8kELo', '7qiZfU4dY1lWllzX7mPBI3'],
  romantic: ['04jRqPJWcbWmq5oWnH7Zyf', '5CZ40GBx1sQ9agT82CLQCT'],
  focused: ['5GZrQA2FmI7wFpvQJrQhh0', '1YoYV6IeQtgymDy8j9xKnq'],
  angry: ['4cOdK2wGLETKBW3PvgPWqT', '7lQ8MOhq6IN2w8EYcFNSUk'],
  party: ['2aoo2jlRnM3A0NyLQqMN2f', '32OlwWuMpZ6b0aN2RZOeMS'],
  nostalgic: ['5fpizYGbi5IQoEraj6FP0R', '3hBBKuWJfxlIlnd9QFoC8k'],
  neutral: ['0VjIjW4GlUZAMYd2vXMi3b', '7qiZfU4dY1lWllzX7mPBI3'],
  sleepy: ['4i9sYtSIlR80bxje5B3rUb', '5mCPDVBb16L4XQwDdbRUpz'],
  workout: ['2aoo2jlRnM3A0NyLQqMN2f', '75ZvA4QfFiZvzhj2xkaWAh']
};

// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  console.log('Token received:', req.spotifyToken ? 'Yes' : 'No');
  console.log('Token first 20 chars:', req.spotifyToken?.substring(0, 20));

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

    let response = null;

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
      neutral: 'pop hits popular'
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
      // Just return the search results directly
      console.log('Returning search results as recommendations');
      return res.json({
        tracks: searchResponse.data.tracks.items.slice(0, limit),
        seeds: []
      });
    }

    // Last resort: search for generic popular music
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

  try {
    let response = null;

    // Skip genre-based approach since it's unreliable
    // Go straight to searching for tracks based on mood
    
    console.log('Searching for tracks based on mood:', mood);
    
    // Build a search query based on the mood
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
      neutral: 'pop hits popular'
    };
    
    const searchQuery = moodSearchTerms[mood] || moodSearchTerms.neutral;
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=50&market=US`;
    
    console.log('Search URL:', searchUrl);
    
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`
      }
    });

    if (searchResponse.data.tracks && searchResponse.data.tracks.items.length > 0) {
      // Use the first 5 tracks as seeds
      const seedTracks = searchResponse.data.tracks.items
        .slice(0, 5)
        .map(track => track.id)
        .filter(id => id); // Remove any undefined IDs
      
      console.log('Found seed tracks:', seedTracks);
      
      if (seedTracks.length > 0) {
        const recommendParams = new URLSearchParams({
          limit: String(Math.min(limit, 100)),
          market: 'US',
          seed_tracks: seedTracks.slice(0, 5).join(',') // Max 5 seeds
        });

        // Add audio features with less strict parameters
        if (features.energy !== undefined) {
          recommendParams.append('target_energy', String(Number(features.energy).toFixed(1)));
        }
        if (features.valence !== undefined) {
          recommendParams.append('target_valence', String(Number(features.valence).toFixed(1)));
        }

        const recommendUrl = `https://api.spotify.com/v1/recommendations?${recommendParams.toString()}`;
        console.log('Recommendations URL:', recommendUrl);
        
        response = await axios.get(recommendUrl, {
          headers: {
            'Authorization': `Bearer ${req.spotifyToken}`
          }
        });
        
        if (response.data.tracks && response.data.tracks.length > 0) {
          console.log('Success! Got', response.data.tracks.length, 'recommendations');
          return res.json(response.data);
        }
      }
    }

    // If recommendations fail, just return the search results as recommendations
    if (searchResponse.data.tracks && searchResponse.data.tracks.items.length > 0) {
      console.log('Falling back to search results');
      return res.json({
        tracks: searchResponse.data.tracks.items.slice(0, limit),
        seeds: []
      });
    }

    // Last resort: search for generic popular music
    const fallbackSearch = await axios.get(
      `https://api.spotify.com/v1/search?q=year:2020-2024&type=track&limit=${limit}&market=US`,
      {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`
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
    console.error('All recommendation strategies failed');
    console.error('Error:', error.message);
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to get recommendations. Please try again.',
      details: error.response?.data,
      message: 'The Spotify API may be experiencing issues.'
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