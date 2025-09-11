const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');
const router = express.Router();

// Store code verifiers temporarily (use Redis in production)
const codeVerifiers = new Map();

// Generate code verifier and challenge for PKCE
function generateCodeChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

// Initiate Spotify login
router.get('/login', (req, res) => {
  const { codeVerifier, codeChallenge } = generateCodeChallenge();
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store code verifier with state as key
  codeVerifiers.set(state, codeVerifier);
  
  const scope = 'playlist-modify-public playlist-modify-private streaming user-read-playback-state user-modify-playback-state';
  
  const params = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// Handle Spotify callback
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=${error}`);
  }
  
  const codeVerifier = codeVerifiers.get(state);
  if (!codeVerifier) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=invalid_state`);
  }
  
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        code_verifier: codeVerifier,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const { access_token, refresh_token } = response.data;
    
    // Clean up stored code verifier
    codeVerifiers.delete(state);
    
    // Redirect to frontend with tokens
    res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}?error=token_exchange_failed`);
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: process.env.SPOTIFY_CLIENT_ID,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Refresh token error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;