const User = require('../models/User')

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .sort({ xp: -1 })
      .limit(20)
      .select('name xp level ecoins streak treesPlanted school firebaseUid')

    res.json({ leaderboard: users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getLeaderboard }