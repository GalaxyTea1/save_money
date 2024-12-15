import { AxiosError } from 'axios'
import api from "../api/api";
import { useAuthStore } from '../../stores/authStore'

interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
  };
  
  timestamp: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string
  password: string
  fullName: string
}

export const authService = {
  login: async (data: LoginData) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data)
      const loginData = response.data.data
      const accessToken = loginData.access_token
      const userData = loginData.user
      
      useAuthStore.getState().setAuth(userData, accessToken)
      
      return loginData
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Login failed')
      }
      throw error
    }
  },

  logout: () => {
    useAuthStore.getState().logout()
  },

  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Register failed')
      }
      throw error
    }
  },
}