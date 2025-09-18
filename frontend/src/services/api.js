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
    console.log('=== API Request ===');
    console.log('Method:', config.method?.toUpperCase());
    console.log('URL:', config.baseURL + config.url);
    console.log('Full URL:', config.url?.startsWith('http') ? config.url : config.baseURL + config.url);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.log('==================');
    return config;
  },
  (error) => {
    console.error('=== Request Error ===');
    console.error('Error:', error);
    console.error('===================');
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('=== API Response ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config.baseURL + response.config.url);
    console.log('Data type:', typeof response.data);
    console.log('Data keys:', response.data ? Object.keys(response.data) : 'null');
    
    // Log specific details for recommendations endpoint
    if (response.config.url?.includes('recommendations')) {
      console.log('Recommendations response:');
      console.log('- Has tracks:', !!response.data?.tracks);
      console.log('- Track count:', response.data?.tracks?.length);
      console.log('- First track:', response.data?.tracks?.[0] ? {
        name: response.data.tracks[0].name,
        artists: response.data.tracks[0].artists?.map(a => a.name).join(', '),
        uri: response.data.tracks[0].uri
      } : 'none');
    }
    
    console.log('Full response data:', response.data);
    console.log('==================');
    return response;
  },
  (error) => {
    console.error('=== Response Error ===');
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.baseURL + error.config?.url);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('====================');
    return Promise.reject(error);
  }
);

// User profile
export const getUserProfile = async (accessToken) => {
  console.log('getUserProfile called with token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'none');
  
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
  console.log('analyzeMoodFromText called with:', text);
  
  const response = await api.post('/api/mood/analyze-text', { text });
  
  console.log('Mood analysis result:', response.data);
  return response.data;
};

export const analyzeMoodFromEmojis = async (emojis) => {
  console.log('analyzeMoodFromEmojis called with:', emojis);
  
  const response = await api.post('/api/mood/analyze-emoji', { emojis });
  
  console.log('Emoji analysis result:', response.data);
  return response.data;
};

// Spotify recommendations
export const getRecommendations = async (accessToken, audioFeatures, mood) => {
  console.log('=== getRecommendations called ===');
  console.log('Has token:', !!accessToken);
  console.log('Audio features:', audioFeatures);
  console.log('Mood:', mood);
  
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  try {
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
    
    console.log('=== getRecommendations response received ===');
    console.log('Response exists:', !!response);
    console.log('Response.data exists:', !!response.data);
    console.log('Response.data type:', typeof response.data);
    console.log('Response.data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('=== getRecommendations error ===');
    console.error('Error:', error);
    throw error;
  }
};

// Create playlist
export const createPlaylist = async (accessToken, playlistData) => {
  console.log('createPlaylist called');
  console.log('Playlist data:', {
    name: playlistData.name,
    trackCount: playlistData.trackUris?.length,
    userId: playlistData.userId
  });
  
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const response = await api.post('/api/spotify/create-playlist', playlistData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
  });
  
  console.log('Playlist created:', response.data);
  return response.data;
};

// Refresh token
export const refreshAccessToken = async (refreshToken) => {
  console.log('refreshAccessToken called');
  
  if (!refreshToken) {
    throw new Error('No refresh token provided');
  }
  
  const response = await api.post('/auth/refresh', {
    refresh_token: refreshToken
  });
  
  console.log('Token refreshed successfully');
  return response.data;
};