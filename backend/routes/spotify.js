const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to check auth token
const authenticateSpotify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header received:', authHeader ? 'Yes' : 'No');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log('Token extracted:', token ? `${token.substring(0, 10)}...` : 'None');
  
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
      error: 'Failed to get user profile',
      details: error.response?.data
    });
  }
});

// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  console.log('=== Recommendations Request ===');
  console.log('Token received:', req.spotifyToken ? `${req.spotifyToken.substring(0, 10)}...` : 'No');
  console.log('Mood requested:', mood);
  console.log('Features:', features);

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio features provided' });
  }

  try {
    // First, verify the token is valid
    try {
      const profileTest = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
        }
      });
      console.log('Token is valid, user:', profileTest.data.display_name || profileTest.data.id);
    } catch (tokenError) {
      console.error('Token validation failed:', tokenError.response?.status, tokenError.response?.data);
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        details: tokenError.response?.data
      });
    }

    // Enhanced mood search terms with more variety
    const moodSearchTerms = {
      happy: ['happy', 'upbeat', 'cheerful', 'joy', 'feel good'],
      sad: ['sad', 'melancholy', 'emotional', 'heartbreak', 'blues'],
      energetic: ['energetic', 'workout', 'pump', 'power', 'hype'],
      calm: ['calm', 'relaxing', 'peaceful', 'chill', 'ambient'],
      angry: ['angry', 'aggressive', 'intense', 'metal', 'rage'],
      romantic: ['love', 'romantic', 'tender', 'romance', 'wedding'],
      party: ['party', 'dance', 'club', 'friday night', 'celebration'],
      nostalgic: ['classic', 'oldies', 'throwback', '80s', '90s'],
      focused: ['focus', 'concentration', 'study', 'instrumental', 'productivity'],
      sleepy: ['sleep', 'relax', 'calm', 'meditation', 'peaceful'],
      workout: ['workout', 'gym', 'pump', 'exercise', 'training'],
      neutral: ['pop', 'hits', 'popular', 'top 40', 'chart'],
      confident: ['confident', 'powerful', 'strong', 'boss', 'empowerment'],
      dreamy: ['dreamy', 'ethereal', 'atmospheric', 'ambient', 'floating'],
      groovy: ['groovy', 'funky', 'disco', 'funk', 'soul'],
      lonely: ['lonely', 'solitude', 'alone', 'isolation', 'melancholic'],
      hopeful: ['hopeful', 'optimistic', 'uplifting', 'inspiring', 'motivation'],
      anxious: ['anxious', 'nervous', 'tense', 'stress', 'worry'],
      meditative: ['meditation', 'zen', 'mindful', 'yoga', 'spiritual'],
      playful: ['playful', 'fun', 'silly', 'happy', 'children'],
      motivated: ['motivated', 'inspiration', 'success', 'hustle', 'grind'],
      contemplative: ['contemplative', 'thoughtful', 'deep', 'reflection'],
      cool: ['cool', 'jazz', 'smooth', 'lounge', 'sophisticated'],
      excited: ['excited', 'thrilled', 'energetic', 'ecstatic', 'enthusiasm'],
      'road-trip': ['road trip', 'driving', 'highway', 'travel', 'journey'],
      cooking: ['cooking', 'kitchen', 'jazz', 'dinner', 'restaurant'],
      studying: ['study', 'focus', 'concentration', 'learning', 'library'],
      rebellious: ['rebellious', 'punk', 'rock', 'rebel', 'alternative'],
      vintage: ['vintage', 'retro', 'classic', 'old school', 'timeless'],
      tropical: ['tropical', 'summer', 'beach', 'island', 'reggae'],
      dark: ['dark', 'gothic', 'industrial', 'doom', 'black metal']
    };

    const searchTerms = moodSearchTerms[mood] || moodSearchTerms.neutral;
    
    // Try multiple search queries for better results
    let allTracks = [];
    
    for (let i = 0; i < Math.min(2, searchTerms.length); i++) {
      const searchQuery = searchTerms[i];
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=50&market=US`;
      
      console.log(`Search attempt ${i + 1} with query: "${searchQuery}"`);
      
      try {
        const searchResponse = await axios.get(searchUrl, {
          headers: {
            'Authorization': `Bearer ${req.spotifyToken}`,
          }
        });

        if (searchResponse.data.tracks && searchResponse.data.tracks.items.length > 0) {
          allTracks = [...allTracks, ...searchResponse.data.tracks.items];
          console.log(`Found ${searchResponse.data.tracks.items.length} tracks for "${searchQuery}"`);
        }
      } catch (searchError) {
        console.error(`Search failed for "${searchQuery}":`, searchError.response?.status);
      }
    }

    // Remove duplicates based on track ID
    const uniqueTracks = Array.from(
      new Map(allTracks.map(track => [track.id, track])).values()
    );

    if (uniqueTracks.length > 0) {
      // Sort by popularity and return top tracks
      uniqueTracks.sort((a, b) => b.popularity - a.popularity);
      
      console.log(`Total unique tracks found: ${uniqueTracks.length}, returning top ${limit}`);
      
      return res.json({
        tracks: uniqueTracks.slice(0, limit),
        seeds: [],
        mood: mood
      });
    }

    // If no tracks found with mood search, try genre-based search
    console.log('No tracks found with mood search, trying genre-based fallback');
    
    const genreMap = {
      happy: 'pop',
      sad: 'blues',
      energetic: 'edm',
      calm: 'ambient',
      angry: 'metal',
      romantic: 'r-n-b',
      party: 'dance',
      nostalgic: 'classic-rock',
      focused: 'classical',
      workout: 'work-out'
    };

    const genre = genreMap[mood] || 'pop';
    const genreSearchUrl = `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=${limit}&market=US`;
    
    console.log('Genre search URL:', genreSearchUrl);
    
    try {
      const genreSearch = await axios.get(genreSearchUrl, {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
        }
      });

      if (genreSearch.data.tracks && genreSearch.data.tracks.items.length > 0) {
        return res.json({
          tracks: genreSearch.data.tracks.items,
          seeds: [],
          mood: mood
        });
      }
    } catch (genreError) {
      console.error('Genre search failed:', genreError.response?.status);
    }

    // Final fallback - just get popular tracks
    console.log('Trying final fallback - popular tracks');
    const fallbackSearch = await axios.get(
      `https://api.spotify.com/v1/search?q=year:2020-2024&type=track&limit=${limit}&market=US`,
      {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
        }
      }
    );

    if (fallbackSearch.data.tracks && fallbackSearch.data.tracks.items.length > 0) {
      return res.json({
        tracks: fallbackSearch.data.tracks.items,
        seeds: [],
        mood: mood
      });
    }

    throw new Error('Unable to get any tracks from Spotify');

  } catch (error) {
    console.error('=== Recommendations Error ===');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Failed to get recommendations',
      details: error.response?.data,
      mood: mood
    });
  }
});

// Create playlist
router.post('/create-playlist', authenticateSpotify, async (req, res) => {
  const { name, description, trackUris, userId } = req.body;

  console.log('Creating playlist for user:', userId);
  console.log('Playlist name:', name);
  console.log('Track count:', trackUris?.length || 0);

  try {
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { 
        name, 
        description, 
        public: false 
      },
      {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const playlistId = playlistResponse.data.id;
    console.log('Playlist created with ID:', playlistId);

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
      console.log('Tracks added to playlist');
    }

    res.json(playlistResponse.data);
  } catch (error) {
    console.error('Create playlist error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create playlist',
      details: error.response?.data
    });
  }
});

module.exports = router;