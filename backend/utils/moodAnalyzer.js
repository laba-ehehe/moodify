// // Emoji to mood mapping
// const emojiMoodMap = {
//   // Happy/Joyful
//   '😀': { energy: 0.8, valence: 0.9, danceability: 0.7 },
//   '😃': { energy: 0.8, valence: 0.9, danceability: 0.7 },
//   '😄': { energy: 0.9, valence: 0.9, danceability: 0.8 },
//   '😁': { energy: 0.8, valence: 0.8, danceability: 0.7 },
//   '😊': { energy: 0.6, valence: 0.8, danceability: 0.5 },
//   '😍': { energy: 0.7, valence: 0.9, danceability: 0.6 },
//   '🥰': { energy: 0.5, valence: 0.8, danceability: 0.4 },
  
//   // Energetic/Party
//   '🔥': { energy: 0.9, valence: 0.8, danceability: 0.9 },
//   '🎉': { energy: 0.9, valence: 0.9, danceability: 0.9 },
//   '💃': { energy: 0.9, valence: 0.8, danceability: 0.9 },
//   '🕺': { energy: 0.9, valence: 0.8, danceability: 0.9 },
//   '⚡': { energy: 1.0, valence: 0.7, danceability: 0.8 },
  
//   // Sad/Melancholic
//   '😢': { energy: 0.2, valence: 0.2, danceability: 0.2 },
//   '😭': { energy: 0.3, valence: 0.1, danceability: 0.1 },
//   '😔': { energy: 0.2, valence: 0.3, danceability: 0.2 },
//   '💔': { energy: 0.3, valence: 0.1, danceability: 0.2 },
//   '😞': { energy: 0.2, valence: 0.2, danceability: 0.2 },
  
//   // Calm/Relaxed
//   '😌': { energy: 0.3, valence: 0.7, danceability: 0.3 },
//   '🧘': { energy: 0.1, valence: 0.6, danceability: 0.1 },
//   '😴': { energy: 0.1, valence: 0.5, danceability: 0.1 },
//   '🌙': { energy: 0.2, valence: 0.6, danceability: 0.2 },
//   '☁️': { energy: 0.2, valence: 0.5, danceability: 0.2 },
  
//   // Angry/Intense
//   '😠': { energy: 0.8, valence: 0.2, danceability: 0.6 },
//   '😡': { energy: 0.9, valence: 0.1, danceability: 0.7 },
//   '🤬': { energy: 0.9, valence: 0.1, danceability: 0.7 },
  
//   // Workout/Motivation
//   '💪': { energy: 0.8, valence: 0.7, danceability: 0.6 },
//   '🏃': { energy: 0.9, valence: 0.6, danceability: 0.5 },
//   '🥇': { energy: 0.7, valence: 0.8, danceability: 0.6 },
  
//   // Love/Romance
//   '❤️': { energy: 0.5, valence: 0.8, danceability: 0.4 },
//   '💕': { energy: 0.4, valence: 0.8, danceability: 0.3 },
//   '💖': { energy: 0.6, valence: 0.9, danceability: 0.5 },
// };

// // Text sentiment keywords
// const textMoodKeywords = {
//   happy: { energy: 0.7, valence: 0.8, danceability: 0.6, keywords: ['happy', 'joy', 'excited', 'cheerful', 'upbeat'] },
//   sad: { energy: 0.2, valence: 0.2, danceability: 0.2, keywords: ['sad', 'depressed', 'down', 'blue', 'melancholy'] },
//   energetic: { energy: 0.9, valence: 0.7, danceability: 0.8, keywords: ['energetic', 'pumped', 'hyped', 'intense', 'powerful'] },
//   calm: { energy: 0.2, valence: 0.6, danceability: 0.2, keywords: ['calm', 'relaxed', 'peaceful', 'chill', 'serene'] },
//   angry: { energy: 0.8, valence: 0.2, danceability: 0.6, keywords: ['angry', 'mad', 'furious', 'rage', 'frustrated'] },
//   romantic: { energy: 0.4, valence: 0.8, danceability: 0.3, keywords: ['love', 'romantic', 'tender', 'affectionate', 'intimate'] },
//   motivated: { energy: 0.8, valence: 0.7, danceability: 0.5, keywords: ['motivated', 'determined', 'focused', 'driven', 'ambitious'] },
//   nostalgic: { energy: 0.4, valence: 0.5, danceability: 0.3, keywords: ['nostalgic', 'memories', 'past', 'reminisce', 'throwback'] }
// };

// function analyzeMood(emojis) {
//   if (!emojis || emojis.length === 0) {
//     // Default neutral mood
//     return {
//       energy: 0.5,
//       valence: 0.5,
//       danceability: 0.5,
//       mood: 'neutral'
//     };
//   }
  
//   let totalEnergy = 0;
//   let totalValence = 0;
//   let totalDanceability = 0;
//   let count = 0;
  
//   emojis.forEach(emoji => {
//     if (emojiMoodMap[emoji]) {
//       totalEnergy += emojiMoodMap[emoji].energy;
//       totalValence += emojiMoodMap[emoji].valence;
//       totalDanceability += emojiMoodMap[emoji].danceability;
//       count++;
//     }
//   });
  
//   if (count === 0) {
//     return {
//       energy: 0.5,
//       valence: 0.5,
//       danceability: 0.5,
//       mood: 'neutral'
//     };
//   }
  
//   const energy = totalEnergy / count;
//   const valence = totalValence / count;
//   const danceability = totalDanceability / count;
  
//   // Determine primary mood
//   const mood = determinePrimaryMood(energy, valence, danceability);
  
//   return {
//     energy,
//     valence,
//     danceability,
//     mood,
//     // Additional Spotify audio features
//     acousticness: valence < 0.4 ? 0.7 : 0.3,
//     instrumentalness: 0.1,
//     liveness: energy > 0.7 ? 0.3 : 0.1,
//     speechiness: 0.1,
//     tempo: Math.round(60 + (energy * 120)), // 60-180 BPM range
//     loudness: -20 + (energy * 15), // -20 to -5 dB range
//     mode: valence > 0.5 ? 1 : 0, // Major/Minor
//     key: Math.floor(Math.random() * 12), // Random key
//     time_signature: 4
//   };
// }

// function analyzeTextMood(text) {
//   const lowercaseText = text.toLowerCase();
//   let bestMatch = null;
//   let maxMatches = 0;
  
//   // Find the mood category with the most keyword matches
//   Object.entries(textMoodKeywords).forEach(([moodName, moodData]) => {
//     const matches = moodData.keywords.filter(keyword => 
//       lowercaseText.includes(keyword)
//     ).length;
    
//     if (matches > maxMatches) {
//       maxMatches = matches;
//       bestMatch = { name: moodName, ...moodData };
//     }
//   });
  
//   // If no keywords match, use basic sentiment analysis
//   if (!bestMatch) {
//     bestMatch = basicSentimentAnalysis(lowercaseText);
//   }
  
//   return {
//     energy: bestMatch.energy,
//     valence: bestMatch.valence,
//     danceability: bestMatch.danceability,
//     mood: bestMatch.name || bestMatch.mood,
//     // Additional Spotify audio features
//     acousticness: bestMatch.valence < 0.4 ? 0.7 : 0.3,
//     instrumentalness: 0.1,
//     liveness: bestMatch.energy > 0.7 ? 0.3 : 0.1,
//     speechiness: 0.1,
//     tempo: Math.round(60 + (bestMatch.energy * 120)),
//     loudness: -20 + (bestMatch.energy * 15),
//     mode: bestMatch.valence > 0.5 ? 1 : 0,
//     key: Math.floor(Math.random() * 12),
//     time_signature: 4
//   };
// }

// function basicSentimentAnalysis(text) {
//   const positiveWords = ['good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent'];
//   const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'depressing', 'boring'];
//   const energeticWords = ['fast', 'quick', 'rapid', 'intense', 'loud', 'strong'];
//   const calmWords = ['slow', 'quiet', 'soft', 'gentle', 'peaceful', 'smooth'];
  
//   let positiveScore = 0;
//   let negativeScore = 0;
//   let energeticScore = 0;
//   let calmScore = 0;
  
//   positiveWords.forEach(word => {
//     if (text.includes(word)) positiveScore++;
//   });
  
//   negativeWords.forEach(word => {
//     if (text.includes(word)) negativeScore++;
//   });
  
//   energeticWords.forEach(word => {
//     if (text.includes(word)) energeticScore++;
//   });
  
//   calmWords.forEach(word => {
//     if (text.includes(word)) calmScore++;
//   });
  
//   // Calculate mood based on scores
//   const valence = Math.max(0, Math.min(1, 0.5 + (positiveScore - negativeScore) * 0.2));
//   const energy = Math.max(0, Math.min(1, 0.5 + (energeticScore - calmScore) * 0.2));
  
//   return {
//     energy,
//     valence,
//     danceability: energy * 0.8,
//     mood: 'analyzed'
//   };
// }

// function determinePrimaryMood(energy, valence, danceability) {
//   if (energy > 0.7 && valence > 0.7) return 'happy';
//   if (energy > 0.8 && danceability > 0.7) return 'energetic';
//   if (valence < 0.3) return 'sad';
//   if (energy < 0.3 && valence > 0.5) return 'calm';
//   if (energy > 0.7 && valence < 0.4) return 'angry';
//   if (valence > 0.7 && energy < 0.6) return 'romantic';
//   return 'neutral';
// }

// module.exports = {
//   analyzeMood,
//   analyzeTextMood,
//   emojiMoodMap,
//   textMoodKeywords
// };

// Comprehensive emoji to mood mapping
const emojiMoodMap = {
  // Happy/Joyful
  '😀': { energy: 0.8, valence: 0.9, danceability: 0.7, mood: 'happy' },
  '😃': { energy: 0.8, valence: 0.9, danceability: 0.7, mood: 'happy' },
  '😄': { energy: 0.9, valence: 0.9, danceability: 0.8, mood: 'happy' },
  '😁': { energy: 0.8, valence: 0.8, danceability: 0.7, mood: 'happy' },
  '😊': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'happy' },
  '😍': { energy: 0.7, valence: 0.9, danceability: 0.6, mood: 'happy' },
  '🥰': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  
  // Energetic/Party
  '🔥': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'energetic' },
  '🎉': { energy: 0.9, valence: 0.9, danceability: 0.9, mood: 'energetic' },
  '💃': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'energetic' },
  '🕺': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'energetic' },
  '⚡': { energy: 1.0, valence: 0.7, danceability: 0.8, mood: 'energetic' },
  '🚀': { energy: 0.9, valence: 0.8, danceability: 0.7, mood: 'energetic' },
  
  // Sad/Melancholic
  '😢': { energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad' },
  '😭': { energy: 0.3, valence: 0.1, danceability: 0.1, mood: 'sad' },
  '😔': { energy: 0.2, valence: 0.3, danceability: 0.2, mood: 'sad' },
  '💔': { energy: 0.3, valence: 0.1, danceability: 0.2, mood: 'sad' },
  '😞': { energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad' },
  '🌧️': { energy: 0.3, valence: 0.4, danceability: 0.2, mood: 'sad' },
  
  // Calm/Relaxed
  '😌': { energy: 0.3, valence: 0.7, danceability: 0.3, mood: 'calm' },
  '🧘': { energy: 0.1, valence: 0.6, danceability: 0.1, mood: 'calm' },
  '😴': { energy: 0.1, valence: 0.5, danceability: 0.1, mood: 'calm' },
  '🌙': { energy: 0.2, valence: 0.6, danceability: 0.2, mood: 'calm' },
  '☁️': { energy: 0.2, valence: 0.5, danceability: 0.2, mood: 'calm' },
  '🌊': { energy: 0.3, valence: 0.6, danceability: 0.3, mood: 'calm' },
  
  // Angry/Intense
  '😠': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry' },
  '😡': { energy: 0.9, valence: 0.1, danceability: 0.7, mood: 'angry' },
  '🤬': { energy: 0.9, valence: 0.1, danceability: 0.7, mood: 'angry' },
  '👿': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry' },
  
  // Workout/Motivation
  '💪': { energy: 0.8, valence: 0.7, danceability: 0.6, mood: 'energetic' },
  '🏃': { energy: 0.9, valence: 0.6, danceability: 0.5, mood: 'energetic' },
  '🥇': { energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'happy' },
  '🎯': { energy: 0.7, valence: 0.7, danceability: 0.5, mood: 'focused' },
  
  // Love/Romance
  '❤️': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '💕': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  '💖': { energy: 0.6, valence: 0.9, danceability: 0.5, mood: 'romantic' },
  '😘': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '🌹': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  
  // Other moods
  '🤔': { energy: 0.4, valence: 0.5, danceability: 0.3, mood: 'contemplative' },
  '😎': { energy: 0.6, valence: 0.7, danceability: 0.6, mood: 'cool' },
  '🤗': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'happy' },
  '😋': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'happy' },
  '🤩': { energy: 0.8, valence: 0.9, danceability: 0.7, mood: 'excited' },
  '🥳': { energy: 0.9, valence: 0.9, danceability: 0.9, mood: 'party' }
};

// Text sentiment keywords with mood mappings
const textMoodKeywords = {
  // Happy keywords
  happy: { 
    energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'happy',
    keywords: ['happy', 'joy', 'joyful', 'excited', 'cheerful', 'upbeat', 'elated', 'thrilled']
  },
  
  // Sad keywords
  sad: { 
    energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad',
    keywords: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'dejected', 'heartbroken']
  },
  
  // Energetic keywords
  energetic: { 
    energy: 0.9, valence: 0.7, danceability: 0.8, mood: 'energetic',
    keywords: ['energetic', 'pumped', 'hyped', 'intense', 'powerful', 'dynamic', 'vigorous', 'workout']
  },
  
  // Calm keywords
  calm: { 
    energy: 0.2, valence: 0.6, danceability: 0.2, mood: 'calm',
    keywords: ['calm', 'relaxed', 'peaceful', 'chill', 'serene', 'tranquil', 'mellow', 'zen']
  },
  
  // Angry keywords
  angry: { 
    energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry',
    keywords: ['angry', 'mad', 'furious', 'rage', 'frustrated', 'irritated', 'livid', 'pissed']
  },
  
  // Romantic keywords
  romantic: { 
    energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic',
    keywords: ['love', 'romantic', 'tender', 'affectionate', 'intimate', 'passion', 'romance', 'crush']
  },
  
  // Motivated keywords
  motivated: { 
    energy: 0.8, valence: 0.7, danceability: 0.5, mood: 'motivated',
    keywords: ['motivated', 'determined', 'focused', 'driven', 'ambitious', 'goal', 'achieve', 'success']
  },
  
  // Nostalgic keywords
  nostalgic: { 
    energy: 0.4, valence: 0.5, danceability: 0.3, mood: 'nostalgic',
    keywords: ['nostalgic', 'memories', 'past', 'reminisce', 'throwback', 'remember', 'childhood', 'miss']
  },
  
  // Party keywords
  party: { 
    energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'party',
    keywords: ['party', 'dance', 'club', 'rave', 'celebration', 'festive', 'wild', 'crazy']
  },
  
  // Study/Focus keywords
  focus: { 
    energy: 0.5, valence: 0.6, danceability: 0.3, mood: 'focus',
    keywords: ['study', 'focus', 'concentrate', 'work', 'productivity', 'learning', 'exam', 'homework']
  }
};

/**
 * Analyze mood from text input
 * @param {string} text - The text to analyze
 * @returns {Object} Mood data with energy, valence, danceability, etc.
 */
function analyzeTextMood(text) {
  if (!text || typeof text !== 'string') {
    return getNeutralMood();
  }
  
  const lowercaseText = text.toLowerCase();
  let bestMatch = null;
  let maxMatches = 0;
  
  // Find the mood category with the most keyword matches
  Object.entries(textMoodKeywords).forEach(([moodName, moodData]) => {
    const matches = moodData.keywords.filter(keyword => 
      lowercaseText.includes(keyword)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = { name: moodName, ...moodData };
    }
  });
  
  // If no keywords match, use basic sentiment analysis
  if (!bestMatch || maxMatches === 0) {
    bestMatch = basicSentimentAnalysis(lowercaseText);
  }
  
  return buildMoodResponse(bestMatch);
}

/**
 * Analyze mood from emoji array
 * @param {Array} emojis - Array of emoji strings
 * @returns {Object} Mood data with energy, valence, danceability, etc.
 */
function analyzeEmojiMood(emojis) {
  if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
    return getNeutralMood();
  }
  
  let totalEnergy = 0;
  let totalValence = 0;
  let totalDanceability = 0;
  let count = 0;
  let dominantMood = 'neutral';
  const moodCounts = {};
  
  emojis.forEach(emoji => {
    if (emojiMoodMap[emoji]) {
      const data = emojiMoodMap[emoji];
      totalEnergy += data.energy;
      totalValence += data.valence;
      totalDanceability += data.danceability;
      count++;
      
      // Count mood occurrences to find dominant mood
      moodCounts[data.mood] = (moodCounts[data.mood] || 0) + 1;
    }
  });
  
  if (count === 0) {
    return getNeutralMood();
  }
  
  // Find the most common mood
  dominantMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  );
  
  const avgEnergy = totalEnergy / count;
  const avgValence = totalValence / count;
  const avgDanceability = totalDanceability / count;
  
  return buildMoodResponse({
    energy: avgEnergy,
    valence: avgValence,
    danceability: avgDanceability,
    mood: dominantMood
  });
}

/**
 * Basic sentiment analysis for text without keyword matches
 * @param {string} text - Lowercase text to analyze
 * @returns {Object} Basic mood data
 */
function basicSentimentAnalysis(text) {
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent', 'brilliant'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'boring', 'worst', 'hate', 'sucks'];
  const energeticWords = ['fast', 'quick', 'rapid', 'intense', 'loud', 'strong', 'powerful', 'high'];
  const calmWords = ['slow', 'quiet', 'soft', 'gentle', 'peaceful', 'smooth', 'low', 'light'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  let energeticScore = 0;
  let calmScore = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) negativeScore++;
  });
  
  energeticWords.forEach(word => {
    if (text.includes(word)) energeticScore++;
  });
  
  calmWords.forEach(word => {
    if (text.includes(word)) calmScore++;
  });
  
  // Calculate mood based on scores
  const valence = Math.max(0, Math.min(1, 0.5 + (positiveScore - negativeScore) * 0.15));
  const energy = Math.max(0, Math.min(1, 0.5 + (energeticScore - calmScore) * 0.15));
  const danceability = energy * 0.7;
  
  let mood = 'neutral';
  if (valence > 0.7) mood = 'happy';
  else if (valence < 0.3) mood = 'sad';
  else if (energy > 0.7) mood = 'energetic';
  else if (energy < 0.3) mood = 'calm';
  
  return {
    energy,
    valence,
    danceability,
    mood
  };
}

/**
 * Get neutral mood data
 * @returns {Object} Neutral mood configuration
 */
function getNeutralMood() {
  return buildMoodResponse({
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    mood: 'neutral'
  });
}

/**
 * Build complete mood response with all Spotify audio features
 * @param {Object} moodData - Basic mood data
 * @returns {Object} Complete mood response
 */
function buildMoodResponse(moodData) {
  const { energy, valence, danceability, mood } = moodData;
  
  return {
    energy: Number(energy.toFixed(2)),
    valence: Number(valence.toFixed(2)),
    danceability: Number(danceability.toFixed(2)),
    mood,
    
    // Additional Spotify audio features
    acousticness: Number((valence < 0.4 ? 0.7 : 0.3).toFixed(2)),
    instrumentalness: 0.1,
    liveness: Number((energy > 0.7 ? 0.3 : 0.1).toFixed(2)),
    speechiness: 0.1,
    tempo: Math.round(60 + (energy * 120)), // 60-180 BPM range
    loudness: Number((-20 + (energy * 15)).toFixed(1)), // -20 to -5 dB range
    mode: valence > 0.5 ? 1 : 0, // Major/Minor
    key: Math.floor(Math.random() * 12), // Random key 0-11
    time_signature: 4
  };
}

/**
 * Get all available emoji moods for reference
 * @returns {Object} All emoji mood mappings
 */
function getEmojiMoodMap() {
  return emojiMoodMap;
}

/**
 * Get all text mood keywords for reference
 * @returns {Object} All text mood keyword mappings
 */
function getTextMoodKeywords() {
  return textMoodKeywords;
}

module.exports = {
  analyzeTextMood,
  analyzeEmojiMood,
  getEmojiMoodMap,
  getTextMoodKeywords
};