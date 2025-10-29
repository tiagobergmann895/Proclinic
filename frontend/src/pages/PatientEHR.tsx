import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  FileText, 
  Activity, 
  Pill, 
  AlertTriangle,
  Syringe,
  ClipboardList,
  Download,
  Plus,
  Filter,
  Clock,
  ArrowLeft
} from 'lucide-react'
import axios from 'axios'
import AllergyModal from '../components/AllergyModal'
import ehrService, { TimelineEvent } from '../services/ehrService'

// Re-export interface for backwards compatibility
export interface EHRTimelineEvent extends TimelineEvent {}

export default function PatientEHR() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [patient, setPatient] = useState<any>(null)
  const [allergies, setAllergies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    types: [] as string[],
    from: '',
    to: ''
  })

  const [showSoapEditor, setShowSoapEditor] = useState(false)
  const [showAllergyModal, setShowAllergyModal] = useState(false)
  const [soapData, setSoapData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  })

  useEffect(() => {
    if (patientId) {
      loadPatientData()
      loadTimeline()
      loadAllergies()
    }
  }, [patientId])

  // Recarregar timeline quando filtros mudarem
  useEffect(() => {
    if (patientId) {
      loadTimeline()
    }
  }, [filters])

  const loadPatientData = async () => {
    try {
      // Carregar do localStorage
      const savedPatients = localStorage.getItem('proclinic-patients')
      if (savedPatients) {
        const patients = JSON.parse(savedPatients)
        const foundPatient = patients.find((p: any) => p.id === patientId)
        if (foundPatient) {
          setPatient(foundPatient)
          return
        }
      }
      
      // Fallback para mock se não encontrar
      setPatient({
        id: patientId,
        name: 'Paciente não encontrado',
        birthDate: '',
        document: '',
        bloodType: ''
      })
    } catch (error) {
      console.error('Erro ao carregar paciente:', error)
    }
  }

  const loadTimeline = async () => {
    try {
      setLoading(true)
      
      // Tentar carregar da API
      if (patientId) {
        const response = await ehrService.getPatientTimeline(patientId, {
          types: filters.types.length > 0 ? filters.types : undefined,
          from: filters.from || undefined,
          to: filters.to || undefined
        })
        
        setTimeline(response.timeline)
      }
    } catch (error) {
      console.error('Erro ao carregar timeline:', error)
      
      // Fallback para mock data se API não disponível
      const mockTimeline: TimelineEvent[] = [
        {
          type: 'encounter',
          id: '1',
          date: '2024-01-20T10:00:00Z',
          title: 'Consulta - Cardiologia',
          practitioner: 'Dr. João Santos',
          status: 'FINISHED',
          data: {}
        },
        {
          type: 'clinical_note',
          id: '2',
          date: '2024-01-20T10:30:00Z',
          title: 'Evolução - SOAP',
          author: 'Dr. João Santos',
          status: 'FINAL',
          summary: 'S: Dor precordial | A: Angina estável',
          data: {}
        }
      ]
      setTimeline(mockTimeline)
    } finally {
      setLoading(false)
    }
  }

  const loadAllergies = async () => {
    try {
      // Tentar carregar da API
      if (patientId) {
        try {
          const allergiesData = await ehrService.getAllergies(patientId)
          // Se retornar array vazio, tentar localStorage como fallback
          if (Array.isArray(allergiesData) && allergiesData.length === 0) {
            const savedAllergies = localStorage.getItem(`proclinic-allergies-${patientId}`)
            if (savedAllergies) {
              const parsed = JSON.parse(savedAllergies)
              setAllergies(parsed.filter((a: any) => a.clinicalStatus === 'active'))
              return
            }
          }
          setAllergies(allergiesData.filter((a: any) => a.clinicalStatus === 'active'))
          return
        } catch (apiError) {
          console.error('API error, trying localStorage:', apiError)
        }
      }
      
      // Fallback para localStorage
      const savedAllergies = localStorage.getItem(`proclinic-allergies-${patientId}`)
      if (savedAllergies) {
        const allergiesData = JSON.parse(savedAllergies)
        setAllergies(allergiesData.filter((a: any) => a.clinicalStatus === 'active'))
      } else {
        setAllergies([])
      }
    } catch (error) {
      console.error('Erro ao carregar alergias:', error)
      setAllergies([])
    }
  }

  const handleSaveAllergy = async (allergyData: any) => {
    try {
      // Tentar salvar na API primeiro
      if (patientId) {
        try {
          const savedAllergy = await ehrService.createAllergy({
            ...allergyData,
            patientId
          })
          
          // Atualizar estado com a alergia salva
          setAllergies(prev => [savedAllergy, ...prev].filter((a: any) => a.clinicalStatus === 'active'))
          
          // Adicionar à timeline
          const allergyEvent: TimelineEvent = {
            type: 'allergy',
            id: savedAllergy.id,
            date: savedAllergy.recordedDate || new Date().toISOString(),
            title: `Alergia Registrada - ${savedAllergy.display}`,
            summary: `Categoria: ${savedAllergy.category}, Criticidade: ${savedAllergy.criticality}`,
            data: savedAllergy
          }
          
          setTimeline(prev => [allergyEvent, ...prev])
          
          alert('Alergia registrada com sucesso!')
          return
        } catch (apiError) {
          console.error('API error, falling back to localStorage:', apiError)
        }
      }
      
      // Fallback para localStorage se API não funcionar
      const savedAllergies = localStorage.getItem(`proclinic-allergies-${patientId}`)
      const currentAllergies = savedAllergies ? JSON.parse(savedAllergies) : []
      
      const updatedAllergies = [allergyData, ...currentAllergies]
      
      localStorage.setItem(`proclinic-allergies-${patientId}`, JSON.stringify(updatedAllergies))
      setAllergies(updatedAllergies.filter((a: any) => a.clinicalStatus === 'active'))
      
      const allergyEvent: TimelineEvent = {
        type: 'allergy',
        id: allergyData.id,
        date: allergyData.recordedDate || new Date().toISOString(),
        title: `Alergia Registrada - ${allergyData.display}`,
        summary: `Categoria: ${allergyData.category}, Criticidade: ${allergyData.criticality}`,
        data: allergyData
      }
      
      setTimeline(prev => [allergyEvent, ...prev])
      
      alert('Alergia registrada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar alergia:', error)
      throw error
    }
  }

  const handleRemoveAllergy = async (allergyId: string) => {
    if (!confirm('Tem certeza que deseja remover esta alergia? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const savedAllergies = localStorage.getItem(`proclinic-allergies-${patientId}`)
      if (savedAllergies) {
        const currentAllergies = JSON.parse(savedAllergies)
        
        // Marcar como inativa (não deletar - histórico)
        const updatedAllergies = currentAllergies.map((a: any) => 
          a.id === allergyId ? { ...a, clinicalStatus: 'inactive', resolvedDate: new Date().toISOString() } : a
        )
        
        localStorage.setItem(`proclinic-allergies-${patientId}`, JSON.stringify(updatedAllergies))
        
        // Atualizar estado (apenas ativas)
        setAllergies(updatedAllergies.filter((a: any) => a.clinicalStatus === 'active'))
        
        alert('Alergia removida com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao remover alergia:', error)
      alert('Erro ao remover alergia')
    }
  }

  const handleCreateSoapNote = async (shouldSign: boolean = false) => {
    if (!patientId) {
      alert('Erro: ID do paciente não encontrado')
      return
    }

    try {
      // Validar campos obrigatórios
      if (!soapData.subjective || !soapData.objective || !soapData.assessment || !soapData.plan) {
        alert('Por favor, preencha todos os campos da evolução SOAP')
        return
      }

      // Criar a nota SOAP
      const note = await ehrService.createSoapNote({
        patientId,
        subjective: soapData.subjective,
        objective: soapData.objective,
        assessment: soapData.assessment,
        plan: soapData.plan,
        title: 'Evolução SOAP'
      })

      // Se deve assinar, assinar a nota
      if (shouldSign && note.id) {
        await ehrService.signSoapNote(note.id)
      }

      // Limpar formulário
      setSoapData({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      })

      // Fechar modal
      setShowSoapEditor(false)

      // Recarregar timeline
      await loadTimeline()

      alert('Evolução criada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao criar evolução:', error)
      alert(error.message || 'Erro ao criar evolução')
    }
  }

  const handleExportFHIR = async () => {
    if (!patientId) {
      alert('Erro: ID do paciente não encontrado')
      return
    }

    try {
      const bundle = await ehrService.exportFHIR(patientId)
      
      // Download do JSON
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fileName = `prontuario_${patient?.name || 'paciente'}_${new Date().toISOString().split('T')[0]}.json`
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      alert('Prontuário exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar prontuário. Verifique se o backend está rodando.')
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'encounter': return <Calendar className="h-5 w-5" />
      case 'clinical_note': return <FileText className="h-5 w-5" />
      case 'observation': return <Activity className="h-5 w-5" />
      case 'prescription': return <Pill className="h-5 w-5" />
      case 'diagnostic_report': return <ClipboardList className="h-5 w-5" />
      case 'immunization': return <Syringe className="h-5 w-5" />
      case 'allergy': return <AlertTriangle className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'encounter': return 'bg-blue-100 text-blue-600'
      case 'clinical_note': return 'bg-purple-100 text-purple-600'
      case 'observation': return 'bg-green-100 text-green-600'
      case 'prescription': return 'bg-orange-100 text-orange-600'
      case 'diagnostic_report': return 'bg-indigo-100 text-indigo-600'
      case 'immunization': return 'bg-pink-100 text-pink-600'
      case 'allergy': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div>
      {/* Botão Voltar */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Pacientes
        </button>
      </div>

      {/* Header com Dados do Paciente */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{patient?.name}</h1>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">CPF:</span>
                <span className="ml-2 font-medium">{patient?.cpf}</span>
              </div>
              <div>
                <span className="text-gray-500">Data Nasc:</span>
                <span className="ml-2 font-medium">
                  {patient?.birthDate && new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Tipo Sanguíneo:</span>
                <span className="ml-2 font-medium">{patient?.bloodType || 'Não informado'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSoapEditor(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Evolução
            </button>
            <button
              onClick={handleExportFHIR}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar FHIR
            </button>
          </div>
        </div>

        {/* Seção de Alergias */}
        <div className="mt-4">
          {allergies.length > 0 ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-900 mb-2">⚠️ ALERGIAS REGISTRADAS</h3>
                    <div className="space-y-2">
                      {allergies.map(a => (
                        <div key={a.id} className="flex items-center justify-between bg-white rounded px-3 py-2">
                          <div className="flex-1">
                            <span className="font-medium text-red-900">
                              {a.display}
                            </span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                              a.criticality === 'HIGH' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {a.criticality === 'HIGH' ? 'CRÍTICA' : 'Baixa'}
                            </span>
                            {a.category && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({a.category})
                              </span>
                            )}
                            {a.reactions && (
                              <p className="text-xs text-gray-600 mt-1">
                                Reações: {a.reactions}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveAllergy(a.id)}
                            className="ml-4 text-red-600 hover:text-red-800 text-xs"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllergyModal(true)}
                  className="ml-4 flex-shrink-0 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Nenhuma alergia registrada</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Registre alergias e intolerâncias do paciente para segurança em prescrições
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllergyModal(true)}
                  className="flex-shrink-0 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Alergia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {['encounters', 'notes', 'observations', 'prescriptions'].map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  types: prev.types.includes(type) 
                    ? prev.types.filter(t => t !== type)
                    : [...prev.types, type]
                }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.types.includes(type)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Histórico Clínico</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {timeline.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleString('pt-BR')}
                          {event.author && ` • ${event.author}`}
                          {event.practitioner && ` • ${event.practitioner}`}
                        </p>
                        {event.summary && (
                          <p className="text-sm text-gray-700 mt-2">{event.summary}</p>
                        )}
                        {event.value && (
                          <p className="text-sm font-medium text-gray-900 mt-2">{event.value}</p>
                        )}
                      </div>
                      
                      {event.status && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {event.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal SOAP Editor */}
      {showSoapEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Nova Evolução SOAP</h2>
              <p className="text-sm text-gray-500 mt-1">Paciente: {patient?.name}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Subjective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjetivo (Queixa do Paciente)
                </label>
                <textarea
                  value={soapData.subjective}
                  onChange={(e) => setSoapData(prev => ({ ...prev, subjective: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Paciente relata..."
                />
              </div>

              {/* Objective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo (Exame Físico, Dados Objetivos)
                </label>
                <textarea
                  value={soapData.objective}
                  onChange={(e) => setSoapData(prev => ({ ...prev, objective: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="PA: 120/80 mmHg, FC: 72 bpm..."
                />
              </div>

              {/* Assessment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação (Diagnóstico, Impressão Clínica)
                </label>
                <textarea
                  value={soapData.assessment}
                  onChange={(e) => setSoapData(prev => ({ ...prev, assessment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Diagnóstico..."
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano (Conduta, Prescrições, Retorno)
                </label>
                <textarea
                  value={soapData.plan}
                  onChange={(e) => setSoapData(prev => ({ ...prev, plan: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1. Prescrever...\n2. Solicitar exames...\n3. Retorno em..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowSoapEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleCreateSoapNote(false)}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Salvar Rascunho
              </button>
              <button
                onClick={() => handleCreateSoapNote(true)}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Salvar e Assinar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alergia */}
      <AllergyModal
        isOpen={showAllergyModal}
        onClose={() => setShowAllergyModal(false)}
        onSave={handleSaveAllergy}
        patientId={patientId || ''}
        patientName={patient?.name || ''}
      />
    </div>
  )
}

