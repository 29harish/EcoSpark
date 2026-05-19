const mongoose = require('mongoose')

const gardenSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  level: { type: Number, default: 1 },
  name: { type: String, default: 'My Eco Garden' },
  health: { type: Number, default: 100 },
  waterPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  stage: {
    type: String,
    enum: ['seedling', 'sprout', 'sapling', 'tree', 'forest', 'earth-guardian'],
    default: 'seedling'
  },
  unlockedItems: [{ type: String }],
  equippedItems: [{ type: String }],
  lastWatered: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Garden', gardenSchema)