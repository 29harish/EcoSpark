const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  school: { type: String, default: '' },
  grade: { type: String, default: '' },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  ecoins: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  treesPlanted: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  completedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)