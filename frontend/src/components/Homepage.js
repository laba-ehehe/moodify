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
        setLoading(false);
        return;
      }
      
      await onGeneratePlaylist(moodData, inputText);
    } catch (error) {
      console.error('Failed to analyze mood:', error);
      alert('Failed to analyze mood. Please try again.');
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
            className={inputMode === 'text' ? 'active' : ''}
            onClick={() => setInputMode('text')}
          >
            ✏️ Text
          </button>
          <button 
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
        <h3>Try these examples:</h3>
        <div className="example-buttons">
          <button onClick={() => { setInputMode('text'); setTextInput('energetic workout vibes'); }}>
            💪 Workout Energy
          </button>
          <button onClick={() => { setInputMode('text'); setTextInput('calm and focused study mood'); }}>
            📚 Study Focus
          </button>
          <button onClick={() => { setInputMode('text'); setTextInput('romantic dinner atmosphere'); }}>
            ❤️ Romantic
          </button>
          <button onClick={() => { setInputMode('text'); setTextInput('sad and contemplative'); }}>
            💭 Melancholic
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;