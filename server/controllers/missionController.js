const Mission = require('../models/Mission')
const User = require('../models/User')

const getMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ isActive: true })
    res.json({ missions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const submitMission = async (req, res) => {
  try {
    const { missionId, firebaseUid, description } = req.body

    const mission = await Mission.findById(missionId)
    if (!mission) return res.status(404).json({ error: 'Mission not found' })

    const user = await User.findOne({ firebaseUid })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const alreadySubmitted = mission.submissions.find(
      s => s.student.toString() === user._id.toString()
    )
    if (alreadySubmitted) {
      return res.status(400).json({ error: 'Already submitted this mission' })
    }

    mission.submissions.push({
      student: user._id,
      description,
      status: 'approved',
    })
    await mission.save()

    await User.findOneAndUpdate(
      { firebaseUid },
      {
        $inc: {
          xp: mission.xpReward,
          ecoins: mission.ecoinReward,
          treesPlanted: mission.category === 'planting' ? 1 : 0,
        },
        $push: { completedMissions: mission._id }
      }
    )

    res.json({
      message: 'Mission completed!',
      xpEarned: mission.xpReward,
      ecoinsEarned: mission.ecoinReward,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const seedMissions = async (req, res) => {
  try {
    await Mission.deleteMany({})
    await Mission.insertMany([
      { title: 'Use a Reusable Bottle', description: 'Use a reusable water bottle today instead of plastic.', category: 'recycling', difficulty: 'easy', xpReward: 30, ecoinReward: 20, proofType: 'self-report' },
      { title: 'Switch Off Lights', description: 'Turn off lights when not in use for an entire day.', category: 'energy', difficulty: 'easy', xpReward: 30, ecoinReward: 20, proofType: 'self-report' },
      { title: 'Plant a Tree', description: 'Plant a tree and help make our environment greener.', category: 'planting', difficulty: 'hard', xpReward: 100, ecoinReward: 80, proofType: 'photo' },
      { title: 'Segregate Waste', description: 'Separate dry and wet waste properly for one week.', category: 'recycling', difficulty: 'medium', xpReward: 60, ecoinReward: 40, proofType: 'self-report' },
      { title: 'Save Water Today', description: 'Take a short shower and save water for one day.', category: 'water', difficulty: 'easy', xpReward: 30, ecoinReward: 20, proofType: 'self-report' },
      { title: 'Recycle Paper Waste', description: 'Collect and recycle all paper waste from your home.', category: 'recycling', difficulty: 'easy', xpReward: 30, ecoinReward: 20, proofType: 'photo' },
      { title: 'Cycle to School', description: 'Cycle or walk to school instead of using a vehicle.', category: 'energy', difficulty: 'medium', xpReward: 60, ecoinReward: 40, proofType: 'self-report' },
      { title: 'Clean Your Surroundings', description: 'Clean your street or school surroundings for 30 minutes.', category: 'pollution', difficulty: 'medium', xpReward: 60, ecoinReward: 40, proofType: 'photo' },
      { title: 'Spread Eco Awareness', description: 'Teach 3 friends or family members about eco-friendly habits.', category: 'wildlife', difficulty: 'medium', xpReward: 60, ecoinReward: 40, proofType: 'self-report' },
      { title: 'Go Paperless for a Day', description: 'Avoid using paper for an entire day at school.', category: 'recycling', difficulty: 'easy', xpReward: 30, ecoinReward: 20, proofType: 'self-report' },
    ])
    res.json({ message: 'Missions seeded successfully!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getMissions, submitMission, seedMissions }