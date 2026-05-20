require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const quizRoutes = require('./routes/quizRoutes')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/quiz', quizRoutes)

require('./models/User')
require('./models/Mission')
require('./models/Badge')
require('./models/Garden')
require('./models/Ecoin')

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected! 🍃'))
  .catch(err => console.log('MongoDB error:', err))

app.get('/', (req, res) => {
  res.json({ message: 'EcoSpark backend is running! 🌱' })
})

app.listen(8000, () => {
  console.log('Server running on port 8000')
})