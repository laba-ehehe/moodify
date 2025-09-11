import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import PlaylistDisplay from './components/PlaylistDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { getUserProfile, getRecommendations, createPlaylist } from './services/api';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for tokens in URL (from Spotify redirect)
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
      if (refresh) setRefreshToken(refresh);
      // Clean URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

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
      setError('Failed to load user profile');
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
    
    try {
      // Convert mood data to Spotify audio features format
      const audioFeatures = {
        target_energy: moodData.energy,
        target_valence: moodData.valence,
        target_danceability: moodData.danceability,
        target_acousticness: moodData.acousticness,
        target_tempo: moodData.tempo,
        target_loudness: moodData.loudness,
        target_mode: moodData.mode,
        limit: 20
      };

      const recommendations = await getRecommendations(accessToken, audioFeatures);
      
      const playlist = {
        name: `Moodify - ${moodData.mood} vibes`,
        description: `Generated from: "${inputText}" • Energy: ${Math.round(moodData.energy * 100)}% • Positivity: ${Math.round(moodData.valence * 100)}%`,
        tracks: recommendations.tracks,
        mood: moodData.mood,
        audioFeatures: moodData
      };
      
      setCurrentPlaylist(playlist);
    } catch (error) {
      console.error('Failed to generate playlist:', error);
      setError('Failed to generate playlist. Please try again.');
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
      setError('Failed to save playlist to Spotify');
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setCurrentPlaylist(null);
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
        {user && <span className="user-greeting">Hey, {user.display_name}!</span>}
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