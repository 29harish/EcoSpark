import api from './api'

export const createUserInDB = async (firebaseUid, name, email, role) => {
  const response = await api.post('/api/auth/create', {
    firebaseUid,
    name,
    email,
    role,
  })
  return response.data
}

export const getUserFromDB = async (firebaseUid) => {
  const response = await api.get(`/api/auth/user/${firebaseUid}`)
  return response.data
}