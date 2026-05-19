require('dotenv').config()


const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')



const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected! 🍃'))
  .catch((err) => console.log('MongoDB error:', err))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EcoSpark backend is running! 🌱' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})