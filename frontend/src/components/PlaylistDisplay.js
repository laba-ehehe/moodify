import React, { useState } from 'react';
import { Play, Pause, Save, ArrowLeft, ExternalLink, Sparkles, Music } from 'lucide-react';

function PlaylistDisplay({ playlist, onSave, onBack }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audio, setAudio] = useState(null);

  const playPreview = (track) => {
    if (!track.preview_url) {
      alert('Preview not available for this track');
      return;
    }

    // Stop current audio if playing
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    if (currentlyPlaying === track.id) {
      setCurrentlyPlaying(null);
      return;
    }

    const newAudio = new Audio(track.preview_url);
    newAudio.play();
    setCurrentlyPlaying(track.id);
    setAudio(newAudio);

    newAudio.onended = () => {
      setCurrentlyPlaying(null);
      setAudio(null);
    };
  };

  const stopPlayback = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setCurrentlyPlaying(null);
    }
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      energetic: '⚡',
      calm: '🧘',
      angry: '😠',
      romantic: '💕',
      party: '🎉',
      nostalgic: '💭',
      sleepy: '😴',
      workout: '💪',
      confident: '👑',
      dreamy: '☁️',
      groovy: '🕺',
      lonely: '💔',
      hopeful: '🌈',
      anxious: '😰',
      playful: '🤪',
      focused: '🎯',
      neutral: '😌'
    };
    return emojis[mood] || emojis.neutral;
  };

  return (
    <div className="playlist-display-container">
      {/* Playlist Header Card */}
      <div className="playlist-header-section">
        <div className="playlist-actions-bar">
          <button onClick={onBack} className="playlist-back-btn">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <button onClick={() => onSave(playlist)} className="playlist-save-btn">
            <Save size={18} />
            <span>Save to Spotify</span>
          </button>
        </div>

        <div className="playlist-hero">
          <div className="playlist-mood-icon">
            <span className="mood-emoji-large">{getMoodEmoji(playlist.mood)}</span>
          </div>
          
          <div className="playlist-details">
            <h1 className="playlist-main-title">
              moodify - {playlist.mood} vibes
            </h1>
            <p className="playlist-subtitle">{playlist.description}</p>
            
            {/* Audio Features */}
            <div className="audio-features">
              <div className="feature-pill">
                <span className="feature-icon">⚡</span>
                <span className="feature-label">Energy</span>
                <span className="feature-value">{Math.round(playlist.audioFeatures.energy * 100)}%</span>
              </div>
              <div className="feature-pill">
                <span className="feature-icon">✨</span>
                <span className="feature-label">Positivity</span>
                <span className="feature-value">{Math.round(playlist.audioFeatures.valence * 100)}%</span>
              </div>
              <div className="feature-pill">
                <span className="feature-icon">💃</span>
                <span className="feature-label">Danceability</span>
                <span className="feature-value">{Math.round(playlist.audioFeatures.danceability * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Mood Bars */}
        <div className="mood-visualization">
          <div className="mood-bar-item">
            <div className="mood-bar-label">
              <span className="bar-icon">⚡</span>
              <span>Energy</span>
            </div>
            <div className="mood-bar-track">
              <div 
                className="mood-bar-fill energy-bar"
                style={{ width: `${playlist.audioFeatures.energy * 100}%` }}
              />
            </div>
          </div>
          
          <div className="mood-bar-item">
            <div className="mood-bar-label">
              <span className="bar-icon">✨</span>
              <span>Positivity</span>
            </div>
            <div className="mood-bar-track">
              <div 
                className="mood-bar-fill positivity-bar"
                style={{ width: `${playlist.audioFeatures.valence * 100}%` }}
              />
            </div>
          </div>
          
          <div className="mood-bar-item">
            <div className="mood-bar-label">
              <span className="bar-icon">💃</span>
              <span>Dance</span>
            </div>
            <div className="mood-bar-track">
              <div 
                className="mood-bar-fill dance-bar"
                style={{ width: `${playlist.audioFeatures.danceability * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="playlist-tracks-section">
        <div className="tracks-header">
          <Music size={20} />
          <span>Your Personalized Tracks</span>
          <span className="track-count">{playlist.tracks.length} songs</span>
        </div>

        <div className="tracks-list">
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className={`track-card ${currentlyPlaying === track.id ? 'playing' : ''}`}
            >
              <div className="track-number-col">
                <span className="track-index">{index + 1}</span>
              </div>

              <div className="track-main">
                <img
                  src={track.album.images[2]?.url || track.album.images[0]?.url}
                  alt={track.album.name}
                  className="track-artwork"
                />
                
                <div className="track-details">
                  <div className="track-title">{track.name}</div>
                  <div className="track-subtitle">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </div>
                </div>
              </div>

              <div className="track-album-col d-none d-lg-block">
                <span className="track-album-name">{track.album.name}</span>
              </div>

              <div className="track-duration-col">
                <span className="track-time">{formatDuration(track.duration_ms)}</span>
              </div>

              <div className="track-actions-col">
                {track.preview_url && (
                  <button
                    onClick={() => playPreview(track)}
                    className="track-play-btn"
                    title={currentlyPlaying === track.id ? 'Pause' : 'Play Preview'}
                  >
                    {currentlyPlaying === track.id ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                )}
                
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-spotify-link"
                  title="Open in Spotify"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentlyPlaying && (
        <div className="now-playing-bar">
          <div className="now-playing-content">
            <span className="now-playing-icon">🎵</span>
            <span className="now-playing-text">Playing preview...</span>
            <button onClick={stopPlayback} className="stop-preview-btn">
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistDisplay;