const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true }
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['java', 'cpp']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  source: {
    type: String,
    required: true,
    enum: ['LeetCode', 'HackerRank', 'Codeforces', 'VNOJ', 'GeeksforGeeks']
  },
  sourceUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    default: ''
  },
  testCases: [testCaseSchema],
  points: {
    type: Number,
    default: 10
  },
  tags: [{
    type: String
  }],
  totalSubmissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exerciseSchema.index({ language: 1, difficulty: 1, source: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
