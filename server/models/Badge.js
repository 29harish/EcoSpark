const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: {
    type: String,
    enum: ['missions', 'streak', 'quiz', 'garden', 'community', 'special'],
    required: true
  },
  requirement: {
    type: { type: String },
    count: { type: Number },
  },
  xpReward: { type: Number, default: 50 },
  ecoinReward: { type: Number, default: 20 },
  isRare: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Badge', badgeSchema)