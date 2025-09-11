import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// User profile
export const getUserProfile = async (accessToken) => {
  const response = await api.get('/api/spotify/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Mood analysis
export const analyzeMoodFromText = async (text) => {
  const response = await api.post('/api/mood/analyze-text', { text });
  return response.data;
};

export const analyzeMoodFromEmojis = async (emojis) => {
  const response = await api.post('/api/mood/analyze-emoji', { emojis });
  return response.data;
};

// Spotify recommendations
export const getRecommendations = async (accessToken, audioFeatures) => {
  const response = await api.post('/api/spotify/recommendations', audioFeatures, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Create playlist
export const createPlaylist = async (accessToken, playlistData) => {
  const response = await api.post('/api/spotify/create-playlist', playlistData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Refresh token
export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
  return response.data;
};