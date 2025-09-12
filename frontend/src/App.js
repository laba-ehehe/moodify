import React, { useState, useEffect, useCallback } from 'react';
import Homepage from './components/Homepage';
import PlaylistDisplay from './components/PlaylistDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { getUserProfile, getRecommendations, createPlaylist, refreshAccessToken } from './services/api';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);

  // Function to refresh the access token
  const refreshTokenFunc = useCallback(async () => {
    if (!refreshToken) {
      console.log('No refresh token available');
      return false;
    }
    
    try {
      console.log('Refreshing access token...');
      const response = await refreshAccessToken(refreshToken);
      
      if (response.access_token) {
        setAccessToken(response.access_token);
        // Spotify tokens expire in 1 hour, set expiry time
        setTokenExpiryTime(Date.now() + 55 * 60 * 1000); // 55 minutes from now
        
        if (response.refresh_token) {
          setRefreshToken(response.refresh_token);
        }
        
        console.log('Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setError('Session expired. Please login again.');
      // Clear tokens and redirect to login
      setAccessToken(null);
      setRefreshToken(null);
      setTokenExpiryTime(null);
      return false;
    }
  }, [refreshToken]);

  // Check for tokens in URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const refresh = urlParams.get('refresh_token');
    const urlError = urlParams.get('error');

    if (urlError) {
      setError(`Authentication error: ${urlError}`);
      return;
    }

    if (token) {
      setAccessToken(token);
      // Set token expiry time (55 minutes from now)
      setTokenExpiryTime(Date.now() + 55 * 60 * 1000);
      
      if (refresh) {
        setRefreshToken(refresh);
      }
      // Clean URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!accessToken || !tokenExpiryTime) return;

    // Check if token needs refresh every minute
    const checkTokenExpiry = setInterval(() => {
      const timeUntilExpiry = tokenExpiryTime - Date.now();
      
      // Refresh if less than 5 minutes until expiry
      if (timeUntilExpiry < 5 * 60 * 1000) {
        console.log('Token expiring soon, refreshing...');
        refreshTokenFunc();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkTokenExpiry);
  }, [accessToken, tokenExpiryTime, refreshTokenFunc]);

  // Fetch user profile when access token changes
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile(accessToken);
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // If it's a 401 error, try refreshing the token
      if (error.response?.status === 401) {
        const refreshed = await refreshTokenFunc();
        if (refreshed) {
          // Retry fetching profile with new token
          try {
            const profile = await getUserProfile(accessToken);
            setUser(profile);
          } catch (retryError) {
            setError('Failed to load user profile');
          }
        }
      } else {
        setError('Failed to load user profile');
      }
    }
  };

  const handleLogin = () => {
    const API_BASE_URL = process.env.NODE_ENV === 'production'
      ? 'https://moodify-1aa2.onrender.com'
      : 'http://localhost:5000';
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const generatePlaylist = async (moodData, inputText) => {
    setLoading(true);
    setError(null);
  
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 30000);
    
    try {
      // Get the current token from state
      const currentToken = accessToken;
      
      if (!currentToken) {
        clearTimeout(timeout);
        setError('No authentication token. Please login again.');
        setLoading(false);
        return;
      }
      
      const requestData = {
        energy: moodData.energy,
        valence: moodData.valence,
        danceability: moodData.danceability,
        acousticness: moodData.acousticness,
        mood: moodData.mood,
        limit: 20
      };

      console.log('Sending request with token:', currentToken ? 'Yes' : 'No');
      console.log('Token first 20 chars:', currentToken?.substring(0, 20));
      console.log('Request data:', requestData);

      const recs = await getRecommendations(currentToken, requestData, moodData.mood);
      
      clearTimeout(timeout);
      
      if (!recs || !recs.tracks || recs.tracks.length === 0) {
        setError('No tracks found for this mood. Please try a different mood.');
        setLoading(false);
        return;
      }
      
      const playlist = {
        name: `Moodify - ${moodData.mood} vibes`,
        description: `Generated from: "${inputText}" • Energy: ${Math.round(moodData.energy * 100)}% • Positivity: ${Math.round(moodData.valence * 100)}%`,
        tracks: recs.tracks,
        mood: moodData.mood,
        audioFeatures: moodData
      };
      
      setCurrentPlaylist(playlist);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to generate playlist:', error);
      
      if (error.response?.status === 401) {
        console.log('Token expired, attempting refresh...');
        const refreshed = await refreshTokenFunc();
        if (refreshed) {
          // Retry with new token - but we need to wait for state update
          setTimeout(async () => {
            try {
              const newToken = accessToken; // This should now be the updated token
              const requestData = {
                energy: moodData.energy,
                valence: moodData.valence,
                danceability: moodData.danceability,
                acousticness: moodData.acousticness,
                mood: moodData.mood,
                limit: 20
              };
              
              const recs = await getRecommendations(newToken, requestData, moodData.mood);
              
              if (!recs || !recs.tracks || recs.tracks.length === 0) {
                setError('No tracks found for this mood. Please try a different mood.');
                return;
              }
              
              const playlist = {
                name: `Moodify - ${moodData.mood} vibes`,
                description: `Generated from: "${inputText}" • Energy: ${Math.round(moodData.energy * 100)}% • Positivity: ${Math.round(moodData.valence * 100)}%`,
                tracks: recs.tracks,
                mood: moodData.mood,
                audioFeatures: moodData
              };
              
              setCurrentPlaylist(playlist);
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              setError('Failed to generate playlist. Please try logging in again.');
            }
          }, 100); // Small delay to ensure state update
        } else {
          setError('Session expired. Please login again.');
          handleLogout();
        }
      } else {
        setError(error.response?.data?.error || 'Failed to generate playlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const savePlaylistToSpotify = async (playlistData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const trackUris = playlistData.tracks.map(track => track.uri);
      
      const savedPlaylist = await createPlaylist(accessToken, {
        name: playlistData.name,
        description: playlistData.description,
        trackUris,
        userId: user.id
      });
      
      setError(null);
      alert('Playlist saved to your Spotify library!');
      return savedPlaylist;
    } catch (error) {
      console.error('Failed to save playlist:', error);
      
      // If it's a 401 error, try refreshing the token
      if (error.response?.status === 401) {
        const refreshed = await refreshTokenFunc();
        if (refreshed) {
          // Retry with new token
          try {
            const trackUris = playlistData.tracks.map(track => track.uri);
            
            const savedPlaylist = await createPlaylist(accessToken, {
              name: playlistData.name,
              description: playlistData.description,
              trackUris,
              userId: user.id
            });
            
            alert('Playlist saved to your Spotify library!');
            return savedPlaylist;
          } catch (retryError) {
            setError('Failed to save playlist to Spotify');
          }
        }
      } else {
        setError('Failed to save playlist to Spotify');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setCurrentPlaylist(null);
    setError(null);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setCurrentPlaylist(null);
    setTokenExpiryTime(null);
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!accessToken) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>🎵 Moodify</h1>
          <p>Generate playlists that match your mood</p>
          {error && <div className="error-message">{error}</div>}
          <button onClick={handleLogin} className="login-button">
            Connect with Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 Moodify</h1>
        <div className="header-right">
          {user && <span className="user-greeting">Hey, {user.display_name}!</span>}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
      
      <main className="app-main">
        {currentPlaylist ? (
          <PlaylistDisplay
            playlist={currentPlaylist}
            onSave={savePlaylistToSpotify}
            onBack={resetApp}
          />
        ) : (
          <Homepage onGeneratePlaylist={generatePlaylist} />
        )}
      </main>
    </div>
  );
}

export default App;