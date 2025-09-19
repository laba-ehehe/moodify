import React, { useState } from 'react';

const MOOD_EMOJIS = [
  // Happy/Joyful (expanded)
  { emoji: '😀', label: 'Grinning' },
  { emoji: '😃', label: 'Smiley' },
  { emoji: '😄', label: 'Smile' },
  { emoji: '😁', label: 'Grin' },
  { emoji: '😊', label: 'Blush' },
  { emoji: '😍', label: 'Heart Eyes' },
  { emoji: '🥰', label: 'Smiling Hearts' },
  { emoji: '😇', label: 'Angel' },
  { emoji: '🙂', label: 'Slight Smile' },
  { emoji: '😸', label: 'Grinning Cat' },
  { emoji: '😻', label: 'Heart Eyes Cat' },
  { emoji: '🤗', label: 'Hugging' },
  { emoji: '🤭', label: 'Hand Over Mouth' },
  { emoji: '😙', label: 'Kissing' },
  { emoji: '😚', label: 'Kissing Closed Eyes' },

  // Energetic/Party (expanded)
  { emoji: '🔥', label: 'Fire' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '💃', label: 'Dancing Woman' },
  { emoji: '🕺', label: 'Dancing Man' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '✨', label: 'Sparkles' },
  { emoji: '🎊', label: 'Confetti' },
  { emoji: '🪩', label: 'Disco Ball' },
  { emoji: '🎆', label: 'Fireworks' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '💥', label: 'Explosion' },
  { emoji: '🎯', label: 'Direct Hit' },
  { emoji: '🔊', label: 'Loud Sound' },
  { emoji: '🔔', label: 'Bell' },

  // Sad/Melancholic (expanded)
  { emoji: '😢', label: 'Crying' },
  { emoji: '😭', label: 'Loud Crying' },
  { emoji: '😔', label: 'Pensive' },
  { emoji: '💔', label: 'Broken Heart' },
  { emoji: '😞', label: 'Disappointed' },
  { emoji: '🌧️', label: 'Rain' },
  { emoji: '😟', label: 'Worried' },
  { emoji: '😥', label: 'Sad but Relieved' },
  { emoji: '☔', label: 'Umbrella Rain' },
  { emoji: '😿', label: 'Crying Cat' },
  { emoji: '🥺', label: 'Pleading' },
  { emoji: '😣', label: 'Persevering' },
  { emoji: '😖', label: 'Confounded' },
  { emoji: '🌫️', label: 'Fog' },
  { emoji: '⛈️', label: 'Thunderstorm' },

  // Calm/Relaxed (expanded)
  { emoji: '😌', label: 'Relieved' },
  { emoji: '🧘', label: 'Meditation' },
  { emoji: '😴', label: 'Sleeping' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '☁️', label: 'Cloud' },
  { emoji: '🌊', label: 'Wave' },
  { emoji: '🍃', label: 'Leaves' },
  { emoji: '🌸', label: 'Cherry Blossom' },
  { emoji: '🕊️', label: 'Dove' },
  { emoji: '🌅', label: 'Sunrise' },
  { emoji: '🌄', label: 'Mountain Sunrise' },
  { emoji: '🕯️', label: 'Candle' },
  { emoji: '🛁', label: 'Bathtub' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🍵', label: 'Tea' },

  // Angry/Intense (expanded)
  { emoji: '😠', label: 'Angry' },
  { emoji: '😡', label: 'Rage' },
  { emoji: '🤬', label: 'Swearing' },
  { emoji: '👿', label: 'Imp' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🌪️', label: 'Tornado' },
  { emoji: '🔴', label: 'Red Circle' },
  { emoji: '👺', label: 'Angry Goblin' },
  { emoji: '💢', label: 'Anger Symbol' },
  { emoji: '🗯️', label: 'Anger Bubble' },
  { emoji: '🌋', label: 'Volcano' },
  { emoji: '⛈️', label: 'Storm' },

  // Workout/Motivation (expanded)
  { emoji: '💪', label: 'Muscle' },
  { emoji: '🏃', label: 'Running' },
  { emoji: '🥇', label: 'Gold Medal' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '🏋️', label: 'Weight Lifting' },
  { emoji: '🤸', label: 'Cartwheel' },
  { emoji: '⛹️', label: 'Basketball' },
  { emoji: '🏆', label: 'Trophy' },
  { emoji: '🚴', label: 'Cycling' },
  { emoji: '🏊', label: 'Swimming' },
  { emoji: '🤾', label: 'Handball' },
  { emoji: '🧗', label: 'Climbing' },
  { emoji: '🥊', label: 'Boxing' },
  { emoji: '🤺', label: 'Fencing' },

  // Love/Romance (expanded)
  { emoji: '❤️', label: 'Red Heart' },
  { emoji: '💕', label: 'Two Hearts' },
  { emoji: '💖', label: 'Sparkling Heart' },
  { emoji: '😘', label: 'Kiss' },
  { emoji: '🌹', label: 'Rose' },
  { emoji: '💝', label: 'Heart Gift' },
  { emoji: '💗', label: 'Growing Heart' },
  { emoji: '💋', label: 'Kiss Mark' },
  { emoji: '💑', label: 'Couple' },
  { emoji: '💐', label: 'Bouquet' },
  { emoji: '🥀', label: 'Wilted Rose' },
  { emoji: '💌', label: 'Love Letter' },
  { emoji: '💒', label: 'Wedding' },
  { emoji: '🎀', label: 'Ribbon' },
  { emoji: '💞', label: 'Revolving Hearts' },

  // Anxious/Stressed (expanded)
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😨', label: 'Fearful' },
  { emoji: '😱', label: 'Screaming' },
  { emoji: '🫨', label: 'Shaking' },
  { emoji: '😬', label: 'Grimacing' },
  { emoji: '🫠', label: 'Melting' },
  { emoji: '😵', label: 'Dizzy' },
  { emoji: '🤯', label: 'Mind Blown' },
  { emoji: '😓', label: 'Cold Sweat' },
  { emoji: '🥵', label: 'Hot Face' },
  { emoji: '🥶', label: 'Cold Face' },

  // Cool/Confident (expanded)
  { emoji: '😎', label: 'Cool' },
  { emoji: '🕶️', label: 'Sunglasses' },
  { emoji: '👑', label: 'Crown' },
  { emoji: '💅', label: 'Nail Polish' },
  { emoji: '😏', label: 'Smirking' },
  { emoji: '🤴', label: 'Prince' },
  { emoji: '👸', label: 'Princess' },
  { emoji: '💎', label: 'Diamond' },
  { emoji: '🏅', label: 'Medal' },
  { emoji: '🎖️', label: 'Military Medal' },

  // Playful/Silly (expanded)
  { emoji: '🤪', label: 'Crazy' },
  { emoji: '😜', label: 'Winking Tongue' },
  { emoji: '🤡', label: 'Clown' },
  { emoji: '🙃', label: 'Upside Down' },
  { emoji: '😋', label: 'Yummy' },
  { emoji: '🤫', label: 'Shushing' },
  { emoji: '🤨', label: 'Raised Eyebrow' },
  { emoji: '🙄', label: 'Eye Roll' },
  { emoji: '😛', label: 'Tongue Out' },
  { emoji: '😝', label: 'Squinting Tongue' },

  // Study/Focus (expanded)
  { emoji: '📚', label: 'Books' },
  { emoji: '✏️', label: 'Pencil' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '💡', label: 'Light Bulb' },
  { emoji: '🧠', label: 'Brain' },
  { emoji: '📖', label: 'Open Book' },
  { emoji: '📝', label: 'Memo' },
  { emoji: '🔍', label: 'Magnifying Glass' },
  { emoji: '📊', label: 'Chart' },
  { emoji: '📈', label: 'Trending Up' },
  { emoji: '🧮', label: 'Abacus' },
  { emoji: '📐', label: 'Ruler' },

  // Nature/Travel (expanded)
  { emoji: '🌴', label: 'Palm Tree' },
  { emoji: '🏖️', label: 'Beach' },
  { emoji: '⛰️', label: 'Mountain' },
  { emoji: '🌅', label: 'Sunrise' },
  { emoji: '🗺️', label: 'Map' },
  { emoji: '✈️', label: 'Airplane' },
  { emoji: '🚗', label: 'Car' },
  { emoji: '🚢', label: 'Ship' },
  { emoji: '🚂', label: 'Train' },
  { emoji: '🎒', label: 'Backpack' },
  { emoji: '🧳', label: 'Luggage' },
  { emoji: '🌍', label: 'Earth' },
  { emoji: '🏕️', label: 'Camping' },
  { emoji: '🗻', label: 'Mount Fuji' },

  // Music/Arts (expanded)
  { emoji: '🎸', label: 'Guitar' },
  { emoji: '🎵', label: 'Music Note' },
  { emoji: '🎨', label: 'Art Palette' },
  { emoji: '🎭', label: 'Theater' },
  { emoji: '🎪', label: 'Circus' },
  { emoji: '🎬', label: 'Movie' },
  { emoji: '🎤', label: 'Microphone' },
  { emoji: '🎧', label: 'Headphones' },
  { emoji: '🎹', label: 'Piano' },
  { emoji: '🥁', label: 'Drums' },
  { emoji: '🎺', label: 'Trumpet' },
  { emoji: '🎻', label: 'Violin' },
  { emoji: '🎯', label: 'Dart' },
  { emoji: '🖼️', label: 'Frame' },

  // Dark/Mysterious (expanded)
  { emoji: '🌑', label: 'New Moon' },
  { emoji: '🦇', label: 'Bat' },
  { emoji: '💀', label: 'Skull' },
  { emoji: '👻', label: 'Ghost' },
  { emoji: '🕷️', label: 'Spider' },
  { emoji: '🕸️', label: 'Spider Web' },
  { emoji: '⚰️', label: 'Coffin' },
  { emoji: '🔮', label: 'Crystal Ball' },
  { emoji: '🎃', label: 'Pumpkin' },
  { emoji: '👹', label: 'Ogre' },
  { emoji: '☠️', label: 'Skull and Bones' },
  { emoji: '🌚', label: 'Dark Moon' },

  // Food/Drinks (new category)
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🍷', label: 'Wine' },
  { emoji: '🍺', label: 'Beer' },
  { emoji: '🥂', label: 'Cheers' },
  { emoji: '🍰', label: 'Cake' },
  { emoji: '🍫', label: 'Chocolate' },
  { emoji: '🍯', label: 'Honey' },
  { emoji: '🧁', label: 'Cupcake' },
  { emoji: '🍪', label: 'Cookie' },
  { emoji: '🥳', label: 'Party Face' },

  // Technology (new category)
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '📱', label: 'Phone' },
  { emoji: '💻', label: 'Computer' },
  { emoji: '⌨️', label: 'Keyboard' },
  { emoji: '🖱️', label: 'Mouse' },
  { emoji: '📺', label: 'TV' },
  { emoji: '📷', label: 'Camera' },
  { emoji: '🔌', label: 'Plug' },
  { emoji: '💾', label: 'Floppy Disk' },
  { emoji: '💿', label: 'CD' },

  // Weather/Elements (new category)
  { emoji: '🌞', label: 'Sun' },
  { emoji: '🌦️', label: 'Sun Behind Rain' },
  { emoji: '❄️', label: 'Snowflake' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '💧', label: 'Droplet' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '💫', label: 'Dizzy Star' },
  { emoji: '☀️', label: 'Sunny' },
  { emoji: '⛅', label: 'Partly Cloudy' },

  // Objects/Items (new category)
  { emoji: '🛌', label: 'Bed' },
  { emoji: '🏠', label: 'Home' },
  { emoji: '🌺', label: 'Hibiscus' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🪄', label: 'Magic Wand' },
  { emoji: '🎁', label: 'Gift' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🛍️', label: 'Shopping' },
  { emoji: '💰', label: 'Money Bag' },
  { emoji: '💸', label: 'Money Flying' },

  // Other moods (expanded)
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '🤗', label: 'Hugging' },
  { emoji: '🤩', label: 'Star Eyes' },
  { emoji: '🥳', label: 'Partying' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🧙', label: 'Wizard' },
  { emoji: '🧚', label: 'Fairy' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🐶', label: 'Dog' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🌻', label: 'Sunflower' },
  { emoji: '🌷', label: 'Tulip' }
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