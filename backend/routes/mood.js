const express = require('express');
const { analyzeEmojiMood, analyzeTextMood } = require('../utils/moodAnalyzer');
const router = express.Router();

// Analyze emoji mood
router.post('/analyze-emoji', (req, res) => {
  try {
    const { emojis } = req.body;
    
    if (!emojis || !Array.isArray(emojis)) {
      return res.status(400).json({ error: 'Emojis array required' });
    }
    
    const moodData = analyzeEmojiMood(emojis)
    res.json(moodData);
  } catch (error) {
    console.error('Emoji analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze emoji mood' });
  }
});

// Analyze text mood
router.post('/analyze-text', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }
    
    const moodData = analyzeTextMood(text);
    res.json(moodData);
  } catch (error) {
    console.error('Text analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze text mood' });
  }
});

module.exports = router;