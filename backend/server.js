const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'https://moodify-orpin.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

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

// Auth routes
app.get('/auth/test', (req, res) => {
  res.json({
    message: 'Auth route working!',
    spotify_configured: !!process.env.SPOTIFY_CLIENT_ID
  });
});

app.get('/auth/login', (req, res) => {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    return res.status(500).json({ error: 'Spotify not configured' });
  }

  const authURL = `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
    `scope=playlist-modify-public playlist-modify-private&` +
    `redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;
  
  res.redirect(authURL);
});

// NO catch-all route - just let Express handle 404s naturally

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this route to your backend server.js
app.get('/auth/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    console.error('Spotify auth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}?error=${error}`);
  }
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=no_authorization_code`);
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const { access_token, refresh_token } = tokenResponse.data;
    
    // Redirect back to frontend with tokens
    res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}&refresh_token=${refresh_token}`);
    
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}?error=token_exchange_failed`);
  }
});