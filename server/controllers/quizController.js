const User = require('../models/User')

const questions = [
  {
    id: 1,
    question: 'Which gas is mainly responsible for the greenhouse effect?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correct: 1,
    category: 'Climate Change',
  },
  {
    id: 2,
    question: 'What percentage of Earth\'s surface is covered by water?',
    options: ['50%', '61%', '71%', '81%'],
    correct: 2,
    category: 'Water',
  },
  {
    id: 3,
    question: 'Which of these is a renewable energy source?',
    options: ['Coal', 'Natural Gas', 'Solar Power', 'Petroleum'],
    correct: 2,
    category: 'Energy',
  },
  {
    id: 4,
    question: 'What is the process by which plants make food using sunlight?',
    options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination'],
    correct: 1,
    category: 'Plants',
  },
  {
    id: 5,
    question: 'Which material takes the longest to decompose?',
    options: ['Paper', 'Food waste', 'Glass', 'Cotton'],
    correct: 2,
    category: 'Recycling',
  },
  {
    id: 6,
    question: 'What does the 3R principle stand for?',
    options: ['Read, Run, Rest', 'Reduce, Reuse, Recycle', 'Repair, Rebuild, Restore', 'None of the above'],
    correct: 1,
    category: 'Recycling',
  },
  {
    id: 7,
    question: 'Which animal is most affected by plastic pollution in oceans?',
    options: ['Lions', 'Sea Turtles', 'Elephants', 'Eagles'],
    correct: 1,
    category: 'Wildlife',
  },
  {
    id: 8,
    question: 'What is the main cause of deforestation?',
    options: ['Tourism', 'Agriculture and logging', 'Mining only', 'Natural disasters'],
    correct: 1,
    category: 'Forests',
  },
]

const getQuestions = (req, res) => {
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 5)
  const safe = shuffled.map(({ correct, ...q }) => q)
  res.json({ questions: safe, answers: shuffled.map(q => q.correct) })
}

const submitQuiz = async (req, res) => {
  try {
    const { firebaseUid, answers, questionIds } = req.body
    let score = 0
    answers.forEach((ans, i) => {
      const q = questions.find(q => q.id === questionIds[i])
      if (q && ans === q.correct) score++
    })
    const xpEarned = score * 20
    const ecoinsEarned = score * 10

    await User.findOneAndUpdate(
      { firebaseUid },
      { $inc: { xp: xpEarned, ecoins: ecoinsEarned } }
    )

    res.json({ score, total: answers.length, xpEarned, ecoinsEarned })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getQuestions, submitQuiz }