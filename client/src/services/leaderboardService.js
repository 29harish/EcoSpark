import api from './api'

export const fetchLeaderboard = async () => {
  const response = await api.get('/api/leaderboard')
  return response.data
}