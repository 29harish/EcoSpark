const Garden = require('../models/Garden')
const User = require('../models/User')

const getGarden = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) return res.status(404).json({ error: 'User not found' })

    let garden = await Garden.findOne({ student: user._id })
    if (!garden) {
      garden = await Garden.create({ student: user._id })
    }

    res.json({ garden, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const waterGarden = async (req, res) => {
  try {
    const { firebaseUid } = req.body
    const user = await User.findOne({ firebaseUid })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const garden = await Garden.findOne({ student: user._id })
    if (!garden) return res.status(404).json({ error: 'Garden not found' })

    const now = new Date()
    const lastWatered = new Date(garden.lastWatered)
    const hoursSinceWatered = (now - lastWatered) / (1000 * 60 * 60)

    if (hoursSinceWatered < 1) {
      return res.status(400).json({ error: 'Already watered recently! Come back later.' })
    }

    const pointsEarned = 10
    garden.waterPoints += pointsEarned
    garden.totalPoints += pointsEarned
    garden.lastWatered = now

    // Update stage based on total points
    if (garden.totalPoints >= 500) garden.stage = 'earth-guardian'
    else if (garden.totalPoints >= 300) garden.stage = 'forest'
    else if (garden.totalPoints >= 150) garden.stage = 'tree'
    else if (garden.totalPoints >= 75) garden.stage = 'sapling'
    else if (garden.totalPoints >= 25) garden.stage = 'sprout'
    else garden.stage = 'seedling'

    // Update level
    garden.level = Math.floor(garden.totalPoints / 50) + 1

    await garden.save()

    // Give user ecoins for watering
    await User.findOneAndUpdate(
      { firebaseUid },
      { $inc: { ecoins: 5 } }
    )

    res.json({ garden, pointsEarned, ecoinsEarned: 5 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const cleanGarden = async (req, res) => {
  try {
    const { firebaseUid } = req.body
    const user = await User.findOne({ firebaseUid })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const garden = await Garden.findOne({ student: user._id })
    if (!garden) return res.status(404).json({ error: 'Garden not found' })

    garden.totalPoints += 15
    garden.health = Math.min(100, garden.health + 10)
    await garden.save()

    await User.findOneAndUpdate(
      { firebaseUid },
      { $inc: { ecoins: 8 } }
    )

    res.json({ garden, pointsEarned: 15, ecoinsEarned: 8 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getGarden, waterGarden, cleanGarden }