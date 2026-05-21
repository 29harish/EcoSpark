require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected! 🍃'))
  .catch(err => console.log('MongoDB error:', err))

// Require models before routes
require('./models/User')
require('./models/Mission')
require('./models/Badge')
require('./models/Garden')
require('./models/Ecoin')

// Then register routes
const authRoutes = require('./routes/authRoutes')
const quizRoutes = require('./routes/quizRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')
const missionRoutes = require('./routes/missionRoutes')
const gardenRoutes = require('./routes/gardenRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/missions', missionRoutes)
app.use('/api/garden', gardenRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'EcoSpark backend is running! 🌱' })
})

app.listen(8000, () => {
  console.log('Server running on port 8000')
})