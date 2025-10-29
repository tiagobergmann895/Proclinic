import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 segundos timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    try {
      const parsed = JSON.parse(token)
      if (parsed.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`
      }
    } catch (error) {
      console.error('Error parsing auth token:', error)
    }
  }
  return config
})

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(name: string, email: string, password: string, role: string): Promise<LoginResponse> {
    const response = await api.post('/auth/register', { name, email, password, role })
    return response.data
  }
}

