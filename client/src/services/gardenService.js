import api from './api'

export const fetchGarden = async (firebaseUid) => {
  const response = await api.get(`/api/garden/${firebaseUid}`)
  return response.data
}

export const waterGarden = async (firebaseUid) => {
  const response = await api.post('/api/garden/water', { firebaseUid })
  return response.data
}

export const cleanGarden = async (firebaseUid) => {
  const response = await api.post('/api/garden/clean', { firebaseUid })
  return response.data
}