import axios from 'axios'

const api = axios.create({
  // ⭐ UPDATED LINE:
  // Vercel Dashboard mein tumhara naam 'VITE_API_BASE_URL' hai, isliye yahan bhi wahi hona chahiye.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptors (Request aur Response logic same rahega)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('navix_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('navix_token')
      localStorage.removeItem('navix_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api