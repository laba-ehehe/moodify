// import React from 'react';

// function LoadingSpinner() {
//   return (
//     <div className="loading-container">
//       <div className="loading-spinner">
//         <div className="spinner"></div>
//         <p>Creating your perfect playlist...</p>
//       </div>
//     </div>
//   );
// }

// export default LoadingSpinner;

import React, { useState, useEffect } from 'react';

function LoadingSpinner() {
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const loadingMoods = [
    { emoji: '🎵', text: 'Analyzing your vibes...', color: '#1db954' },
    { emoji: '🎸', text: 'Tuning the perfect beats...', color: '#ff6b6b' },
    { emoji: '🎹', text: 'Composing your soundtrack...', color: '#4ecdc4' },
    { emoji: '🥁', text: 'Setting the rhythm...', color: '#ffd93d' },
    { emoji: '🎤', text: 'Finding your anthem...', color: '#e6b3ff' },
    { emoji: '🎧', text: 'Mixing the perfect blend...', color: '#ff69b4' },
    { emoji: '🎺', text: 'Orchestrating magic...', color: '#98d8c8' },
    { emoji: '🎻', text: 'Harmonizing emotions...', color: '#ffb3d9' }
  ];

  const funTips = [
    "Did you know? Music at 432 Hz is said to be mathematically consistent with the universe!",
    "Fun fact: Your heartbeat changes to mimic the music you're listening to!",
    "The most popular Spotify playlist name is 'Untitled' - we can do better!",
    "A song stuck in your head is called an 'earworm' 🐛",
    "Listening to music releases dopamine, the same chemical triggered by chocolate!",
    "Your taste in music forms by age 14 - but moods are timeless!",
    "Plants grow faster when music is played around them 🌱",
    "The world's longest concert lasted 639 years!"
  ];

  useEffect(() => {
    const moodInterval = setInterval(() => {
      setCurrentMoodIndex((prev) => (prev + 1) % loadingMoods.length);
    }, 800);

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % funTips.length);
    }, 3000);

    return () => {
      clearInterval(moodInterval);
      clearInterval(tipInterval);
    };
  }, [loadingMoods.length, funTips.length]);

  const currentMood = loadingMoods[currentMoodIndex];

  return (
    <div className="loading-container">
      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          position: relative;
          overflow: hidden;
        }

        .loading-content {
          text-align: center;
          z-index: 10;
          position: relative;
        }

        /* Vinyl Record Spinner */
        .vinyl-container {
          width: 200px;
          height: 200px;
          margin: 0 auto 2rem;
          position: relative;
          perspective: 1000px;
        }

        .vinyl-record {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            #1a1a1a 0%,
            #2a2a2a 30%,
            #1a1a1a 31%,
            #2a2a2a 40%,
            #1a1a1a 41%,
            #2a2a2a 50%,
            #1a1a1a 51%,
            #2a2a2a 60%,
            #1a1a1a 61%,
            #0a0a0a 100%
          );
          position: relative;
          animation: spin 2s linear infinite;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5),
                      inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${currentMood.color} 0%, ${currentMood.color}80 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1s ease-in-out infinite;
        }

        .mood-emoji {
          font-size: 2.5rem;
          animation: float 2s ease-in-out infinite;
        }

        @keyframes spin {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Loading Text */
        .loading-text {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          min-height: 30px;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Progress Dots */
        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .dot:nth-child(4) { animation-delay: 0.6s; }
        .dot:nth-child(5) { animation-delay: 0.8s; }

        @keyframes dotPulse {
          0%, 100% {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1);
          }
          50% {
            background: #1db954;
            transform: scale(1.3);
          }
        }

        /* Fun Tip */
        .fun-tip {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.25rem 2rem;
          max-width: 400px;
          margin: 0 auto;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tip-label {
          color: #1db954;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tip-icon {
          font-size: 1rem;
        }

        .tip-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          line-height: 1.4;
          min-height: 40px;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Floating Music Notes */
        .music-notes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .note {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: floatUp 8s linear infinite;
        }

        .note:nth-child(1) { left: 10%; animation-delay: 0s; }
        .note:nth-child(2) { left: 20%; animation-delay: 1s; }
        .note:nth-child(3) { left: 30%; animation-delay: 2s; }
        .note:nth-child(4) { left: 40%; animation-delay: 3s; }
        .note:nth-child(5) { left: 50%; animation-delay: 4s; }
        .note:nth-child(6) { left: 60%; animation-delay: 5s; }
        .note:nth-child(7) { left: 70%; animation-delay: 6s; }
        .note:nth-child(8) { left: 80%; animation-delay: 7s; }
        .note:nth-child(9) { left: 90%; animation-delay: 8s; }

        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Waveform Animation */
        .waveform {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          margin: 2rem 0;
          height: 40px;
        }

        .wave-bar {
          width: 4px;
          background: linear-gradient(180deg, #1db954 0%, #1db95440 100%);
          border-radius: 2px;
          animation: wave 1s ease-in-out infinite;
        }

        .wave-bar:nth-child(1) { animation-delay: 0s; height: 20px; }
        .wave-bar:nth-child(2) { animation-delay: 0.1s; height: 30px; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; height: 25px; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; height: 35px; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; height: 28px; }
        .wave-bar:nth-child(6) { animation-delay: 0.5s; height: 33px; }
        .wave-bar:nth-child(7) { animation-delay: 0.6s; height: 22px; }
        .wave-bar:nth-child(8) { animation-delay: 0.7s; height: 30px; }
        .wave-bar:nth-child(9) { animation-delay: 0.8s; height: 26px; }
        .wave-bar:nth-child(10) { animation-delay: 0.9s; height: 32px; }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .vinyl-container {
            width: 150px;
            height: 150px;
          }

          .vinyl-label {
            width: 60px;
            height: 60px;
          }

          .mood-emoji {
            font-size: 2rem;
          }

          .loading-text {
            font-size: 1rem;
          }

          .fun-tip {
            padding: 1rem 1.5rem;
            margin: 0 1rem;
          }
        }
      `}</style>

      {/* Floating Music Notes Background */}
      <div className="music-notes">
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
        <span className="note">♬</span>
        <span className="note">♪</span>
        <span className="note">♫</span>
        <span className="note">♪</span>
        <span className="note">♬</span>
        <span className="note">♫</span>
      </div>

      <div className="loading-content">
        {/* Vinyl Record Animation */}
        <div className="vinyl-container">
          <div className="vinyl-record">
            <div className="vinyl-label">
              <span className="mood-emoji">{currentMood.emoji}</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          {currentMood.text}
        </div>

        {/* Progress Dots */}
        <div className="progress-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Waveform */}
        <div className="waveform">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>

        {/* Fun Tip */}
        <div className="fun-tip">
          <div className="tip-label">
            <span className="tip-icon">💡</span>
            <span>MUSIC FACT</span>
          </div>
          <div className="tip-text">
            {funTips[currentTipIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;