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
   <div className="homepage-container">
     <div className="row justify-content-center">
       <div className="col-12 col-lg-10 col-xl-8">
         {/* Hero Section */}
         <div className="text-center mb-5">
           <div className="hero-emoji mb-3">✨</div>
           <h1 className="hero-title">How are you feeling today?</h1>
           <p className="lead text-muted-spotify">
             Describe your mood and we'll create the perfect playlist for you
           </p>
         </div>
        
         {/* Main Card */}
         <div className="mood-card">
           {/* Input Mode Toggle */}
           <div className="text-center mb-4">
             <div className="toggle-container">
               <button
                 type="button"
                 className={`toggle-btn ${inputMode === 'text' ? 'active' : ''}`}
                 onClick={() => setInputMode('text')}
               >
                 ✏️ Text
               </button>
               <button
                 type="button"
                 className={`toggle-btn ${inputMode === 'emoji' ? 'active' : ''}`}
                 onClick={() => setInputMode('emoji')}
               >
                 😊 Emojis
               </button>
             </div>
           </div>
          
           {/* Form */}
           <form onSubmit={handleSubmit}>
             {inputMode === 'text' ? (
               <div className="mb-4">
                 <textarea
                   value={textInput}
                   onChange={(e) => setTextInput(e.target.value)}
                   placeholder="e.g., 'feeling energetic and ready to conquer the world' or 'calm but motivated'"
                   className="form-control mood-textarea"
                   rows={4}
                 />
               </div>
             ) : (
               <div className="mb-4">
                 <EmojiPicker
                   selectedEmojis={selectedEmojis}
                   onEmojiSelect={setSelectedEmojis}
                 />
               </div>
             )}
            
             <div className="text-center">
               <button
                 type="submit"
                 className="generate-btn"
                 disabled={loading || (inputMode === 'text' ? !textInput.trim() : selectedEmojis.length === 0)}
               >
                 {loading ? (
                   <>Creating your playlist...</>
                 ) : (
                   <>
                     <span className="pulse-icon me-2">🎵</span>
                     Generate Playlist
                   </>
                 )}
               </button>
             </div>
           </form>
         </div>
        
         {/* Mood Examples */}
         <div className="mood-examples mt-5">
           <h3 className="text-center mb-4 text-white-50">
             <small>Try these moods:</small>
           </h3>
          
           <div className="d-flex flex-wrap justify-content-center">
             {/* Primary moods */}
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('happy and cheerful'); }}
             >
               😊 Happy
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('sad and melancholic'); }}
             >
               😢 Sad
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('energetic workout vibes'); }}
             >
               💪 Workout
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('calm and peaceful'); }}
             >
               🧘 Calm
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('romantic dinner atmosphere'); }}
             >
               ❤️ Romantic
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('party time celebration'); }}
             >
               🎉 Party
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('focused study session'); }}
             >
               📚 Studying
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('nostalgic memories'); }}
             >
               💭 Nostalgic
             </button>
            
             {/* Additional moods */}
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('sleepy and tired'); }}
             >
               😴 Sleepy
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('dreamy and ethereal'); }}
             >
               ☁️ Dreamy
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('confident and powerful'); }}
             >
               👑 Confident
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('playful and silly'); }}
             >
               🤪 Playful
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('groovy and funky'); }}
             >
               🕺 Groovy
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('anxious and stressed'); }}
             >
               😰 Anxious
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('hopeful and optimistic'); }}
             >
               🌈 Hopeful
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('lonely and isolated'); }}
             >
               💔 Lonely
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('road trip adventure'); }}
             >
               🚗 Road Trip
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('cooking in the kitchen'); }}
             >
               🍳 Cooking
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('tropical beach vibes'); }}
             >
               🌴 Tropical
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('dark and mysterious'); }}
             >
               🌑 Dark
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('rebellious punk attitude'); }}
             >
               🤘 Rebellious
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('vintage retro vibes'); }}
             >
               📻 Vintage
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('meditative and spiritual'); }}
             >
               🕉️ Meditative
             </button>
             <button
               type="button"
               className="mood-btn"
               onClick={() => { setInputMode('text'); setTextInput('motivated and determined'); }}
             >
               🎯 Motivated
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}

export default Homepage;