const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  wordCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Translation', translationSchema);
