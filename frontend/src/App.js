import React, { useState, useEffect, useCallback } from 'react';
import Homepage from './components/Homepage';
import PlaylistDisplay from './components/PlaylistDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { getUserProfile, getRecommendations, createPlaylist, refreshAccessToken } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    console.log('=== Starting playlist generation ===');
    console.log('Mood data:', moodData);
    console.log('Input text:', inputText);
    
    setLoading(true);
    setError(null);
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please try again.');
      console.error('Playlist generation timed out');
    }, 30000); // 30 second timeout
    
    try {
      // Convert mood data to Spotify audio features format
      const requestData = {
        energy: moodData.energy,
        valence: moodData.valence,
        danceability: moodData.danceability,
        acousticness: moodData.acousticness,
        mood: moodData.mood,
        limit: 20
      };

      console.log('Sending request to backend:', requestData);

      const response = await getRecommendations(accessToken, requestData, moodData.mood);
      
      clearTimeout(timeout);
      
      console.log('=== Recommendations response received ===');
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('Has tracks?:', !!response.tracks);
      console.log('Tracks count:', response.tracks?.length);
      console.log('First track:', response.tracks?.[0]);
      
      // Validate response structure
      if (!response || !response.tracks || !Array.isArray(response.tracks)) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
      
      if (response.tracks.length === 0) {
        console.error('No tracks returned');
        throw new Error('No tracks found for this mood');
      }
      
      const playlist = {
        name: `moodify - ${moodData.mood} vibes`,
        description: `Generated from: "${inputText}"`,
        tracks: response.tracks,
        mood: moodData.mood,
        audioFeatures: moodData
      };
      
      console.log('Created playlist object:', {
        name: playlist.name,
        trackCount: playlist.tracks.length,
        firstTrack: playlist.tracks[0]?.name
      });
      
      setCurrentPlaylist(playlist);
      console.log('Playlist set successfully');
    } catch (error) {
      clearTimeout(timeout);
      console.error('=== Playlist generation error ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      
      // If it's a 401 error, try refreshing the token
      if (error.response?.status === 401) {
        console.log('Attempting token refresh...');
        const refreshed = await refreshTokenFunc();
        if (refreshed) {
          // Retry with new token
          try {
            const requestData = {
              energy: moodData.energy,
              valence: moodData.valence,
              danceability: moodData.danceability,
              acousticness: moodData.acousticness,
              mood: moodData.mood,
              limit: 20
            };
            
            console.log('Retrying with refreshed token...');
            const response = await getRecommendations(accessToken, requestData, moodData.mood);
            
            if (!response || !response.tracks || !Array.isArray(response.tracks)) {
              throw new Error('Invalid response from server');
            }
            
            const playlist = {
              name: `moodify - ${moodData.mood} vibes`,
              description: `Generated from: "${inputText}"`,
              tracks: response.tracks,
              mood: moodData.mood,
              audioFeatures: moodData
            };
            
            setCurrentPlaylist(playlist);
            console.log('Playlist set successfully after retry');
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setError('Failed to generate playlist. Please try again.');
          }
        }
      } else {
        setError(error.message || 'Failed to generate playlist. Please try again.');
      }
    } finally {
      setLoading(false);
      console.log('=== Playlist generation complete ===');
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

  // Debug logging for state changes
  useEffect(() => {
    console.log('=== App State Update ===');
    console.log('Has access token:', !!accessToken);
    console.log('Has user:', !!user);
    console.log('Current playlist:', currentPlaylist);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [accessToken, user, currentPlaylist, loading, error]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!accessToken) {
    return (
      // <div className="app-container spotify-dark">
      //   <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      //     <div className="text-center login-box">
      //       <div className="mb-4">
      //         <span className="logo-emoji">🎵</span>
      //       </div>
      //       <h1 className="display-4 mb-3 text-white fw-bold">moodify</h1>
      //       <p className="lead mb-4 text-white-50">Generate playlists that match your mood ✨</p>
      //       {error && (
      //         <div className="alert alert-danger mb-4" role="alert">
      //           {error}
      //         </div>
      //       )}
      //       <button onClick={handleLogin} className="btn btn-spotify btn-lg px-5 py-3">
      //         <i className="fab fa-spotify me-2"></i>
      //         Connect with Spotify
      //       </button>
      //     </div>
      //   </div>
      // </div>
      <div className="app-container login-screen">
        {/* Animated background elements */}
        <div className="animated-bg">
          <div className="floating-emoji emoji-1">🎵</div>
          <div className="floating-emoji emoji-2">🎸</div>
          <div className="floating-emoji emoji-3">🎹</div>
          <div className="floating-emoji emoji-4">🎤</div>
          <div className="floating-emoji emoji-5">🎧</div>
          <div className="floating-emoji emoji-6">💿</div>
          <div className="floating-emoji emoji-7">🎺</div>
          <div className="floating-emoji emoji-8">🥁</div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="login-content">
            {/* Mood cards showcase */}
            <div className="mood-showcase">
              <div className="mood-card-preview card-happy">
                <span className="mood-emoji">😊</span>
                <span className="mood-label">Happy</span>
              </div>
              <div className="mood-card-preview card-energetic">
                <span className="mood-emoji">⚡</span>
                <span className="mood-label">Energetic</span>
              </div>
              <div className="mood-card-preview card-calm">
                <span className="mood-emoji">🧘</span>
                <span className="mood-label">Calm</span>
              </div>
              <div className="mood-card-preview card-romantic">
                <span className="mood-emoji">💕</span>
                <span className="mood-label">Romantic</span>
              </div>
            </div>
            
            {/* Main login box */}
            <div className="text-center login-box-enhanced">
              <div className="logo-container mb-4">
                <div className="logo-pulse">
                  <span className="logo-emoji-main">🎵</span>
                </div>
              </div>
              
              <h1 className="display-3 mb-2 text-white fw-bold login-title">
                moodify
              </h1>
              
              <div className="tagline-container mb-5">
                <p className="tagline-text">
                  Your mood, your music
                </p>
                <div className="feature-pills">
                  <span className="feature-tag">AI-Powered</span>
                  <span className="feature-tag">20+ Moods</span>
                  <span className="feature-tag">Instant Playlists</span>
                </div>
              </div>
              
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              
              <button onClick={handleLogin} className="btn-spotify-enhanced">
                <span className="btn-content">
                  <i className="fab fa-spotify me-2"></i>
                  Connect with Spotify
                </span>
                <span className="btn-glow"></span>
              </button>
              
              <p className="login-disclaimer mt-4">
                Free • No credit card • Works with your Spotify account
              </p>
            </div>
            
            {/* Bottom wave animation */}
            <div className="wave-container">
              <svg className="waves" viewBox="0 24 150 28" preserveAspectRatio="none">
                <defs>
                  <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className="wave-parallax">
                  <use href="#wave" x="48" y="0" fill="rgba(29,185,84,0.1)" />
                  <use href="#wave" x="48" y="3" fill="rgba(29,185,84,0.05)" />
                  <use href="#wave" x="48" y="5" fill="rgba(29,185,84,0.03)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container spotify-dark">
      {/* Header */}
      <nav className="navbar navbar-dark spotify-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="logo-emoji me-2">🎵</span>
            <span className="fw-bold">moodify</span>
          </a>
          <div className="d-flex align-items-center">
            {user && (
              <span className="text-white-50 me-3 d-none d-sm-inline">
                Hey, {user.display_name}! ✨
              </span>
            )}
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Error Alert */}
      {error && (
        <div className="container-fluid">
          <div className="alert alert-danger alert-dismissible fade show m-3" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="main-content">
        <div className="container-fluid p-3 p-md-4">
          {currentPlaylist ? (
            <PlaylistDisplay
              playlist={currentPlaylist}
              onSave={savePlaylistToSpotify}
              onBack={resetApp}
            />
          ) : (
            <Homepage onGeneratePlaylist={generatePlaylist} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;