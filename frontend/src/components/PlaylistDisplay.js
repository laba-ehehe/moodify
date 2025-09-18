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
    <div className="playlist-container">
      <div className="row">
        <div className="col-12">
          {/* Playlist Header */}
          <div className="playlist-header-card mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <button onClick={onBack} className="back-btn">
                <ArrowLeft size={20} className="me-2" />
                Back
              </button>
              <button onClick={() => onSave(playlist)} className="save-playlist-btn">
                <Save size={20} className="me-2" />
                Save to Spotify
              </button>
            </div>
            
            <div className="playlist-info">
              <h2 className="playlist-title" style={{ color: getMoodColor(playlist.mood) }}>
                moodify - {playlist.mood} vibes
              </h2>
              <p className="playlist-description">{playlist.description}</p>
              
              {/* Mood Stats */}
              <div className="row mt-4">
                <div className="col-12 col-md-4 mb-3">
                  <div className="mood-stat">
                    <span className="stat-label">ENERGY:</span>
                    <div className="progress">
                      <div 
                        className="progress-bar energy" 
                        style={{ width: `${playlist.audioFeatures.energy * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{Math.round(playlist.audioFeatures.energy * 100)}%</span>
                  </div>
                </div>
                
                <div className="col-12 col-md-4 mb-3">
                  <div className="mood-stat">
                    <span className="stat-label">POSITIVITY:</span>
                    <div className="progress">
                      <div 
                        className="progress-bar valence" 
                        style={{ width: `${playlist.audioFeatures.valence * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{Math.round(playlist.audioFeatures.valence * 100)}%</span>
                  </div>
                </div>
                
                <div className="col-12 col-md-4 mb-3">
                  <div className="mood-stat">
                    <span className="stat-label">DANCEABILITY:</span>
                    <div className="progress">
                      <div 
                        className="progress-bar danceability" 
                        style={{ width: `${playlist.audioFeatures.danceability * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{Math.round(playlist.audioFeatures.danceability * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tracks List */}
          <div className="tracks-container">
            <div className="tracks-header d-none d-md-flex">
              <div className="track-col-number">#</div>
              <div className="track-col-title">Title</div>
              <div className="track-col-artist">Artist</div>
              <div className="track-col-album">Album</div>
              <div className="track-col-duration">Duration</div>
              <div className="track-col-actions">Actions</div>
            </div>
            
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className={`track-item ${currentlyPlaying === track.id ? 'playing' : ''}`}
              >
                <div className="d-flex align-items-center">
                  <div className="track-col-number">
                    <span className="track-number">{index + 1}</span>
                  </div>
                  
                  <div className="track-col-title d-flex align-items-center">
                    <img
                      src={track.album.images[2]?.url || track.album.images[0]?.url}
                      alt={track.album.name}
                      className="track-image me-3"
                    />
                    <div className="track-info-text">
                      <div className="track-name">{track.name}</div>
                      <div className="track-artist d-md-none">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="track-col-artist d-none d-md-block">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </div>
                  
                  <div className="track-col-album d-none d-md-block">
                    {track.album.name}
                  </div>
                  
                  <div className="track-col-duration">
                    {formatDuration(track.duration_ms)}
                  </div>
                  
                  <div className="track-col-actions">
                    <div className="d-flex gap-2">
                      {track.preview_url && (
                        <button
                          onClick={() => playPreview(track)}
                          className="play-btn"
                          title={currentlyPlaying === track.id ? 'Pause' : 'Play Preview'}
                        >
                          {currentlyPlaying === track.id ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      )}
                      
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spotify-link-btn"
                        title="Open in Spotify"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Now Playing Bar */}
      {currentlyPlaying && (
        <div className="now-playing">
          <span>Now playing preview</span>
          <button onClick={stopPlayback} className="stop-button ms-3">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaylistDisplay;