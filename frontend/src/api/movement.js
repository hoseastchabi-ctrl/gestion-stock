import api from './axios'

export async function createMovement(payload) {
  const { data } = await api.post('/movements', payload)
  return data
}

export async function getAllMovements() {
  const { data } = await api.get('/movements')
  return data
}

export async function getProductMovements(productId) {
  const { data } = await api.get(`/products/${productId}/movements`)
  return data
}