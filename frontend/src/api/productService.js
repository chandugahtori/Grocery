import api from './axiosInstance'

export const getProducts = (params) => api.get('/products', { params })
export const searchProducts = (params) => api.get('/products/search', { params })
export const getProduct = (id) => api.get(`/products/${id}`)
export const getCategories = () => api.get('/categories')

// Admin
export const adminGetProducts = (params) => api.get('/admin/products', { params })
export const createProduct = (data) => api.post('/admin/products', data)
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`)
