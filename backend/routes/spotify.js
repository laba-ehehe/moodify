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
// router.post('/recommendations', authenticateSpotify, async (req, res) => {
//   // Accept either { audioFeatures, limit, mood } OR a flat body with the features directly
//   const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
//   const features = audioFeatures || req.body; // ← supports current frontend shape

//   // Basic validation
//   if (!features || Object.keys(features).length === 0) {
//     return res.status(400).json({ error: 'No audio feature targets provided' });
//   }

//   // Map mood → up to 5 Spotify genre seeds (Spotify requires seeds)
//   const moodToGenres = {
//     happy:     ['pop', 'party', 'summer', 'dance', 'indie-pop'],
//     energetic: ['edm', 'dance', 'work-out', 'house', 'electro'],
//     calm:      ['chill', 'ambient', 'lounge', 'new-age', 'acoustic'],
//     sad:       ['sad', 'piano', 'acoustic', 'rainy-day', 'singer-songwriter'],
//     romantic:  ['romance', 'r-n-b', 'soul', 'latin', 'love'],
//     focus:     ['lo-fi', 'study', 'ambient', 'classical', 'beats'],
//     angry:     ['metal', 'hard-rock', 'rock', 'punk', 'alt-rock'],
//     party:     ['party', 'dance', 'club', 'edm', 'pop'],
//     nostalgic: ['rock-n-roll', 'blues', 'soft-rock', 'folk', 'throwback'],
//     neutral:   ['pop', 'indie', 'alternative', 'electronic', 'rock'],
//   };
//   const seed_genres = (moodToGenres[mood] || moodToGenres.neutral).slice(0, 5).join(',');

//   try {
//     const params = new URLSearchParams({
//       limit: String(limit),
//       market: 'US',
//       seed_genres,              // ← add required seeds
//       ...features,              // ← now spreads either body shape
//     });

//     const response = await axios.get(
//       `https://api.spotify.com/v1/recommendations?${params.toString()}`,
//       { headers: { 'Authorization': `Bearer ${req.spotifyToken}` } }
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error('Recommendations error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ error: 'Failed to get recommendations' });
//   }
// });
// Generate recommendations based on mood
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  // Accept either { audioFeatures, limit, mood } OR a flat body
  const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
  const features = audioFeatures || req.body;

  if (!features || Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio feature targets provided' });
  }

  // Spotify's valid seed genres (subset: only what we use here)
  const VALID = new Set([
    'pop','indie','indie-pop','alternative','electronic','electro','edm','dance','house',
    'party','club','summer','happy','work-out',
    'romance','r-n-b','soul','latin',
    'chill','ambient','new-age','acoustic','sleep','study','classical',
    'sad','piano','rainy-day','singer-songwriter',
    'metal','hard-rock','rock','punk','alt-rock','rock-n-roll',
    'blues','folk'
  ]);

  // Mood → candidate genres (ONLY from the VALID list)
  const moodToGenres = {
    happy:     ['happy','pop','party','summer','indie-pop'],
    energetic: ['edm','dance','work-out','house','electro'],
    calm:      ['chill','ambient','new-age','acoustic','sleep'],
    sad:       ['sad','piano','acoustic','rainy-day','singer-songwriter'],
    romantic:  ['romance','r-n-b','soul','latin','pop'],       // removed "love"
    focus:     ['study','ambient','classical','sleep','chill'],// removed "lo-fi","beats"
    angry:     ['metal','hard-rock','rock','punk','alt-rock'],
    party:     ['party','dance','club','edm','pop'],
    nostalgic: ['rock-n-roll','blues','folk','rock','country'],// removed "soft-rock","throwback"
    neutral:   ['pop','indie','alternative','electronic','rock'],
  };

  // Filter to valid seeds and ensure we always have at least one
  let seeds = (moodToGenres[mood] || moodToGenres.neutral).filter(g => VALID.has(g));
  if (seeds.length === 0) seeds = moodToGenres.neutral;
  const seed_genres = seeds.slice(0, 5).join(',');

  try {
    const params = new URLSearchParams({
      limit: String(limit),
      market: 'US',
      seed_genres,
      ...features, // target_* fields
    });

    const response = await axios.get(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      { headers: { Authorization: `Bearer ${req.spotifyToken}` } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Recommendations error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to get recommendations' });
  }
});

// Create playlist
router.post('/create-playlist', authenticateSpotify, async (req, res) => {
  const { name, description, trackUris, userId } = req.body;
  
  try {
    // Create empty playlist
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
    
    // Add tracks to playlist
    if (trackUris && trackUris.length > 0) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris
        },
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
router.get('/audio-features/:trackId', authenticateSpotify, async (req, res) => {
  const { trackId } = req.params;
  
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Audio features error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get audio features' 
    });
  }
});

module.exports = router;