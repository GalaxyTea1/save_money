import axios from 'axios'
import { Category, Expense } from '../../types/type'
import { useAuthStore } from '../../stores/authStore'
import { authService } from '../auth/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post<{ access_token: string }>('/auth/refresh')
        const { access_token } = response.data
        
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          access_token
        )

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        authService.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; fullName: string }) => 
    api.post('/auth/register', data),
}

export const expenseApi = {
  getAll: (startDate?: Date, endDate?: Date, categoryId?: string) => api.get('/expenses', { params: { startDate, endDate, categoryId } }),
  getAllByCategory: (categoryId: string, startDate?: Date, endDate?: Date, searchValue?: string) => api.get(`/expenses/get-by-category/${categoryId}`, { params: { startDate, endDate, searchValue } }),
  create: (data: Omit<Expense, 'id'>) => api.post('/expenses', data),
  update: (id: string, data: Partial<Expense>) => api.patch(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
}

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data: Omit<Category, 'id'>) => api.post('/categories', data),
  update: (id: string, data: Partial<Category>) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

export const statsApi = {
  getStatsMonthly: () => api.get('/stats/monthly-total'),
  getStatsMonthlyDetails: () => api.get('/stats/monthly-stats'),
  getStatsYearly: () => api.get('/stats//yearly-stats'),
  getStatsByCategory: (year: number, month: number) => 
    api.get(`/stats/category-stats`, { params: { year, month } })
}

export const chatApi = {
  getHistory: () => api.get('/chat/history'),
  create: (message: { role: 'user' | 'assistant'; content: string, user_id: string }) => 
    api.post('/chat', message),
}

export default api
