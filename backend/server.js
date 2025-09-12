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
