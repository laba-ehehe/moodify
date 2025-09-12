import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://moodify-1aa2.onrender.com'
  : 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// User profile
export const getUserProfile = async (accessToken) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const response = await api.get('/api/spotify/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
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
export const getRecommendations = async (accessToken, audioFeatures, mood) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  console.log('Getting recommendations with:', {
    mood,
    audioFeatures,
    hasToken: !!accessToken
  });
  
  const response = await api.post(
    '/api/spotify/recommendations',
    { 
      ...audioFeatures, 
      mood: mood || 'neutral',
      limit: audioFeatures.limit || 20
    },
    { 
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      } 
    }
  );
  return response.data;
};

// Create playlist
export const createPlaylist = async (accessToken, playlistData) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const response = await api.post('/api/spotify/create-playlist', playlistData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};

// Refresh token
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token provided');
  }
  
  const response = await api.post('/auth/refresh', { 
    refresh_token: refreshToken 
  });
  return response.data;
};