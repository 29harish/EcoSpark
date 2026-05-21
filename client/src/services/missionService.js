import api from './api'

export const fetchMissions = async () => {
  const response = await api.get('/api/missions')
  return response.data
}

export const submitMission = async (missionId, firebaseUid, description) => {
  const response = await api.post('/api/missions/submit', {
    missionId,
    firebaseUid,
    description,
  })
  return response.data
}