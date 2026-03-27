import api from './axiosInstance'

export const placeOrder = (data) => api.post('/orders', data)
export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)

// Admin
export const adminGetOrders = (params) => api.get('/admin/orders', { params })
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status })
export const getAnalytics = () => api.get('/admin/analytics')
export const getAdminUsers = (params) => api.get('/admin/users', { params })
