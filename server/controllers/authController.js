const User = require('../models/User')

const createUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role } = req.body

    const existingUser = await User.findOne({ firebaseUid })
    if (existingUser) {
      return res.status(200).json({ user: existingUser })
    }

    const newUser = await User.create({
      firebaseUid,
      name,
      email,
      role: role || 'student',
    })

    const garden = await require('../models/Garden').create({
      student: newUser._id,
    })

    res.status(201).json({ user: newUser, garden })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createUser, getUser }