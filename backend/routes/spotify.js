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





// router.post('/recommendations', authenticateSpotify, async (req, res) => {
//   // Accept either { audioFeatures, limit, mood } OR a flat body
//   const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
//   const features = audioFeatures || req.body;

//   if (!features || Object.keys(features).length === 0) {
//     return res.status(400).json({ error: 'No audio feature targets provided' });
//   }

//   // Spotify's valid seed genres (subset: only what we use here)
//   const VALID = new Set([
//     'pop','indie','indie-pop','alternative','electronic','electro','edm','dance','house',
//     'party','club','summer','happy','work-out',
//     'romance','r-n-b','soul','latin',
//     'chill','ambient','new-age','acoustic','sleep','study','classical',
//     'sad','piano','rainy-day','singer-songwriter',
//     'metal','hard-rock','rock','punk','alt-rock','rock-n-roll',
//     'blues','folk'
//   ]);

//   // Mood → candidate genres (ONLY from the VALID list)
//   const moodToGenres = {
//     happy:     ['happy','pop','party','summer','indie-pop'],
//     energetic: ['edm','dance','work-out','house','electro'],
//     calm:      ['chill','ambient','new-age','acoustic','sleep'],
//     sad:       ['sad','piano','acoustic','rainy-day','singer-songwriter'],
//     romantic:  ['romance','r-n-b','soul','latin','pop'],       // removed "love"
//     focus:     ['study','ambient','classical','sleep','chill'],// removed "lo-fi","beats"
//     angry:     ['metal','hard-rock','rock','punk','alt-rock'],
//     party:     ['party','dance','club','edm','pop'],
//     nostalgic: ['rock-n-roll','blues','folk','rock','country'],// removed "soft-rock","throwback"
//     neutral:   ['pop','indie','alternative','electronic','rock'],
//   };

//   // Filter to valid seeds and ensure we always have at least one
//   let seeds = (moodToGenres[mood] || moodToGenres.neutral).filter(g => VALID.has(g));
//   if (seeds.length === 0) seeds = moodToGenres.neutral;
//   const seed_genres = seeds.slice(0, 5).join(',');

//   try {
//     const params = new URLSearchParams({
//       limit: String(limit),
//       market: 'US',
//       seed_genres,
//       ...features, // target_* fields
//     });

//     const response = await axios.get(
//       `https://api.spotify.com/v1/recommendations?${params.toString()}`,
//       { headers: { Authorization: `Bearer ${req.spotifyToken}` } }
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error('Recommendations error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ error: 'Failed to get recommendations' });
//   }
// });






// let cachedSeeds = { set: new Set(), fetchedAt: 0 };
// const ONE_DAY = 24 * 60 * 60 * 1000;

// async function getValidSeeds(token) {
//   const now = Date.now();
//   if (cachedSeeds.set.size > 0 && now - cachedSeeds.fetchedAt < ONE_DAY) {
//     return cachedSeeds.set;
//   }
//   const resp = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   const seeds = new Set(resp.data.genres.map(g => g.toLowerCase()));
//   cachedSeeds = { set: seeds, fetchedAt: now };
//   return seeds;
// }

// router.post('/recommendations', authenticateSpotify, async (req, res) => {
//   const { audioFeatures, limit = 20, mood = 'neutral' } = req.body;
//   const features = audioFeatures || req.body;

//   if (!features || Object.keys(features).length === 0) {
//     return res.status(400).json({ error: 'No audio features' });
//   }

//   try {
//     const validSeeds = await getValidSeeds(req.spotifyToken);

//     const moodToCandidates = {
//       happy:     ['happy','pop','party','summer','indie-pop'],
//       energetic: ['energetic','edm','dance','work-out','house','electro'],
//       calm:      ['calm','chill','ambient','new-age','acoustic','sleep'],
//       sad:       ['sad','piano','acoustic','rainy-day','singer-songwriter'],
//       romantic:  ['romance','r-n-b','soul','latin','pop'],
//       focus:     ['study','ambient','classical','sleep','chill'],
//       angry:     ['angry','metal','hard-rock','rock','punk','alt-rock'],
//       party:     ['party','dance','club','edm','pop'],
//       nostalgic: ['nostalgia','rock-n-roll','blues','folk','rock','country'],
//       neutral:   ['pop','indie','alternative','electronic','rock'],
//     };

//     const candidates = [
//       ...(moodToCandidates[mood] || []),
//       mood // try raw mood term
//     ];

//     const seedGenres = candidates
//       .map(c => c.toLowerCase().replace(/\s+/g, '-'))
//       .filter(c => validSeeds.has(c))
//       .slice(0, 5);

//     if (seedGenres.length === 0) {
//       seedGenres.push('pop'); // safe default
//     }

//     const params = new URLSearchParams({
//       limit: String(limit),
//       market: 'US',
//       seed_genres: seedGenres.join(','),
//       ...features
//     });

//     const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params}`, {
//       headers: { Authorization: `Bearer ${req.spotifyToken}` }
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error('Recommendations error:', err.response?.data || err.message);
//     res.status(err.response?.status || 500).json({ error: 'Failed to get recommendations' });
//   }
// });





// ---------- Dynamic genre seed cache (24h) ----------
let cachedSeeds = { set: new Set(), fetchedAt: 0 };
const ONE_DAY = 24 * 60 * 60 * 1000;

async function getValidSeeds(token) {
  const now = Date.now();
  if (cachedSeeds.set.size > 0 && now - cachedSeeds.fetchedAt < ONE_DAY) {
    return cachedSeeds.set;
  }
  const resp = await axios.get(
    'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const seeds = new Set((resp.data.genres || []).map(g => String(g).toLowerCase()));
  cachedSeeds = { set: seeds, fetchedAt: now };
  return seeds;
}

// ---------- Allowed feature keys for /v1/recommendations ----------
// const ALLOWED_FEATURE_KEYS = new Set([
//   // targets
//   'target_acousticness','target_danceability','target_duration_ms','target_energy',
//   'target_instrumentalness','target_key','target_liveness','target_loudness',
//   'target_mode','target_popularity','target_speechiness','target_tempo',
//   'target_time_signature','target_valence',
//   // mins / maxes (supported by Spotify)
//   'min_acousticness','max_acousticness','min_danceability','max_danceability',
//   'min_duration_ms','max_duration_ms','min_energy','max_energy',
//   'min_instrumentalness','max_instrumentalness','min_key','max_key',
//   'min_liveness','max_liveness','min_loudness','max_loudness',
//   'min_mode','max_mode','min_popularity','max_popularity',
//   'min_speechiness','max_speechiness','min_tempo','max_tempo',
//   'min_time_signature','max_time_signature','min_valence','max_valence'
// ]);
const ALLOWED_FEATURE_KEYS = new Set([
  // target_*
  'target_acousticness',
  'target_danceability',
  'target_duration_ms',
  'target_energy',
  'target_instrumentalness',
  'target_key',
  'target_liveness',
  'target_mode',
  'target_popularity',
  'target_speechiness',
  'target_time_signature',
  'target_valence',

  // min_*/max_* versions (Spotify supports these)
  'min_acousticness','max_acousticness',
  'min_danceability','max_danceability',
  'min_duration_ms','max_duration_ms',
  'min_energy','max_energy',
  'min_instrumentalness','max_instrumentalness',
  'min_key','max_key',
  'min_liveness','max_liveness',
  'min_mode','max_mode',
  'min_popularity','max_popularity',
  'min_speechiness','max_speechiness',
  'min_time_signature','max_time_signature',
  'min_valence','max_valence'
]);


function sanitizeFeatures(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (ALLOWED_FEATURE_KEYS.has(k) && v !== undefined && v !== null && v !== '') {
      out[k] = String(v);
    }
  }
  return out;
}

// ---------- Mood → candidate genres (broad; we’ll filter with Spotify’s list) ----------
const MOOD_TO_CANDIDATES = {
  happy:     ['happy','pop','party','summer','indie-pop'],
  energetic: ['energetic','edm','dance','work-out','house','electro'],
  calm:      ['calm','chill','ambient','new-age','acoustic','sleep'],
  sad:       ['sad','piano','acoustic','rainy-day','singer-songwriter'],
  romantic:  ['romance','r-n-b','soul','latin','pop'],
  focus:     ['study','ambient','classical','sleep','chill'],
  angry:     ['angry','metal','hard-rock','rock','punk','alt-rock'],
  party:     ['party','dance','club','edm','pop'],
  nostalgic: ['nostalgia','rock-n-roll','blues','folk','rock','country'],
  neutral:   ['pop','indie','alternative','electronic','rock'],
};

function pickSeeds(mood, validSet) {
  const candidates = [
    ...(MOOD_TO_CANDIDATES[mood] || []),
    String(mood || '').toLowerCase()
  ];
  const cleaned = [];
  for (const c of candidates) {
    const k = String(c).trim().toLowerCase().replace(/\s+/g, '-');
    if (k && validSet.has(k) && !cleaned.includes(k)) cleaned.push(k);
    if (cleaned.length === 5) break;
  }
  if (cleaned.length > 0) return cleaned;
  // fallback to neutral, then random sample
  const neutral = MOOD_TO_CANDIDATES.neutral.filter(g => validSet.has(g)).slice(0, 5);
  if (neutral.length > 0) return neutral;
  // last resort: sample any 5 from Spotify's list
  const all = Array.from(validSet);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, 5);
}

// ---------- FINAL ROUTE ----------
router.post('/recommendations', authenticateSpotify, async (req, res) => {
  // Accept either { audioFeatures, limit, mood } OR a flat body
  const { audioFeatures, limit = 20, mood: moodIn = 'neutral' } = req.body;
  const featuresRaw = audioFeatures || req.body;
  const features = sanitizeFeatures(featuresRaw);

  if (Object.keys(features).length === 0) {
    return res.status(400).json({ error: 'No audio feature targets provided' });
  }

  try {
    // 1) Get full official genre list
    const validSeeds = await getValidSeeds(req.spotifyToken);

    // 2) Pick & filter seeds
    const mood = String(moodIn || 'neutral').toLowerCase();
    const seeds = pickSeeds(mood, validSeeds);
    const seed_genres = seeds.join(',');

    // 3) Build URL (explicit .toString()) and call Spotify
    const params = new URLSearchParams({
      limit: String(limit),
      market: 'US',
      seed_genres,
      ...features
    }).toString();

    const url = `https://api.spotify.com/v1/recommendations?${params}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${req.spotifyToken}` }
    });

    res.json(response.data);
  } catch (error) {
    // richer error output to debug 404s quickly
    console.error('Recommendations error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
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