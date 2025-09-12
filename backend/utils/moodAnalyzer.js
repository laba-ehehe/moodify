// Emoji to mood mapping
const emojiMoodMap = {
  // Happy/Joyful
  '😀': { energy: 0.8, valence: 0.9, danceability: 0.7 },
  '😃': { energy: 0.8, valence: 0.9, danceability: 0.7 },
  '😄': { energy: 0.9, valence: 0.9, danceability: 0.8 },
  '😁': { energy: 0.8, valence: 0.8, danceability: 0.7 },
  '😊': { energy: 0.6, valence: 0.8, danceability: 0.5 },
  '😍': { energy: 0.7, valence: 0.9, danceability: 0.6 },
  '🥰': { energy: 0.5, valence: 0.8, danceability: 0.4 },
  
  // Energetic/Party
  '🔥': { energy: 0.9, valence: 0.8, danceability: 0.9 },
  '🎉': { energy: 0.9, valence: 0.9, danceability: 0.9 },
  '💃': { energy: 0.9, valence: 0.8, danceability: 0.9 },
  '🕺': { energy: 0.9, valence: 0.8, danceability: 0.9 },
  '⚡': { energy: 1.0, valence: 0.7, danceability: 0.8 },
  
  // Sad/Melancholic
  '😢': { energy: 0.2, valence: 0.2, danceability: 0.2 },
  '😭': { energy: 0.3, valence: 0.1, danceability: 0.1 },
  '😔': { energy: 0.2, valence: 0.3, danceability: 0.2 },
  '💔': { energy: 0.3, valence: 0.1, danceability: 0.2 },
  '😞': { energy: 0.2, valence: 0.2, danceability: 0.2 },
  
  // Calm/Relaxed
  '😌': { energy: 0.3, valence: 0.7, danceability: 0.3 },
  '🧘': { energy: 0.1, valence: 0.6, danceability: 0.1 },
  '😴': { energy: 0.1, valence: 0.5, danceability: 0.1 },
  '🌙': { energy: 0.2, valence: 0.6, danceability: 0.2 },
  '☁️': { energy: 0.2, valence: 0.5, danceability: 0.2 },
  
  // Angry/Intense
  '😠': { energy: 0.8, valence: 0.2, danceability: 0.6 },
  '😡': { energy: 0.9, valence: 0.1, danceability: 0.7 },
  '🤬': { energy: 0.9, valence: 0.1, danceability: 0.7 },
  
  // Workout/Motivation
  '💪': { energy: 0.8, valence: 0.7, danceability: 0.6 },
  '🏃': { energy: 0.9, valence: 0.6, danceability: 0.5 },
  '🥇': { energy: 0.7, valence: 0.8, danceability: 0.6 },
  
  // Love/Romance
  '❤️': { energy: 0.5, valence: 0.8, danceability: 0.4 },
  '💕': { energy: 0.4, valence: 0.8, danceability: 0.3 },
  '💖': { energy: 0.6, valence: 0.9, danceability: 0.5 },
};

// Text sentiment keywords
const textMoodKeywords = {
  happy: { energy: 0.7, valence: 0.8, danceability: 0.6, keywords: ['happy', 'joy', 'excited', 'cheerful', 'upbeat'] },
  sad: { energy: 0.2, valence: 0.2, danceability: 0.2, keywords: ['sad', 'depressed', 'down', 'blue', 'melancholy'] },
  energetic: { energy: 0.9, valence: 0.7, danceability: 0.8, keywords: ['energetic', 'pumped', 'hyped', 'intense', 'powerful'] },
  calm: { energy: 0.2, valence: 0.6, danceability: 0.2, keywords: ['calm', 'relaxed', 'peaceful', 'chill', 'serene'] },
  angry: { energy: 0.8, valence: 0.2, danceability: 0.6, keywords: ['angry', 'mad', 'furious', 'rage', 'frustrated'] },
  romantic: { energy: 0.4, valence: 0.8, danceability: 0.3, keywords: ['love', 'romantic', 'tender', 'affectionate', 'intimate'] },
  motivated: { energy: 0.8, valence: 0.7, danceability: 0.5, keywords: ['motivated', 'determined', 'focused', 'driven', 'ambitious'] },
  nostalgic: { energy: 0.4, valence: 0.5, danceability: 0.3, keywords: ['nostalgic', 'memories', 'past', 'reminisce', 'throwback'] }
};

function analyzeMood(emojis) {
  if (!emojis || emojis.length === 0) {
    // Default neutral mood
    return {
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      mood: 'neutral'
    };
  }
  
  let totalEnergy = 0;
  let totalValence = 0;
  let totalDanceability = 0;
  let count = 0;
  
  emojis.forEach(emoji => {
    if (emojiMoodMap[emoji]) {
      totalEnergy += emojiMoodMap[emoji].energy;
      totalValence += emojiMoodMap[emoji].valence;
      totalDanceability += emojiMoodMap[emoji].danceability;
      count++;
    }
  });
  
  if (count === 0) {
    return {
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      mood: 'neutral'
    };
  }
  
  const energy = totalEnergy / count;
  const valence = totalValence / count;
  const danceability = totalDanceability / count;
  
  // Determine primary mood
  const mood = determinePrimaryMood(energy, valence, danceability);
  
  return {
    energy,
    valence,
    danceability,
    mood,
    // Additional Spotify audio features
    acousticness: valence < 0.4 ? 0.7 : 0.3,
    instrumentalness: 0.1,
    liveness: energy > 0.7 ? 0.3 : 0.1,
    speechiness: 0.1,
    tempo: Math.round(60 + (energy * 120)), // 60-180 BPM range
    loudness: -20 + (energy * 15), // -20 to -5 dB range
    mode: valence > 0.5 ? 1 : 0, // Major/Minor
    key: Math.floor(Math.random() * 12), // Random key
    time_signature: 4
  };
}

function analyzeTextMood(text) {
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
  if (!bestMatch) {
    bestMatch = basicSentimentAnalysis(lowercaseText);
  }
  
  return {
    energy: bestMatch.energy,
    valence: bestMatch.valence,
    danceability: bestMatch.danceability,
    mood: bestMatch.name || bestMatch.mood,
    // Additional Spotify audio features
    acousticness: bestMatch.valence < 0.4 ? 0.7 : 0.3,
    instrumentalness: 0.1,
    liveness: bestMatch.energy > 0.7 ? 0.3 : 0.1,
    speechiness: 0.1,
    tempo: Math.round(60 + (bestMatch.energy * 120)),
    loudness: -20 + (bestMatch.energy * 15),
    mode: bestMatch.valence > 0.5 ? 1 : 0,
    key: Math.floor(Math.random() * 12),
    time_signature: 4
  };
}

function basicSentimentAnalysis(text) {
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'depressing', 'boring'];
  const energeticWords = ['fast', 'quick', 'rapid', 'intense', 'loud', 'strong'];
  const calmWords = ['slow', 'quiet', 'soft', 'gentle', 'peaceful', 'smooth'];
  
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
  const valence = Math.max(0, Math.min(1, 0.5 + (positiveScore - negativeScore) * 0.2));
  const energy = Math.max(0, Math.min(1, 0.5 + (energeticScore - calmScore) * 0.2));
  
  return {
    energy,
    valence,
    danceability: energy * 0.8,
    mood: 'analyzed'
  };
}

function determinePrimaryMood(energy, valence, danceability) {
  if (energy > 0.7 && valence > 0.7) return 'happy';
  if (energy > 0.8 && danceability > 0.7) return 'energetic';
  if (valence < 0.3) return 'sad';
  if (energy < 0.3 && valence > 0.5) return 'calm';
  if (energy > 0.7 && valence < 0.4) return 'angry';
  if (valence > 0.7 && energy < 0.6) return 'romantic';
  return 'neutral';
}

module.exports = {
  analyzeMood,
  analyzeTextMood,
  emojiMoodMap,
  textMoodKeywords
};