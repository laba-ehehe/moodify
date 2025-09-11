const express = require('express');
const cors = require('cors');
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

// Root route - THIS WAS MISSING!
app.get('/', (req, res) => {
  res.json({ 
    message: 'Moodify Backend API is running!',
    status: 'success',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/health',
      auth_login: '/auth/login',
      auth_test: '/auth/test'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    spotify_configured: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)
  });
});

// Auth routes
app.get('/auth/test', (req, res) => {
  res.json({
    message: 'Auth route working!',
    spotify_client_id: process.env.SPOTIFY_CLIENT_ID ? 'Set ✅' : 'Missing ❌'
  });
});

app.get('/auth/login', (req, res) => {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    return res.status(500).json({ error: 'Spotify not configured' });
  }

  // Basic Spotify auth URL (we'll add full PKCE later)
  const authURL = `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
    `scope=playlist-modify-public playlist-modify-private&` +
    `redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;
  
  res.redirect(authURL);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});