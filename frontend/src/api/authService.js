import api from './axiosInstance'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

export const getProfile = () => api.get('/users/profile')
export const updateProfile = (data) => api.put('/users/profile', data)
