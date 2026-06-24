import api from './axios'

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

export async function createProduct(formData) {
  const { data } = await api.post('/products', formData)
  return data
}

export async function updateProduct(id, formData) {
  formData.append('_method', 'PUT')
  const { data } = await api.post(`/products/${id}`, formData)
  return data
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`)
  return data
}