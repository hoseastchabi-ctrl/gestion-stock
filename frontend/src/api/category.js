import api from './axios'

export async function getCategories() {
  const { data } = await api.get('/categories')
  return data
}

export async function createCategory(payload) {
  const { data } = await api.post('/categories', payload)
  return data
}