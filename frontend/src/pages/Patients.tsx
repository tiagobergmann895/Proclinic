import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PatientModal from '../components/PatientModal'
import EditPatientModal from '../components/EditPatientModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { patientService, Patient } from '../services/patientService'

export default function Patients() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setIsLoading(true)
      
      // Primeiro, tenta carregar do localStorage
      const savedPatients = localStorage.getItem('proclinic-patients')
      if (savedPatients) {
        const patientsData = JSON.parse(savedPatients)
        setPatients(patientsData)
        console.log('Pacientes carregados do localStorage:', patientsData.length)
      } else {
        // Se não há dados salvos, usa dados mock
        const mockPatients = [
          {
            id: '1',
            name: 'Maria Silva',
            document: '123.456.789-00',
            phone: '(11) 99999-9999',
            email: 'maria@email.com',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'João Santos',
            document: '987.654.321-00',
            phone: '(11) 88888-8888',
            email: 'joao@email.com',
            createdAt: '2024-01-10'
          }
        ]
        setPatients(mockPatients)
        // Salva os dados mock no localStorage
        localStorage.setItem('proclinic-patients', JSON.stringify(mockPatients))
        console.log('Dados mock salvos no localStorage')
      }
      
      // Tenta carregar da API (opcional)
      try {
        const data = await patientService.getPatients()
        if (data && data.length > 0) {
          setPatients(data)
          localStorage.setItem('proclinic-patients', JSON.stringify(data))
          console.log('Pacientes carregados da API e salvos no localStorage')
        }
      } catch (apiError) {
        console.log('API não disponível, usando dados locais')
      }
      
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePatient = async (patientData: any) => {
    try {
      console.log('Tentando salvar paciente:', patientData)
      
      const newPatient = {
        id: Date.now().toString(),
        ...patientData,
        createdAt: new Date().toISOString()
      }
      
      // Adicionar à lista local
      setPatients(prev => {
        const updatedPatients = [newPatient, ...prev]
        // Salvar no localStorage
        localStorage.setItem('proclinic-patients', JSON.stringify(updatedPatients))
        console.log('Paciente salvo no localStorage')
        return updatedPatients
      })
      
      console.log('Paciente salvo com sucesso!')
      
      // Se a API estiver funcionando:
      // await patientService.createPatient(patientData)
      
    } catch (error) {
      console.error('Erro ao salvar paciente:', error)
      throw error
    }
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const handleUpdatePatient = async (id: string, patientData: any) => {
    try {
      console.log('Atualizando paciente:', id, patientData)
      
      // Atualizar na lista local
      setPatients(prev => {
        const updatedPatients = prev.map(p => 
          p.id === id ? { ...p, ...patientData } : p
        )
        // Salvar no localStorage
        localStorage.setItem('proclinic-patients', JSON.stringify(updatedPatients))
        console.log('Paciente atualizado no localStorage')
        return updatedPatients
      })
      
      console.log('Paciente atualizado com sucesso!')
      
      // Se a API estiver funcionando:
      // await patientService.updatePatient(id, patientData)
      
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error)
      throw error
    }
  }

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPatient) return
    
    try {
      console.log('Excluindo paciente:', selectedPatient.id)
      
      // Remover da lista local
      setPatients(prev => {
        const updatedPatients = prev.filter(p => p.id !== selectedPatient.id)
        // Salvar no localStorage
        localStorage.setItem('proclinic-patients', JSON.stringify(updatedPatients))
        console.log('Paciente excluído do localStorage')
        return updatedPatients
      })
      
      console.log('Paciente excluído com sucesso!')
      
      // Se a API estiver funcionando:
      // await patientService.deletePatient(selectedPatient.id)
      
      setIsDeleteModalOpen(false)
      setSelectedPatient(null)
      
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      alert('Erro ao excluir paciente. Tente novamente.')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os pacientes da clínica
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando pacientes...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastrado em
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {patient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.document}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/patients/${patient.id}/ehr`)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Ver prontuário"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditPatient(patient)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Editar paciente"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePatient(patient)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Excluir paciente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Modais */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
      />
      
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPatient(null)
        }}
        onSave={handleUpdatePatient}
        patient={selectedPatient}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedPatient(null)
        }}
        onConfirm={handleConfirmDelete}
        patientName={selectedPatient?.name || ''}
      />
    </div>
  )
}
