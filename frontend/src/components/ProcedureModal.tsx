import { useState, useEffect } from 'react'
import { X, Calendar, User, Clock } from 'lucide-react'

interface ProcedureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (procedure: any) => void
  procedure?: any
}

export default function ProcedureModal({ isOpen, onClose, onSave, procedure }: ProcedureModalProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    professionalUserId: '',
    procedureTypeId: '',
    scheduledAt: '',
    room: '',
    notes: ''
  })

  const [patients, setPatients] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [procedureTypes, setProcedureTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = () => {
    // Carregar pacientes
    const savedPatients = localStorage.getItem('proclinic-patients')
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    }

    // Carregar profissionais (mock)
    setProfessionals([
      { id: 'prof-1', name: 'Dr. João Silva' },
      { id: 'prof-2', name: 'Dra. Maria Santos' },
      { id: 'prof-3', name: 'Dr. Pedro Costa' }
    ])

    // Carregar tipos de procedimento (mock)
    setProcedureTypes([
      { id: 'type-1', name: 'Consulta Médica', duration: 30 },
      { id: 'type-2', name: 'Cirurgia Simples', duration: 60 },
      { id: 'type-3', name: 'Exame Laboratorial', duration: 15 },
      { id: 'type-4', name: 'Ultrassom', duration: 45 }
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patientId || !formData.professionalUserId || !formData.procedureTypeId || !formData.scheduledAt) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }
    
    setIsLoading(true)
    
    try {
      await onSave(formData)
      setFormData({
        patientId: '',
        professionalUserId: '',
        procedureTypeId: '',
        scheduledAt: '',
        room: '',
        notes: ''
      })
      onClose()
    } catch (error) {
      console.error('Erro ao salvar procedimento:', error)
      alert('Erro ao salvar procedimento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {procedure ? 'Editar Procedimento' : 'Novo Procedimento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paciente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente *
              </label>
              <select
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.document || 'Sem documento'}
                  </option>
                ))}
              </select>
            </div>

            {/* Profissional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profissional *
              </label>
              <select
                name="professionalUserId"
                required
                value={formData.professionalUserId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione um profissional</option>
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Procedimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Procedimento *
              </label>
              <select
                name="procedureTypeId"
                required
                value={formData.procedureTypeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione um tipo</option>
                {procedureTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.duration} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                required
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Sala */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Sala 1, Sala 2"
              />
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Observações sobre o procedimento..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.patientId || !formData.professionalUserId || !formData.procedureTypeId || !formData.scheduledAt}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </span>
              ) : (
                procedure ? 'Salvar Alterações' : 'Agendar Procedimento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



