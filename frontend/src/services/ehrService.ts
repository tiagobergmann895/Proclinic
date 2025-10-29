import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('proclinic-auth-local')
  if (authData) {
    try {
      const parsed = JSON.parse(authData)
      if (parsed?.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`
      }
    } catch (error) {
      console.error('Error parsing auth token:', error)
    }
  }
  
  // Fallback: tentar pegar token direto do localStorage
  const token = localStorage.getItem('token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export interface TimelineEvent {
  type: string
  id: string
  date: string
  title: string
  author?: string
  practitioner?: string
  prescriber?: string
  status?: string
  summary?: string
  value?: string
  category?: string
  data: any
}

export interface TimelineResponse {
  timeline: TimelineEvent[]
  total: number
  page: number
  pageSize: number
}

export interface CreateSoapNoteRequest {
  patientId: string
  encounterId?: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  title?: string
}

export interface AllergyData {
  id?: string
  patientId: string
  display: string
  category: 'FOOD' | 'MEDICATION' | 'ENVIRONMENT' | 'BIOLOGIC'
  criticality: 'LOW' | 'HIGH' | 'UNABLE_TO_ASSESS'
  reactions?: string
  recordedDate?: string
  clinicalStatus?: string
}

export interface VitalSign {
  code: string
  display: string
  value: number
  unit: string
}

export interface RecordVitalSignsRequest {
  patientId: string
  encounterId?: string
  vitalSigns: VitalSign[]
}

export const ehrService = {
  // ============================================================================
  // TIMELINE
  // ============================================================================
  
  async getPatientTimeline(
    patientId: string,
    options?: {
      from?: string
      to?: string
      types?: string[]
      page?: number
      pageSize?: number
    }
  ): Promise<TimelineResponse> {
    try {
      const params = new URLSearchParams()
      if (options?.from) params.append('from', options.from)
      if (options?.to) params.append('to', options.to)
      if (options?.types && options.types.length > 0) {
        options.types.forEach(type => params.append('types', type))
      }
      if (options?.page) params.append('page', options.page.toString())
      if (options?.pageSize) params.append('pageSize', options.pageSize.toString())
      
      const response = await api.get(
        `/ehr/patients/${patientId}/timeline?${params.toString()}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching timeline:', error)
      // Retornar timeline vazio em caso de erro
      return {
        timeline: [],
        total: 0,
        page: 1,
        pageSize: 50
      }
    }
  },

  // ============================================================================
  // SOAP NOTES
  // ============================================================================
  
  async createSoapNote(data: CreateSoapNoteRequest) {
    try {
      const response = await api.post('/ehr/notes/soap', data)
      return response.data
    } catch (error: any) {
      console.error('Error creating SOAP note:', error)
      throw new Error(error.response?.data?.message || 'Erro ao criar evolução SOAP')
    }
  },

  async signSoapNote(noteId: string) {
    try {
      const response = await api.post('/ehr/notes/sign', { noteId })
      return response.data
    } catch (error: any) {
      console.error('Error signing SOAP note:', error)
      throw new Error(error.response?.data?.message || 'Erro ao assinar evolução')
    }
  },

  // ============================================================================
  // ALLERGIES
  // ============================================================================
  
  async getAllergies(patientId: string) {
    try {
      const response = await api.get(`/ehr/patients/${patientId}/allergies`)
      return response.data
    } catch (error) {
      console.error('Error fetching allergies:', error)
      // Retornar array vazio em caso de erro
      return []
    }
  },

  async createAllergy(data: AllergyData) {
    try {
      const response = await api.post('/ehr/allergies', data)
      return response.data
    } catch (error: any) {
      console.error('Error creating allergy:', error)
      throw new Error(error.response?.data?.message || 'Erro ao registrar alergia')
    }
  },

  // ============================================================================
  // VITAL SIGNS
  // ============================================================================
  
  async recordVitalSigns(data: RecordVitalSignsRequest) {
    try {
      const response = await api.post('/ehr/observations/vital-signs', data)
      return response.data
    } catch (error: any) {
      console.error('Error recording vital signs:', error)
      throw new Error(error.response?.data?.message || 'Erro ao registrar sinais vitais')
    }
  },

  async getVitalSigns(patientId: string, code?: string, from?: string, to?: string) {
    try {
      const params = new URLSearchParams()
      if (code) params.append('code', code)
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      
      const response = await api.get(
        `/ehr/patients/${patientId}/vital-signs?${params.toString()}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching vital signs:', error)
      return []
    }
  },

  // ============================================================================
  // PRESCRIPTIONS
  // ============================================================================
  
  async createPrescription(data: {
    patientId: string
    encounterId?: string
    items: Array<{
      medication: string
      dosage: string
      duration: string
      notes?: string
    }>
    notes?: string
  }) {
    try {
      const response = await api.post('/ehr/prescriptions', data)
      return response.data
    } catch (error: any) {
      console.error('Error creating prescription:', error)
      throw new Error(error.response?.data?.message || 'Erro ao criar prescrição')
    }
  },

  async signPrescription(prescriptionId: string) {
    try {
      const response = await api.post(`/ehr/prescriptions/${prescriptionId}/sign`)
      return response.data
    } catch (error: any) {
      console.error('Error signing prescription:', error)
      throw new Error(error.response?.data?.message || 'Erro ao assinar prescrição')
    }
  },

  // ============================================================================
  // DOCUMENTS
  // ============================================================================
  
  async uploadDocument(
    file: File,
    metadata: {
      patientId: string
      encounterId?: string
      type: string
      title?: string
      description?: string
    }
  ) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('patientId', metadata.patientId)
      if (metadata.encounterId) formData.append('encounterId', metadata.encounterId)
      formData.append('type', metadata.type)
      if (metadata.title) formData.append('title', metadata.title)
      if (metadata.description) formData.append('description', metadata.description)
      
      const response = await api.post('/ehr/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      console.error('Error uploading document:', error)
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload do documento')
    }
  },

  async downloadDocument(documentId: string) {
    try {
      const response = await api.get(`/ehr/documents/${documentId}/download`)
      return response.data
    } catch (error: any) {
      console.error('Error downloading document:', error)
      throw new Error(error.response?.data?.message || 'Erro ao baixar documento')
    }
  },

  // ============================================================================
  // FHIR EXPORT
  // ============================================================================
  
  async exportFHIR(patientId: string) {
    try {
      const response = await api.get(`/ehr/patients/${patientId}/export/fhir`)
      return response.data
    } catch (error: any) {
      console.error('Error exporting FHIR:', error)
      throw new Error(error.response?.data?.message || 'Erro ao exportar prontuário')
    }
  },

  // ============================================================================
  // BREAK-THE-GLASS
  // ============================================================================
  
  async breakTheGlass(
    resourceType: string,
    resourceId: string,
    justification: string
  ) {
    try {
      const response = await api.post('/ehr/break-the-glass', {
        resourceType,
        resourceId,
        justification
      })
      return response.data
    } catch (error: any) {
      console.error('Error requesting break-the-glass access:', error)
      throw new Error(error.response?.data?.message || 'Erro ao solicitar acesso de emergência')
    }
  }
}

export default ehrService

