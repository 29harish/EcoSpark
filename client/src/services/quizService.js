import api from './api'

export const fetchQuestions = async () => {
  const response = await api.get('/api/quiz/questions')
  return response.data
}

export const submitQuizAnswers = async (firebaseUid, answers, questionIds) => {
  const response = await api.post('/api/quiz/submit', {
    firebaseUid,
    answers,
    questionIds,
  })
  return response.data
}