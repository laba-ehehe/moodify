// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const querystring = require('querystring');
// const { analyzeTextMood, analyzeEmojiMood } = require('./utils/moodAnalyzer');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 10000;

// // Middleware
// app.use(cors({
//   origin: [
//     'https://moodify-orpin.vercel.app',
//     'http://localhost:3000'
//   ],
//   credentials: true
// }));
// app.use(express.json());

// // Middleware to check auth token
// const authenticateSpotify = (req, res, next) => {
//   const token = req.headers.authorization?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ error: 'No access token provided' });
//   }
//   req.spotifyToken = token;
//   next();
// };

// // Root route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Moodify Backend API is running!',
//     status: 'success',
//     environment: process.env.NODE_ENV || 'production'
//   });
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     timestamp: new Date().toISOString()
//   });
// });

// // Auth login route
// app.get('/auth/login', (req, res) => {
//   if (!process.env.SPOTIFY_CLIENT_ID) {
//     return res.status(500).json({ error: 'Spotify not configured' });
//   }

//   const authURL = `https://accounts.spotify.com/authorize?` +
//     `response_type=code&` +
//     `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
//     `scope=playlist-modify-public playlist-modify-private&` +
//     `redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&` +
//     `state=random_state_string`;
  
//   res.redirect(authURL);
// });

// // Auth callback route
// app.get('/auth/callback', async (req, res) => {
//   const { code, state, error } = req.query;
  
//   if (error) {
//     return res.redirect(`${process.env.FRONTEND_URL}?error=${error}`);
//   }
  
//   if (!code) {
//     return res.redirect(`${process.env.FRONTEND_URL}?error=no_authorization_code`);
//   }

//   try {
//     const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
//       querystring.stringify({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
//         client_id: process.env.SPOTIFY_CLIENT_ID,
//         client_secret: process.env.SPOTIFY_CLIENT_SECRET,
//       }), {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
    
//     const { access_token, refresh_token } = tokenResponse.data;
    
//     res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}&refresh_token=${refresh_token || ''}`);
    
//   } catch (error) {
//     console.error('Token exchange error:', error.response?.data || error.message);
//     res.redirect(`${process.env.FRONTEND_URL}?error=token_exchange_failed`);
//   }
// });

// // Get user profile
// app.get('/api/spotify/me', authenticateSpotify, async (req, res) => {
//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me', {
//       headers: {
//         'Authorization': `Bearer ${req.spotifyToken}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Get profile error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ 
//       error: 'Failed to get user profile' 
//     });
//   }
// });

// // Mood analysis for text
// app.post('/api/mood/analyze-text', (req, res) => {
//   try {
//     const { text } = req.body;
    
//     if (!text) {
//       return res.status(400).json({ error: 'Text required' });
//     }
    
//     const moodData = analyzeTextMood(text);
//     res.json(moodData);
//   } catch (error) {
//     console.error('Text analysis error:', error.message);
//     res.status(500).json({ error: 'Failed to analyze text mood' });
//   }
// });

// // Mood analysis for emojis
// app.post('/api/mood/analyze-emoji', (req, res) => {
//   try {
//     const { emojis } = req.body;
    
//     if (!emojis || !Array.isArray(emojis)) {
//       return res.status(400).json({ error: 'Emojis array required' });
//     }
    
//     const moodData = analyzeEmojiMood(emojis);
//     res.json(moodData);
//   } catch (error) {
//     console.error('Emoji analysis error:', error.message);
//     res.status(500).json({ error: 'Failed to analyze emoji mood' });
//   }
// });

// // Generate recommendations
// app.post('/api/spotify/recommendations', authenticateSpotify, async (req, res) => {
//   const { target_energy, target_valence, target_danceability, limit = 20 } = req.body;
  
//   try {
//     const params = new URLSearchParams({
//       limit: limit.toString(),
//       market: 'US',
//       target_energy: target_energy.toString(),
//       target_valence: target_valence.toString(),
//       target_danceability: target_danceability.toString()
//     });
    
//     const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params}`, {
//       headers: {
//         'Authorization': `Bearer ${req.spotifyToken}`,
//       },
//     });
    
//     res.json(response.data);
//   } catch (error) {
//     console.error('Recommendations error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ 
//       error: 'Failed to get recommendations' 
//     });
//   }
// });

// // Create playlist
// app.post('/api/spotify/create-playlist', authenticateSpotify, async (req, res) => {
//   const { name, description, trackUris, userId } = req.body;
  
//   try {
//     const playlistResponse = await axios.post(
//       `https://api.spotify.com/v1/users/${userId}/playlists`,
//       {
//         name,
//         description,
//         public: false
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${req.spotifyToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     const playlistId = playlistResponse.data.id;
    
//     if (trackUris && trackUris.length > 0) {
//       await axios.post(
//         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//         { uris: trackUris },
//         {
//           headers: {
//             'Authorization': `Bearer ${req.spotifyToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//     }
    
//     res.json(playlistResponse.data);
//   } catch (error) {
//     console.error('Create playlist error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({ 
//       error: 'Failed to create playlist' 
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'https://moodify-orpin.vercel.app', // production frontend
    'http://localhost:3000'             // local frontend
  ],
  credentials: true
}));
app.use(express.json());

// Import route modules
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const spotifyRoutes = require('./routes/spotify');

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Moodify Backend API is running!',
    status: 'success',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/spotify', spotifyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
