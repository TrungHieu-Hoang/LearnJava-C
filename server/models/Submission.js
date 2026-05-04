const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  error: String
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['java', 'cpp', 'c', 'python']
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'wrong', 'error', 'tle']
  },
  output: {
    type: String,
    default: ''
  },
  testResults: [testResultSchema],
  passedTests: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  executedAt: {
    type: Date,
    default: Date.now
  }
});

submissionSchema.index({ userId: 1, exerciseId: 1 });
submissionSchema.index({ userId: 1, executedAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
