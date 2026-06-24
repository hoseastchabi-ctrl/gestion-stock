import api from './axios'

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password })
  if (data.access_token) {
    localStorage.setItem('stockme_token', data.access_token)
    localStorage.setItem('stockme_user_name', data.user?.name ?? '')
    localStorage.setItem('stockme_welcome_type', 'login')
  }
  return data
}

export async function register(payload) {
  const { data } = await api.post('/register', payload)
  if (data.access_token) {
    localStorage.setItem('stockme_token', data.access_token)
    localStorage.setItem('stockme_user_name', data.user?.name ?? payload.name ?? '')
    localStorage.setItem('stockme_welcome_type', 'register')
  }
  return data
}

export async function logout() {
  try {
    await api.post('/logout')
  } finally {
    localStorage.removeItem('stockme_token')
    localStorage.removeItem('stockme_user_name')
  }
}

export async function getUser() {
  const { data } = await api.get('/user')
  return data
}


export async function forgotPassword(email) {
  const { data } = await api.post('/forgot-password', { email })
  return data
}

export async function updateProfile(formData) {
  const { data } = await api.post('/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (formData.get('name')) {
    localStorage.setItem('stockme_user_name', formData.get('name'))
  }
  return data
}

export async function updatePassword(payload) {
  const { data } = await api.put('/user/password', payload)
  return data
}