const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['java', 'cpp']
  },
  order: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  theoryHTML: {
    type: String,
    required: true
  },
  defaultCode: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

topicSchema.index({ language: 1, order: 1 });

module.exports = mongoose.model('Topic', topicSchema);
