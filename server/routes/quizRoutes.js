const express = require('express')
const router = express.Router()
const { getQuestions, submitQuiz } = require('../controllers/quizController')

router.get('/questions', getQuestions)
router.post('/submit', submitQuiz)

module.exports = router