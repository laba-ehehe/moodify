import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker';
import { analyzeMoodFromEmojis, analyzeMoodFromText } from '../services/api';

function Homepage({ onGeneratePlaylist }) {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'emoji'
  const [textInput, setTextInput] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      alert('Request timed out. Please check your connection and try again.');
    }, 30000); // 30 second timeout
    
    try {
      let moodData;
      let inputText;
      
      if (inputMode === 'text' && textInput.trim()) {
        moodData = await analyzeMoodFromText(textInput);
        inputText = textInput;
      } else if (inputMode === 'emoji' && selectedEmojis.length > 0) {
        moodData = await analyzeMoodFromEmojis(selectedEmojis);
        inputText = selectedEmojis.join(' ');
      } else {
        alert('Please enter some text or select emojis');
        clearTimeout(timeout);
        setLoading(false);
        return;
      }
      
      console.log('Mood data received:', moodData); // Debug log
      
      await onGeneratePlaylist(moodData, inputText);
      clearTimeout(timeout);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to analyze mood:', error);
      
      // More detailed error message
      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze mood';
      alert(`Error: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <h2>How are you feeling?</h2>
        <p>Describe your mood and we'll create the perfect playlist for you</p>
      </div>
      
      <div className="mood-input-section">
        <div className="input-mode-toggle">
          <button
            type="button"
            className={inputMode === 'text' ? 'active' : ''}
            onClick={() => setInputMode('text')}
          >
            ✏️ Text
          </button>
          <button
            type="button"
            className={inputMode === 'emoji' ? 'active' : ''}
            onClick={() => setInputMode('emoji')}
          >
            😊 Emojis
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mood-form">
          {inputMode === 'text' ? (
            <div className="text-input-section">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., 'feeling energetic and ready to conquer the world' or 'calm but motivated'"
                className="mood-textarea"
                rows={3}
              />
            </div>
          ) : (
            <EmojiPicker
              selectedEmojis={selectedEmojis}
              onEmojiSelect={setSelectedEmojis}
            />
          )}
          
          <button
            type="submit"
            className="generate-button"
            disabled={loading || (inputMode === 'text' ? !textInput.trim() : selectedEmojis.length === 0)}
          >
            {loading ? 'Creating your playlist...' : '🎵 Generate Playlist'}
          </button>
        </form>
      </div>
      
      <div className="examples-section">
        <h3>Try these moods:</h3>
        
        {/* All mood examples displayed at once */}
        <div className="example-buttons">
          {/* Primary moods */}
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('happy and cheerful'); }}>
            😊 Happy
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('sad and melancholic'); }}>
            😢 Sad
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('energetic workout vibes'); }}>
            💪 Workout
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('calm and peaceful'); }}>
            🧘 Calm
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('romantic dinner atmosphere'); }}>
            ❤️ Romantic
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('party time celebration'); }}>
            🎉 Party
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('focused study session'); }}>
            📚 Studying
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('nostalgic memories'); }}>
            💭 Nostalgic
          </button>
          
          {/* Additional moods */}
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('sleepy and tired'); }}>
            😴 Sleepy
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('dreamy and ethereal'); }}>
            ☁️ Dreamy
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('confident and powerful'); }}>
            👑 Confident
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('playful and silly'); }}>
            🤪 Playful
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('groovy and funky'); }}>
            🕺 Groovy
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('anxious and stressed'); }}>
            😰 Anxious
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('hopeful and optimistic'); }}>
            🌈 Hopeful
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('lonely and isolated'); }}>
            💔 Lonely
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('road trip adventure'); }}>
            🚗 Road Trip
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('cooking in the kitchen'); }}>
            🍳 Cooking
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('tropical beach vibes'); }}>
            🌴 Tropical
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('dark and mysterious'); }}>
            🌑 Dark
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('rebellious punk attitude'); }}>
            🤘 Rebellious
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('vintage retro vibes'); }}>
            📻 Vintage
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('meditative and spiritual'); }}>
            🕉️ Meditative
          </button>
          <button type="button" onClick={() => { setInputMode('text'); setTextInput('motivated and determined'); }}>
            🎯 Motivated
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;