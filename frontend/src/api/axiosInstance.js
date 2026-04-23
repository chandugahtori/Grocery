import axios from 'axios'

// Environment variable se URL nikal rahe hain
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ⭐ SOLUTION: Agar URL ke end mein '/api' nahi hai, toh hum khud add kar denge
// Isse tumhara URL "https://navix-5pu6.onrender.com/api" ban jayega
const finalBaseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL: finalBaseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('navix_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Agar Backend 401 (Unauthorized) bhejta hai toh login par bhej do
    if (error.response?.status === 401) {
      localStorage.removeItem('navix_token')
      localStorage.removeItem('navix_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api