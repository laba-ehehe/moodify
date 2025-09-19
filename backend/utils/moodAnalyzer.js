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
  '😸': { energy: 0.8, valence: 0.9, danceability: 0.7, mood: 'happy' },
  '😻': { energy: 0.7, valence: 0.9, danceability: 0.6, mood: 'happy' },
  '🤗': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'happy' },
  '🌞': { energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'happy' },
  '🌻': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'happy' },
  '🐶': { energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'happy' },
  
  // Energetic/Party
  '🔥': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'energetic' },
  '🎉': { energy: 0.9, valence: 0.9, danceability: 0.9, mood: 'party' },
  '💃': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'party' },
  '🕺': { energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'party' },
  '⚡': { energy: 1.0, valence: 0.7, danceability: 0.8, mood: 'energetic' },
  '🚀': { energy: 0.9, valence: 0.8, danceability: 0.7, mood: 'energetic' },
  '🎆': { energy: 0.9, valence: 0.9, danceability: 0.9, mood: 'party' },
  '🌟': { energy: 0.8, valence: 0.8, danceability: 0.7, mood: 'excited' },
  '💥': { energy: 1.0, valence: 0.7, danceability: 0.8, mood: 'energetic' },
  '🔊': { energy: 0.9, valence: 0.7, danceability: 0.8, mood: 'party' },
  '🔔': { energy: 0.7, valence: 0.6, danceability: 0.6, mood: 'energetic' },
  '🤩': { energy: 0.8, valence: 0.9, danceability: 0.7, mood: 'excited' },
  '🥳': { energy: 0.9, valence: 0.9, danceability: 0.9, mood: 'party' },
  '💫': { energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'excited' },
  
  // Sad/Melancholic
  '😢': { energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad' },
  '😭': { energy: 0.3, valence: 0.1, danceability: 0.1, mood: 'sad' },
  '😔': { energy: 0.2, valence: 0.3, danceability: 0.2, mood: 'sad' },
  '💔': { energy: 0.3, valence: 0.1, danceability: 0.2, mood: 'lonely' },
  '😞': { energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad' },
  '🌧️': { energy: 0.3, valence: 0.4, danceability: 0.2, mood: 'melancholic' },
  '😿': { energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad' },
  '🥺': { energy: 0.3, valence: 0.3, danceability: 0.2, mood: 'lonely' },
  '🥀': { energy: 0.3, valence: 0.4, danceability: 0.2, mood: 'melancholic' },
  
  // Calm/Relaxed
  '😌': { energy: 0.3, valence: 0.7, danceability: 0.3, mood: 'calm' },
  '🧘': { energy: 0.1, valence: 0.6, danceability: 0.1, mood: 'meditative' },
  '😴': { energy: 0.1, valence: 0.5, danceability: 0.1, mood: 'sleepy' },
  '🌙': { energy: 0.2, valence: 0.6, danceability: 0.2, mood: 'sleepy' },
  '☁️': { energy: 0.2, valence: 0.5, danceability: 0.2, mood: 'dreamy' },
  '🌊': { energy: 0.3, valence: 0.6, danceability: 0.3, mood: 'calm' },
  '🌅': { energy: 0.3, valence: 0.7, danceability: 0.3, mood: 'hopeful' },
  '🌄': { energy: 0.3, valence: 0.6, danceability: 0.3, mood: 'calm' },
  '🕯️': { energy: 0.2, valence: 0.6, danceability: 0.2, mood: 'meditative' },
  '🛁': { energy: 0.1, valence: 0.7, danceability: 0.1, mood: 'calm' },
  '🍵': { energy: 0.3, valence: 0.6, danceability: 0.2, mood: 'calm' },
  '🌫️': { energy: 0.2, valence: 0.4, danceability: 0.2, mood: 'dreamy' },
  '❄️': { energy: 0.3, valence: 0.6, danceability: 0.3, mood: 'calm' },
  '💧': { energy: 0.2, valence: 0.5, danceability: 0.2, mood: 'calm' },
  '🐼': { energy: 0.4, valence: 0.7, danceability: 0.3, mood: 'calm' },
  '🦋': { energy: 0.5, valence: 0.8, danceability: 0.5, mood: 'dreamy' },
  
  // Angry/Intense
  '😠': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry' },
  '😡': { energy: 0.9, valence: 0.1, danceability: 0.7, mood: 'angry' },
  '🤬': { energy: 0.9, valence: 0.1, danceability: 0.7, mood: 'rebellious' },
  '👿': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'dark' },
  '👺': { energy: 0.9, valence: 0.1, danceability: 0.7, mood: 'angry' },
  '💢': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry' },
  '🗯️': { energy: 0.7, valence: 0.2, danceability: 0.5, mood: 'angry' },
  '🌋': { energy: 0.9, valence: 0.2, danceability: 0.6, mood: 'angry' },
  '⛈️': { energy: 0.5, valence: 0.2, danceability: 0.3, mood: 'dark' },
  
  // Workout/Motivation
  '💪': { energy: 0.8, valence: 0.7, danceability: 0.6, mood: 'workout' },
  '🏃': { energy: 0.9, valence: 0.6, danceability: 0.5, mood: 'workout' },
  '🥇': { energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'confident' },
  '🎯': { energy: 0.7, valence: 0.7, danceability: 0.5, mood: 'focused' },
  '🚴': { energy: 0.8, valence: 0.7, danceability: 0.6, mood: 'workout' },
  '🏊': { energy: 0.7, valence: 0.6, danceability: 0.5, mood: 'workout' },
  '🤾': { energy: 0.8, valence: 0.7, danceability: 0.7, mood: 'workout' },
  '🧗': { energy: 0.9, valence: 0.7, danceability: 0.5, mood: 'workout' },
  '🥊': { energy: 0.9, valence: 0.6, danceability: 0.6, mood: 'workout' },
  '🤺': { energy: 0.8, valence: 0.7, danceability: 0.6, mood: 'workout' },
  
  // Love/Romance
  '❤️': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '💕': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  '💖': { energy: 0.6, valence: 0.9, danceability: 0.5, mood: 'romantic' },
  '😘': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '🌹': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  '😙': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '😚': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'romantic' },
  '💑': { energy: 0.4, valence: 0.9, danceability: 0.3, mood: 'romantic' },
  '💐': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  '💌': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  '💒': { energy: 0.5, valence: 0.9, danceability: 0.4, mood: 'romantic' },
  '💞': { energy: 0.5, valence: 0.9, danceability: 0.4, mood: 'romantic' },
  '🌷': { energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic' },
  
  // Anxious/Stressed
  '😰': { energy: 0.6, valence: 0.3, danceability: 0.4, mood: 'anxious' },
  '😣': { energy: 0.4, valence: 0.2, danceability: 0.3, mood: 'anxious' },
  '😖': { energy: 0.4, valence: 0.2, danceability: 0.3, mood: 'anxious' },
  '😵': { energy: 0.6, valence: 0.2, danceability: 0.4, mood: 'anxious' },
  '🤯': { energy: 0.8, valence: 0.3, danceability: 0.5, mood: 'anxious' },
  '😓': { energy: 0.5, valence: 0.3, danceability: 0.4, mood: 'anxious' },
  '🥵': { energy: 0.7, valence: 0.3, danceability: 0.5, mood: 'anxious' },
  '🥶': { energy: 0.4, valence: 0.3, danceability: 0.3, mood: 'anxious' },
  
  // Playful/Fun
  '😋': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'playful' },
  '🤭': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'playful' },
  '🎀': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'playful' },
  '🎃': { energy: 0.6, valence: 0.5, danceability: 0.5, mood: 'playful' },
  '🐱': { energy: 0.5, valence: 0.8, danceability: 0.4, mood: 'playful' },
  
  // Technology/Modern
  '🎮': { energy: 0.6, valence: 0.7, danceability: 0.5, mood: 'focused' },
  '📱': { energy: 0.5, valence: 0.6, danceability: 0.4, mood: 'focused' },
  '💻': { energy: 0.4, valence: 0.6, danceability: 0.3, mood: 'focused' },
  
  // Dark/Mysterious
  '🕸️': { energy: 0.4, valence: 0.2, danceability: 0.3, mood: 'dark' },
  '⚰️': { energy: 0.3, valence: 0.1, danceability: 0.2, mood: 'dark' },
  '👹': { energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'dark' },
  '☠️': { energy: 0.7, valence: 0.2, danceability: 0.5, mood: 'rebellious' },
  '🌚': { energy: 0.4, valence: 0.3, danceability: 0.3, mood: 'dark' },
  
  // Other moods
  '🤔': { energy: 0.4, valence: 0.5, danceability: 0.3, mood: 'contemplative' },
  '😎': { energy: 0.6, valence: 0.7, danceability: 0.6, mood: 'cool' },
  '🌈': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'hopeful' },
  '🌴': { energy: 0.5, valence: 0.7, danceability: 0.6, mood: 'tropical' },
  '🚗': { energy: 0.6, valence: 0.7, danceability: 0.5, mood: 'road-trip' },
  '📚': { energy: 0.3, valence: 0.6, danceability: 0.2, mood: 'studying' },
  '🍳': { energy: 0.4, valence: 0.7, danceability: 0.4, mood: 'cooking' },
  '🎸': { energy: 0.7, valence: 0.6, danceability: 0.6, mood: 'groovy' },
  '🎭': { energy: 0.5, valence: 0.5, danceability: 0.4, mood: 'vintage' },
  '⭐': { energy: 0.6, valence: 0.8, danceability: 0.5, mood: 'hopeful' }
};

// Text sentiment keywords with mood mappings
const textMoodKeywords = {
  // Original moods
  happy: {
    energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'happy',
    keywords: ['happy', 'joy', 'joyful', 'excited', 'cheerful', 'upbeat', 'elated', 'thrilled']
  },
  sad: {
    energy: 0.2, valence: 0.2, danceability: 0.2, mood: 'sad',
    keywords: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'dejected', 'heartbroken']
  },
  energetic: {
    energy: 0.9, valence: 0.7, danceability: 0.8, mood: 'energetic',
    keywords: ['energetic', 'pumped', 'hyped', 'intense', 'powerful', 'dynamic', 'vigorous']
  },
  calm: {
    energy: 0.2, valence: 0.6, danceability: 0.2, mood: 'calm',
    keywords: ['calm', 'relaxed', 'peaceful', 'chill', 'serene', 'tranquil', 'mellow', 'zen']
  },
  angry: {
    energy: 0.8, valence: 0.2, danceability: 0.6, mood: 'angry',
    keywords: ['angry', 'mad', 'furious', 'rage', 'frustrated', 'irritated', 'livid', 'pissed']
  },
  romantic: {
    energy: 0.4, valence: 0.8, danceability: 0.3, mood: 'romantic',
    keywords: ['love', 'romantic', 'tender', 'affectionate', 'intimate', 'passion', 'romance', 'crush']
  },
  motivated: {
    energy: 0.8, valence: 0.7, danceability: 0.5, mood: 'motivated',
    keywords: ['motivated', 'determined', 'focused', 'driven', 'ambitious', 'goal', 'achieve', 'success']
  },
  nostalgic: {
    energy: 0.4, valence: 0.5, danceability: 0.3, mood: 'nostalgic',
    keywords: ['nostalgic', 'memories', 'past', 'reminisce', 'throwback', 'remember', 'childhood', 'miss']
  },
  party: {
    energy: 0.9, valence: 0.8, danceability: 0.9, mood: 'party',
    keywords: ['party', 'dance', 'club', 'rave', 'celebration', 'festive', 'wild', 'crazy', 'lit']
  },
  focused: {
    energy: 0.5, valence: 0.6, danceability: 0.3, mood: 'focused',
    keywords: ['focus', 'concentrate', 'work', 'productivity', 'efficient', 'organized']
  },
  
  // New moods
  sleepy: {
    energy: 0.1, valence: 0.5, danceability: 0.1, mood: 'sleepy',
    keywords: ['sleepy', 'tired', 'drowsy', 'exhausted', 'yawn', 'bedtime', 'nap']
  },
  dreamy: {
    energy: 0.3, valence: 0.7, danceability: 0.3, mood: 'dreamy',
    keywords: ['dreamy', 'floaty', 'ethereal', 'spacey', 'surreal', 'whimsical']
  },
  meditative: {
    energy: 0.1, valence: 0.6, danceability: 0.1, mood: 'meditative',
    keywords: ['meditate', 'meditation', 'mindful', 'spiritual', 'prayer', 'contemplation']
  },
  confident: {
    energy: 0.7, valence: 0.8, danceability: 0.6, mood: 'confident',
    keywords: ['confident', 'bold', 'fearless', 'strong', 'powerful', 'unstoppable', 'boss']
  },
  playful: {
    energy: 0.7, valence: 0.8, danceability: 0.7, mood: 'playful',
    keywords: ['playful', 'fun', 'silly', 'goofy', 'childish', 'lighthearted', 'whimsical']
  },
  groovy: {
    energy: 0.7, valence: 0.8, danceability: 0.8, mood: 'groovy',
    keywords: ['groovy', 'funky', 'smooth', 'cool', 'jazzy', 'soulful']
  },
  lonely: {
    energy: 0.2, valence: 0.3, danceability: 0.2, mood: 'lonely',
    keywords: ['lonely', 'alone', 'isolated', 'solitary', 'abandoned', 'empty']
  },
  hopeful: {
    energy: 0.5, valence: 0.7, danceability: 0.4, mood: 'hopeful',
    keywords: ['hopeful', 'optimistic', 'positive', 'bright', 'promising', 'faith']
  },
  anxious: {
    energy: 0.6, valence: 0.3, danceability: 0.4, mood: 'anxious',
    keywords: ['anxious', 'nervous', 'worried', 'stressed', 'tense', 'uneasy', 'restless']
  },
  workout: {
    energy: 0.9, valence: 0.7, danceability: 0.7, mood: 'workout',
    keywords: ['workout', 'exercise', 'gym', 'training', 'fitness', 'sweat', 'pump']
  },
  'road-trip': {
    energy: 0.6, valence: 0.7, danceability: 0.5, mood: 'road-trip',
    keywords: ['road', 'trip', 'drive', 'journey', 'travel', 'adventure', 'highway']
  },
  cooking: {
    energy: 0.4, valence: 0.7, danceability: 0.4, mood: 'cooking',
    keywords: ['cooking', 'kitchen', 'baking', 'chef', 'recipe', 'food', 'dinner']
  },
  studying: {
    energy: 0.3, valence: 0.6, danceability: 0.2, mood: 'studying',
    keywords: ['study', 'studying', 'homework', 'exam', 'learning', 'reading', 'library']
  },
  rebellious: {
    energy: 0.8, valence: 0.4, danceability: 0.7, mood: 'rebellious',
    keywords: ['rebel', 'rebellious', 'punk', 'anarchy', 'revolution', 'defiant']
  },
  vintage: {
    energy: 0.5, valence: 0.6, danceability: 0.5, mood: 'vintage',
    keywords: ['vintage', 'retro', 'classic', 'old-school', 'throwback', 'nostalgia']
  },
  tropical: {
    energy: 0.6, valence: 0.8, danceability: 0.7, mood: 'tropical',
    keywords: ['tropical', 'beach', 'summer', 'vacation', 'island', 'paradise', 'sun']
  },
  dark: {
    energy: 0.5, valence: 0.2, danceability: 0.4, mood: 'dark',
    keywords: ['dark', 'gothic', 'gloomy', 'mysterious', 'shadow', 'night', 'haunting']
  }
};

// Rest of your existing functions remain the same...
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

function getNeutralMood() {
  return buildMoodResponse({
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    mood: 'neutral'
  });
}

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

function getEmojiMoodMap() {
  return emojiMoodMap;
}

function getTextMoodKeywords() {
  return textMoodKeywords;
}

module.exports = {
  analyzeTextMood,
  analyzeEmojiMood,
  getEmojiMoodMap,
  getTextMoodKeywords
};