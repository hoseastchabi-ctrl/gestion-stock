import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stockme_token')
  config.headers = config.headers || {}
  config.headers['Accept'] = 'application/json'
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stockme_token')
      localStorage.removeItem('stockme_user_name')
      const isOnPublicPath = PUBLIC_PATHS.includes(window.location.pathname)
      if (!isOnPublicPath) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api