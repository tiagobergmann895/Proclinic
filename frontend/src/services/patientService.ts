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

export interface Patient {
  id: string
  name: string
  birthDate?: string
  document?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: string
}

export interface CreatePatientRequest {
  name: string
  birthDate?: string
  document?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    const response = await api.get('/patients')
    return response.data
  },

  async createPatient(patient: CreatePatientRequest): Promise<Patient> {
    const response = await api.post('/patients', patient)
    return response.data
  },

  async updatePatient(id: string, patient: Partial<CreatePatientRequest>): Promise<Patient> {
    const response = await api.put(`/patients/${id}`, patient)
    return response.data
  },

  async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`)
  }
}

