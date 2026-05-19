const mongoose = require('mongoose')

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['recycling', 'water', 'energy', 'planting', 'wildlife', 'pollution'],
    required: true
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  xpReward: { type: Number, required: true },
  ecoinReward: { type: Number, required: true },
  gardenReward: { type: Number, default: 0 },
  proofRequired: { type: Boolean, default: true },
  proofType: { type: String, enum: ['photo', 'self-report', 'peer-validated'], default: 'photo' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proofUrl: { type: String },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
  }]
}, { timestamps: true })

module.exports = mongoose.model('Mission', missionSchema)