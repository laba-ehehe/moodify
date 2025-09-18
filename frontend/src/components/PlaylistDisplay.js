import React, { useState } from 'react';
import { Play, Pause, Save, ArrowLeft, ExternalLink } from 'lucide-react';

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

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#FFD700',
      sad: '#4169E1',
      energetic: '#FF4500',
      calm: '#98FB98',
      angry: '#DC143C',
      romantic: '#FF69B4',
      neutral: '#808080'
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="playlist-display">
      <div className="playlist-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="playlist-info">
          <h2 style={{ color: getMoodColor(playlist.mood) }}>
            {playlist.name}
          </h2>
          <p className="playlist-description">{playlist.description}</p>
          
          <div className="mood-stats">
            <div className="stat">
              <span className="stat-label">Energy:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill energy" 
                  style={{ width: `${playlist.audioFeatures.energy * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{Math.round(playlist.audioFeatures.energy * 100)}%</span>
            </div>
            
            <div className="stat">
              <span className="stat-label">Positivity:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill valence" 
                  style={{ width: `${playlist.audioFeatures.valence * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{Math.round(playlist.audioFeatures.valence * 100)}%</span>
            </div>
            
            <div className="stat">
              <span className="stat-label">Danceability:</span>
              <div className="stat-bar">
                <div 
                  className="stat-fill danceability" 
                  style={{ width: `${playlist.audioFeatures.danceability * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{Math.round(playlist.audioFeatures.danceability * 100)}%</span>
            </div>
          </div>
        </div>
        
        <button onClick={() => onSave(playlist)} className="save-button">
          <Save size={20} />
          Save to Spotify
        </button>
      </div>
      
      <div className="tracks-list">
        <div className="tracks-header">
          <span className="track-number">#</span>
          <span className="track-title">Title</span>
          <span className="track-artist">Artist</span>
          <span className="track-album">Album</span>
          <span className="track-duration">Duration</span>
          <span className="track-actions">Actions</span>
        </div>
        
        {playlist.tracks.map((track, index) => (
          <div 
            key={track.id} 
            className={`track-row ${currentlyPlaying === track.id ? 'playing' : ''}`}
          >
            <span className="track-number">{index + 1}</span>
            
            <div className="track-info">
              <img 
                src={track.album.images[2]?.url || track.album.images[0]?.url} 
                alt={track.album.name}
                className="track-image"
              />
              <span className="track-title">{track.name}</span>
            </div>
            
            <span className="track-artist">
              {track.artists.map(artist => artist.name).join(', ')}
            </span>
            
            <span className="track-album">{track.album.name}</span>
            
            <span className="track-duration">
              {formatDuration(track.duration_ms)}
            </span>
            
            <div className="track-actions">
              {track.preview_url && (
                <button
                  onClick={() => playPreview(track)}
                  className="preview-button"
                  title={currentlyPlaying === track.id ? 'Pause' : 'Play Preview'}
                >
                  {currentlyPlaying === track.id ? <Pause size={16} /> : <Play size={16} />}
                </button>
              )}
              
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
                title="Open in Spotify"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {currentlyPlaying && (
        <div className="now-playing">
          <span>Now playing preview</span>
          <button onClick={stopPlayback} className="stop-button">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaylistDisplay;