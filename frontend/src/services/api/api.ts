import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const expenseApi = {
  getAll: () => api.get('/expenses'),
  create: (data: Omit<Expense, 'id'>) => api.post('/expenses', data),
  update: (id: string, data: Partial<Expense>) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
}

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data: Omit<Category, 'id'>) => api.post('/categories', data),
  update: (id: string, data: Partial<Category>) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

export default api
