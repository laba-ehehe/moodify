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
  { emoji: '😇', label: 'Angel' },
  { emoji: '🙂', label: 'Slight Smile' },
  
  // Energetic/Party
  { emoji: '🔥', label: 'Fire' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '💃', label: 'Dancing Woman' },
  { emoji: '🕺', label: 'Dancing Man' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '✨', label: 'Sparkles' },
  { emoji: '🎊', label: 'Confetti' },
  { emoji: '🪩', label: 'Disco Ball' },
  
  // Sad/Melancholic
  { emoji: '😢', label: 'Crying' },
  { emoji: '😭', label: 'Loud Crying' },
  { emoji: '😔', label: 'Pensive' },
  { emoji: '💔', label: 'Broken Heart' },
  { emoji: '😞', label: 'Disappointed' },
  { emoji: '🌧️', label: 'Rain' },
  { emoji: '😟', label: 'Worried' },
  { emoji: '😥', label: 'Sad but Relieved' },
  { emoji: '☔', label: 'Umbrella Rain' },
  
  // Calm/Relaxed
  { emoji: '😌', label: 'Relieved' },
  { emoji: '🧘', label: 'Meditation' },
  { emoji: '😴', label: 'Sleeping' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '☁️', label: 'Cloud' },
  { emoji: '🌊', label: 'Wave' },
  { emoji: '🍃', label: 'Leaves' },
  { emoji: '🌸', label: 'Cherry Blossom' },
  { emoji: '🕊️', label: 'Dove' },
  
  // Angry/Intense
  { emoji: '😠', label: 'Angry' },
  { emoji: '😡', label: 'Rage' },
  { emoji: '🤬', label: 'Swearing' },
  { emoji: '👿', label: 'Imp' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🌪️', label: 'Tornado' },
  { emoji: '🔴', label: 'Red Circle' },
  
  // Workout/Motivation
  { emoji: '💪', label: 'Muscle' },
  { emoji: '🏃', label: 'Running' },
  { emoji: '🥇', label: 'Gold Medal' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '🏋️', label: 'Weight Lifting' },
  { emoji: '🤸', label: 'Cartwheel' },
  { emoji: '⛹️', label: 'Basketball' },
  { emoji: '🏆', label: 'Trophy' },
  
  // Love/Romance
  { emoji: '❤️', label: 'Red Heart' },
  { emoji: '💕', label: 'Two Hearts' },
  { emoji: '💖', label: 'Sparkling Heart' },
  { emoji: '😘', label: 'Kiss' },
  { emoji: '🌹', label: 'Rose' },
  { emoji: '💝', label: 'Heart Gift' },
  { emoji: '💗', label: 'Growing Heart' },
  { emoji: '💋', label: 'Kiss Mark' },
  
  // Anxious/Stressed
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😨', label: 'Fearful' },
  { emoji: '😱', label: 'Screaming' },
  { emoji: '🫨', label: 'Shaking' },
  { emoji: '😬', label: 'Grimacing' },
  { emoji: '🫠', label: 'Melting' },
  
  // Cool/Confident
  { emoji: '😎', label: 'Cool' },
  { emoji: '🕶️', label: 'Sunglasses' },
  { emoji: '👑', label: 'Crown' },
  { emoji: '💅', label: 'Nail Polish' },
  { emoji: '😏', label: 'Smirking' },
  
  // Playful/Silly
  { emoji: '🤪', label: 'Crazy' },
  { emoji: '😜', label: 'Winking Tongue' },
  { emoji: '🤡', label: 'Clown' },
  { emoji: '🙃', label: 'Upside Down' },
  { emoji: '😋', label: 'Yummy' },
  
  // Study/Focus
  { emoji: '📚', label: 'Books' },
  { emoji: '✏️', label: 'Pencil' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '💡', label: 'Light Bulb' },
  { emoji: '🧠', label: 'Brain' },
  { emoji: '📖', label: 'Open Book' },
  
  // Nature/Travel
  { emoji: '🌴', label: 'Palm Tree' },
  { emoji: '🏖️', label: 'Beach' },
  { emoji: '⛰️', label: 'Mountain' },
  { emoji: '🌅', label: 'Sunrise' },
  { emoji: '🗺️', label: 'Map' },
  { emoji: '✈️', label: 'Airplane' },
  { emoji: '🚗', label: 'Car' },
  
  // Music/Arts
  { emoji: '🎸', label: 'Guitar' },
  { emoji: '🎵', label: 'Music Note' },
  { emoji: '🎨', label: 'Art Palette' },
  { emoji: '🎭', label: 'Theater' },
  { emoji: '🎪', label: 'Circus' },
  { emoji: '🎬', label: 'Movie' },
  
  // Dark/Mysterious
  { emoji: '🌑', label: 'New Moon' },
  { emoji: '🦇', label: 'Bat' },
  { emoji: '💀', label: 'Skull' },
  { emoji: '👻', label: 'Ghost' },
  { emoji: '🕷️', label: 'Spider' },
  
  // Other moods
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '🤗', label: 'Hugging' },
  { emoji: '🤩', label: 'Star Eyes' },
  { emoji: '🥳', label: 'Partying' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🍷', label: 'Wine' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '📱', label: 'Phone' },
  { emoji: '💻', label: 'Computer' },
  { emoji: '🛌', label: 'Bed' },
  { emoji: '🏠', label: 'Home' },
  { emoji: '🌺', label: 'Hibiscus' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🔮', label: 'Crystal Ball' }
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
          <button 
            type="button"  // Add this line - prevents form submission
            onClick={clearAll} 
            className="clear-emojis"
          >
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
            type="button"  // Add this line - prevents form submission
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