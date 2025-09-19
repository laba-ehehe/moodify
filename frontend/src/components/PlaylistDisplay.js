// import React, { useState } from 'react';
// import { Play, Pause, Save, ArrowLeft, ExternalLink, Sparkles, Music } from 'lucide-react';

// function PlaylistDisplay({ playlist, onSave, onBack }) {
//   const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
//   const [audio, setAudio] = useState(null);

//   const playPreview = (track) => {
//     if (!track.preview_url) {
//       alert('Preview not available for this track');
//       return;
//     }

//     // Stop current audio if playing
//     if (audio) {
//       audio.pause();
//       setAudio(null);
//     }

//     if (currentlyPlaying === track.id) {
//       setCurrentlyPlaying(null);
//       return;
//     }

//     const newAudio = new Audio(track.preview_url);
//     newAudio.play();
//     setCurrentlyPlaying(track.id);
//     setAudio(newAudio);

//     newAudio.onended = () => {
//       setCurrentlyPlaying(null);
//       setAudio(null);
//     };
//   };

//   const stopPlayback = () => {
//     if (audio) {
//       audio.pause();
//       setAudio(null);
//       setCurrentlyPlaying(null);
//     }
//   };

//   const formatDuration = (ms) => {
//     const seconds = Math.floor(ms / 1000);
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const getMoodEmoji = (mood) => {
//     const emojis = {
//       happy: '😊',
//       sad: '😢',
//       energetic: '⚡',
//       calm: '🧘',
//       angry: '😠',
//       romantic: '💕',
//       party: '🎉',
//       nostalgic: '💭',
//       sleepy: '😴',
//       workout: '💪',
//       confident: '👑',
//       dreamy: '☁️',
//       groovy: '🕺',
//       lonely: '💔',
//       hopeful: '🌈',
//       anxious: '😰',
//       playful: '🤪',
//       focused: '🎯',
//       neutral: '😌'
//     };
//     return emojis[mood] || emojis.neutral;
//   };

//   return (
//     <div className="playlist-display-container">
//       {/* Playlist Header Card */}
//       <div className="playlist-header-section">
//         <div className="playlist-actions-bar">
//           <button onClick={onBack} className="playlist-back-btn">
//             <ArrowLeft size={18} />
//             <span>Back</span>
//           </button>
//           <button onClick={() => onSave(playlist)} className="playlist-save-btn">
//             <Save size={18} />
//             <span>Save to Spotify</span>
//           </button>
//         </div>

//         <div className="playlist-hero">
//           <div className="playlist-mood-icon">
//             <span className="mood-emoji-large">{getMoodEmoji(playlist.mood)}</span>
//           </div>
          
//           <div className="playlist-details">
//             <h1 className="playlist-main-title">
//               moodify - {playlist.mood} vibes
//             </h1>
//             <p className="playlist-subtitle">{playlist.description}</p>
            
//             {/* Audio Features */}
//             <div className="audio-features">
//               <div className="feature-pill">
//                 <span className="feature-icon">⚡</span>
//                 <span className="feature-label">Energy</span>
//                 <span className="feature-value">{Math.round(playlist.audioFeatures.energy * 100)}%</span>
//               </div>
//               <div className="feature-pill">
//                 <span className="feature-icon">✨</span>
//                 <span className="feature-label">Positivity</span>
//                 <span className="feature-value">{Math.round(playlist.audioFeatures.valence * 100)}%</span>
//               </div>
//               <div className="feature-pill">
//                 <span className="feature-icon">💃</span>
//                 <span className="feature-label">Danceability</span>
//                 <span className="feature-value">{Math.round(playlist.audioFeatures.danceability * 100)}%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Visual Mood Bars */}
//         <div className="mood-visualization">
//           <div className="mood-bar-item">
//             <div className="mood-bar-label">
//               <span className="bar-icon">⚡</span>
//               <span>Energy</span>
//             </div>
//             <div className="mood-bar-track">
//               <div 
//                 className="mood-bar-fill energy-bar"
//                 style={{ width: `${playlist.audioFeatures.energy * 100}%` }}
//               />
//             </div>
//           </div>
          
//           <div className="mood-bar-item">
//             <div className="mood-bar-label">
//               <span className="bar-icon">✨</span>
//               <span>Positivity</span>
//             </div>
//             <div className="mood-bar-track">
//               <div 
//                 className="mood-bar-fill positivity-bar"
//                 style={{ width: `${playlist.audioFeatures.valence * 100}%` }}
//               />
//             </div>
//           </div>
          
//           <div className="mood-bar-item">
//             <div className="mood-bar-label">
//               <span className="bar-icon">💃</span>
//               <span>Dance</span>
//             </div>
//             <div className="mood-bar-track">
//               <div 
//                 className="mood-bar-fill dance-bar"
//                 style={{ width: `${playlist.audioFeatures.danceability * 100}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tracks Section */}
//       <div className="playlist-tracks-section">
//         <div className="tracks-header">
//           <Music size={20} />
//           <span>Your Personalized Tracks</span>
//           <span className="track-count">{playlist.tracks.length} songs</span>
//         </div>

//         <div className="tracks-list">
//           {playlist.tracks.map((track, index) => (
//             <div
//               key={track.id}
//               className={`track-card ${currentlyPlaying === track.id ? 'playing' : ''}`}
//             >
//               <div className="track-number-col">
//                 <span className="track-index">{index + 1}</span>
//               </div>

//               <div className="track-main">
//                 <img
//                   src={track.album.images[2]?.url || track.album.images[0]?.url}
//                   alt={track.album.name}
//                   className="track-artwork"
//                 />
                
//                 <div className="track-details">
//                   <div className="track-title">{track.name}</div>
//                   <div className="track-subtitle">
//                     {track.artists.map(artist => artist.name).join(', ')}
//                   </div>
//                 </div>
//               </div>

//               <div className="track-album-col d-none d-lg-block">
//                 <span className="track-album-name">{track.album.name}</span>
//               </div>

//               <div className="track-duration-col">
//                 <span className="track-time">{formatDuration(track.duration_ms)}</span>
//               </div>

//               <div className="track-actions-col">
//                 {track.preview_url && (
//                   <button
//                     onClick={() => playPreview(track)}
//                     className="track-play-btn"
//                     title={currentlyPlaying === track.id ? 'Pause' : 'Play Preview'}
//                   >
//                     {currentlyPlaying === track.id ? <Pause size={16} /> : <Play size={16} />}
//                   </button>
//                 )}
                
//                 <a
//                   href={track.external_urls.spotify}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="track-spotify-link"
//                   title="Open in Spotify"
//                 >
//                   <ExternalLink size={16} />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Now Playing Bar */}
//       {currentlyPlaying && (
//         <div className="now-playing-bar">
//           <div className="now-playing-content">
//             <span className="now-playing-icon">🎵</span>
//             <span className="now-playing-text">Playing preview...</span>
//             <button onClick={stopPlayback} className="stop-preview-btn">
//               Stop
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PlaylistDisplay;

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Save, ArrowLeft, ExternalLink, Music, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';

function PlaylistDisplay({ playlist, onSave, onBack }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set());
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  useEffect(() => {
    let interval;
    if (audio && isPlaying) {
      interval = setInterval(() => {
        setProgress(audio.currentTime);
        setDuration(audio.duration);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [audio, isPlaying]);

  const playTrack = (track, index) => {
    if (!track.preview_url) {
      alert('Preview not available for this track');
      return;
    }

    // Stop current audio if playing
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    if (currentlyPlaying === track.id && isPlaying) {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      return;
    }

    const newAudio = new Audio(track.preview_url);
    newAudio.volume = volume;
    newAudio.play();
    setCurrentlyPlaying(track.id);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setAudio(newAudio);
    setProgress(0);

    newAudio.onended = () => {
      if (repeat) {
        newAudio.currentTime = 0;
        newAudio.play();
      } else {
        playNext();
      }
    };

    newAudio.onloadedmetadata = () => {
      setDuration(newAudio.duration);
    };
  };

  const pauseTrack = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (currentTrackIndex === null) return;
    
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.tracks.length;
    }
    
    const nextTrack = playlist.tracks[nextIndex];
    if (nextTrack.preview_url) {
      playTrack(nextTrack, nextIndex);
    } else {
      // Skip tracks without preview
      setCurrentTrackIndex(nextIndex);
      playNext();
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex === null) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? playlist.tracks.length - 1 
      : currentTrackIndex - 1;
    
    const prevTrack = playlist.tracks[prevIndex];
    if (prevTrack.preview_url) {
      playTrack(prevTrack, prevIndex);
    } else {
      setCurrentTrackIndex(prevIndex);
      playPrevious();
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleLike = (trackId) => {
    const newLiked = new Set(likedTracks);
    if (newLiked.has(trackId)) {
      newLiked.delete(trackId);
    } else {
      newLiked.add(trackId);
    }
    setLikedTracks(newLiked);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const currentTrack = currentTrackIndex !== null ? playlist.tracks[currentTrackIndex] : null;

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

      {/* Enhanced Player Controls */}
      {currentTrack && (
        <div className="player-controls-section">
          <div className="now-playing-info">
            <img 
              src={currentTrack.album.images[2]?.url || currentTrack.album.images[0]?.url}
              alt={currentTrack.album.name}
              className="now-playing-artwork"
            />
            <div className="now-playing-details">
              <div className="now-playing-title">{currentTrack.name}</div>
              <div className="now-playing-artist">
                {currentTrack.artists.map(artist => artist.name).join(', ')}
              </div>
            </div>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`like-btn ${likedTracks.has(currentTrack.id) ? 'liked' : ''}`}
            >
              <Heart size={18} fill={likedTracks.has(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="player-main-controls">
            <div className="control-buttons">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`control-btn ${shuffle ? 'active' : ''}`}
              >
                <Shuffle size={18} />
              </button>
              <button onClick={playPrevious} className="control-btn">
                <SkipBack size={20} />
              </button>
              <button
                onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
                className="play-pause-btn"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={playNext} className="control-btn">
                <SkipForward size={20} />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`control-btn ${repeat ? 'active' : ''}`}
              >
                <Repeat size={18} />
              </button>
            </div>
            
            <div className="progress-bar-container">
              <span className="time-label">{formatTime(progress)}</span>
              <input
                ref={progressRef}
                type="range"
                min="0"
                max={duration || 30}
                value={progress}
                onChange={handleProgressChange}
                className="progress-slider"
              />
              <span className="time-label">{formatTime(duration || 30)}</span>
            </div>
          </div>

          <div className="volume-controls">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="volume-btn"
            >
              <Volume2 size={18} />
            </button>
            {showVolume && (
              <input
                ref={volumeRef}
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            )}
          </div>
        </div>
      )}

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
              onDoubleClick={() => playTrack(track, index)}
            >
              <div className="track-number-col">
                {currentlyPlaying === track.id && isPlaying ? (
                  <div className="playing-animation">
                    <span className="bar bar-1"></span>
                    <span className="bar bar-2"></span>
                    <span className="bar bar-3"></span>
                  </div>
                ) : (
                  <span className="track-index">{index + 1}</span>
                )}
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
                <button
                  onClick={() => toggleLike(track.id)}
                  className={`track-like-btn ${likedTracks.has(track.id) ? 'liked' : ''}`}
                >
                  <Heart size={16} fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
                </button>
                
                {track.preview_url && (
                  <button
                    onClick={() => playTrack(track, index)}
                    className="track-play-btn"
                    title={currentlyPlaying === track.id && isPlaying ? 'Pause' : 'Play Preview'}
                  >
                    {currentlyPlaying === track.id && isPlaying ? <Pause size={16} /> : <Play size={16} />}
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

      <style jsx>{`
        /* Enhanced Player Controls Styles */
        .player-controls-section {
          background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(29, 185, 84, 0.05));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .now-playing-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 0 0 300px;
        }

        .now-playing-artwork {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .now-playing-details {
          flex: 1;
          min-width: 0;
        }

        .now-playing-title {
          font-weight: 600;
          font-size: 0.9375rem;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .now-playing-artist {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .like-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.2s ease;
        }

        .like-btn:hover {
          color: #1db954;
          transform: scale(1.1);
        }

        .like-btn.liked {
          color: #1db954;
          animation: heartBeat 0.3s ease;
        }

        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .player-main-controls {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .control-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .control-btn.active {
          color: #1db954;
        }

        .play-pause-btn {
          background: #ffffff;
          color: #000000;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .play-pause-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .time-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          min-width: 35px;
          font-tabular-nums: true;
        }

        .progress-slider {
          flex: 1;
          -webkit-appearance: none;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .progress-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .progress-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .volume-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 0 0 150px;
        }

        .volume-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .volume-slider {
          width: 100px;
          -webkit-appearance: none;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #1db954;
          border-radius: 50%;
          cursor: pointer;
        }

        /* Playing Animation */
        .playing-animation {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 20px;
          justify-content: center;
        }

        .bar {
          width: 3px;
          background: #1db954;
          animation: soundWave 0.5s ease-in-out infinite;
        }

        .bar-1 {
          height: 12px;
          animation-delay: 0s;
        }

        .bar-2 {
          height: 16px;
          animation-delay: 0.1s;
        }

        .bar-3 {
          height: 10px;
          animation-delay: 0.2s;
        }

        @keyframes soundWave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }

        .track-like-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.2s ease;
        }

        .track-like-btn:hover {
          color: #1db954;
        }

        .track-like-btn.liked {
          color: #1db954;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .player-controls-section {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .now-playing-info {
            flex: 1;
            width: 100%;
          }

          .volume-controls {
            flex: 1;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default PlaylistDisplay;