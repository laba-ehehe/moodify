import React, { useState } from 'react';

const MOOD_EMOJIS = [
  // Happy/Joyful
  { emoji: '😀', label: 'Grinning' },
  { emoji: '😃', label: 'Smiley' },
  { emoji: '😄', label: 'Smile' },
  { emoji: '😁', label: 'Grin' },
  { emoji: '😊', label: 'Blush' },
  { emoji: '😍', label: 'Heart Eyes' },
  { emoji: '🥰', label: 'Smiling Hearts' },
  
  // Energetic/Party
  { emoji: '🔥', label: 'Fire' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '💃', label: 'Dancing Woman' },
  { emoji: '🕺', label: 'Dancing Man' },
  { emoji: '🚀', label: 'Rocket' },
  
  // Sad/Melancholic
  { emoji: '😢', label: 'Crying' },
  { emoji: '😭', label: 'Loud Crying' },
  { emoji: '😔', label: 'Pensive' },
  { emoji: '💔', label: 'Broken Heart' },
  { emoji: '😞', label: 'Disappointed' },
  { emoji: '🌧️', label: 'Rain' },
  
  // Calm/Relaxed
  { emoji: '😌', label: 'Relieved' },
  { emoji: '🧘', label: 'Meditation' },
  { emoji: '😴', label: 'Sleeping' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '☁️', label: 'Cloud' },
  { emoji: '🌊', label: 'Wave' },
  
  // Angry/Intense
  { emoji: '😠', label: 'Angry' },
  { emoji: '😡', label: 'Rage' },
  { emoji: '🤬', label: 'Swearing' },
  { emoji: '👿', label: 'Imp' },
  
  // Workout/Motivation
  { emoji: '💪', label: 'Muscle' },
  { emoji: '🏃', label: 'Running' },
  { emoji: '🥇', label: 'Gold Medal' },
  { emoji: '🎯', label: 'Target' },
  
  // Love/Romance
  { emoji: '❤️', label: 'Red Heart' },
  { emoji: '💕', label: 'Two Hearts' },
  { emoji: '💖', label: 'Sparkling Heart' },
  { emoji: '😘', label: 'Kiss' },
  { emoji: '🌹', label: 'Rose' },
  
  // Other moods
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤗', label: 'Hugging' },
  { emoji: '😋', label: 'Yummy' },
  { emoji: '🤩', label: 'Star Eyes' },
  { emoji: '🥳', label: 'Partying' }
];

function EmojiPicker({ selectedEmojis, onEmojiSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmojis = MOOD_EMOJIS.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEmoji = (emoji) => {
    if (selectedEmojis.includes(emoji)) {
      onEmojiSelect(selectedEmojis.filter(e => e !== emoji));
    } else {
      onEmojiSelect([...selectedEmojis, emoji]);
    }
  };

  const clearAll = () => {
    onEmojiSelect([]);
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="emoji-search"
        />
        {selectedEmojis.length > 0 && (
          <button onClick={clearAll} className="clear-emojis">
            Clear All
          </button>
        )}
      </div>
      
      {selectedEmojis.length > 0 && (
        <div className="selected-emojis">
          <span>Selected: </span>
          {selectedEmojis.map((emoji, index) => (
            <span key={index} className="selected-emoji">
              {emoji}
            </span>
          ))}
        </div>
      )}
      
      <div className="emoji-grid">
        {filteredEmojis.map((item, index) => (
          <button
            key={index}
            className={`emoji-button ${selectedEmojis.includes(item.emoji) ? 'selected' : ''}`}
            onClick={() => toggleEmoji(item.emoji)}
            title={item.label}
          >
            {item.emoji}
          </button>
        ))}
      </div>
      
      {filteredEmojis.length === 0 && (
        <div className="no-emojis">No emojis found for "{searchTerm}"</div>
      )}
    </div>
  );
}

export default EmojiPicker;