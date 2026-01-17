const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  visitedAt: {
    type: Date,
    default: Date.now
  },
  page: {
    type: String,
    default: 'home'
  }
});

// Index to improve query performance
visitorSchema.index({ ip: 1, visitedAt: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
