const mongoose = require('mongoose')

const ecoinSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['earned', 'spent'], required: true },
  amount: { type: Number, required: true },
  source: {
    type: String,
    enum: ['mission', 'quiz', 'streak', 'badge', 'reward-store', 'admin'],
    required: true
  },
  description: { type: String, default: '' },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })

module.exports = mongoose.model('Ecoin', ecoinSchema)