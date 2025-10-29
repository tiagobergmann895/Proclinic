import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Clock, User, Edit, Trash2, Play, CheckCircle, Eye } from 'lucide-react'
import ProcedureModal from '../components/ProcedureModal'
import ExecuteProcedureModal from '../components/ExecuteProcedureModal'
import ProcedureDetailsModal from '../components/ProcedureDetailsModal'

export default function Procedures() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedProcedure, setSelectedProcedure] = useState(null)
  const [procedures, setProcedures] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProcedures()
  }, [])

  const loadProcedures = () => {
    try {
      setIsLoading(true)
      const savedProcedures = localStorage.getItem('proclinic-procedures')
      if (savedProcedures) {
        const proceduresData = JSON.parse(savedProcedures)
        setProcedures(proceduresData)
      } else {
        const mockProcedures = [
          {
            id: '1',
            patientName: 'Maria Silva',
            professionalName: 'Dr. João Silva',
            procedureType: 'Consulta Médica',
            scheduledAt: '2024-01-20T09:00:00',
            status: 'SCHEDULED',
            room: 'Sala 1'
          },
          {
            id: '2',
            patientName: 'João Santos',
            professionalName: 'Dr. João Silva',
            procedureType: 'Cirurgia Simples',
            scheduledAt: '2024-01-20T14:00:00',
            status: 'DONE',
            room: 'Sala 2'
          }
        ]
        setProcedures(mockProcedures)
        localStorage.setItem('proclinic-procedures', JSON.stringify(mockProcedures))
      }
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProcedure = async (procedureData) => {
    try {
      const newProcedure = {
        id: Date.now().toString(),
        ...procedureData,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
      }
      
      setProcedures(prev => {
        const updatedProcedures = [newProcedure, ...prev]
        localStorage.setItem('proclinic-procedures', JSON.stringify(updatedProcedures))
        return updatedProcedures
      })
    } catch (error) {
      console.error('Erro ao salvar procedimento:', error)
      throw error
    }
  }

  const handleEditProcedure = (procedure) => {
    setSelectedProcedure(procedure)
    setIsModalOpen(true)
  }

  const handleDeleteProcedure = (procedure) => {
    if (confirm(`Tem certeza que deseja excluir o procedimento "${procedure.procedureType}"?`)) {
      setProcedures(prev => {
        const updatedProcedures = prev.filter(p => p.id !== procedure.id)
        localStorage.setItem('proclinic-procedures', JSON.stringify(updatedProcedures))
        return updatedProcedures
      })
    }
  }

  const handleExecuteProcedure = (procedure) => {
    setSelectedProcedure(procedure)
    setIsExecuteModalOpen(true)
  }

  const handleViewDetails = (procedure) => {
    setSelectedProcedure(procedure)
    setIsDetailsModalOpen(true)
  }

  const handleSaveExecution = async (executionData) => {
    try {
      // Atualizar o procedimento com os dados de execução
      const updatedProcedures = procedures.map(p => {
        if (p.id === executionData.procedureId) {
          return {
            ...p,
            status: 'DONE',
            executedAt: executionData.executedAt,
            chargedAmount: executionData.chargedAmount,
            laborCost: executionData.laborCost,
            materialsCost: executionData.materialsCost,
            additionalCosts: executionData.additionalCosts,
            additionalCostsTotal: executionData.additionalCostsTotal,
            totalCost: executionData.totalCost,
            profit: executionData.profit,
            margin: executionData.margin,
            notes: executionData.notes,
            consumedItems: executionData.consumedItems
          }
        }
        return p
      })
      
      setProcedures(updatedProcedures)
      localStorage.setItem('proclinic-procedures', JSON.stringify(updatedProcedures))

      // Atualizar o inventário (consumir materiais)
      const savedInventory = localStorage.getItem('proclinic-inventory')
      const inventory = savedInventory ? JSON.parse(savedInventory) : []

      executionData.consumedItems.forEach(consumedItem => {
        const inventoryIndex = inventory.findIndex(inv => inv.id === consumedItem.itemId)
        if (inventoryIndex >= 0) {
          // Reduzir quantidade no inventário
          inventory[inventoryIndex].quantity -= consumedItem.quantityConsumed
          
          // Atualizar status se necessário
          if (inventory[inventoryIndex].quantity < inventory[inventoryIndex].minStock) {
            inventory[inventoryIndex].status = 'LOW_STOCK'
          }

          // Remover do inventário se quantidade for zero
          if (inventory[inventoryIndex].quantity <= 0) {
            inventory.splice(inventoryIndex, 1)
          }
        }
      })

      localStorage.setItem('proclinic-inventory', JSON.stringify(inventory))

      // Atualizar itens
      const savedItems = localStorage.getItem('proclinic-items')
      const items = savedItems ? JSON.parse(savedItems) : []

      executionData.consumedItems.forEach(consumedItem => {
        const item = items.find(i => i.name === consumedItem.itemName)
        if (item) {
          item.stock = (item.stock || 0) - consumedItem.quantityConsumed
        }
      })

      localStorage.setItem('proclinic-items', JSON.stringify(items))

      alert('Procedimento executado com sucesso! Estoque atualizado.')
    } catch (error) {
      console.error('Erro ao executar procedimento:', error)
      throw error
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800'
      case 'DONE':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Agendado'
      case 'DONE':
        return 'Concluído'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procedimentos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os procedimentos e agendamentos
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedProcedure(null)
              setIsModalOpen(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Procedimento
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar procedimentos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Procedures List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Procedimentos</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {procedure.procedureType}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Paciente: {procedure.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Profissional: {procedure.professionalName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(procedure.scheduledAt).toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      {procedure.room}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(procedure.status)}`}>
                    {getStatusText(procedure.status)}
                  </span>
                  <div className="flex space-x-2 ml-4">
                    {procedure.status === 'SCHEDULED' && (
                      <button 
                        onClick={() => handleExecuteProcedure(procedure)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Executar procedimento"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {procedure.status === 'DONE' && (
                      <>
                        <button 
                          onClick={() => handleViewDetails(procedure)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <span className="text-green-600 p-1" title="Procedimento executado">
                          <CheckCircle className="h-4 w-4" />
                        </span>
                      </>
                    )}
                    <button 
                      onClick={() => handleEditProcedure(procedure)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Editar procedimento"
                      disabled={procedure.status === 'DONE'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProcedure(procedure)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Excluir procedimento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      <ProcedureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProcedure(null)
        }}
        onSave={handleSaveProcedure}
        procedure={selectedProcedure}
      />

      {/* Modal de Execução */}
      <ExecuteProcedureModal
        isOpen={isExecuteModalOpen}
        onClose={() => {
          setIsExecuteModalOpen(false)
          setSelectedProcedure(null)
        }}
        onSave={handleSaveExecution}
        procedure={selectedProcedure}
      />

      {/* Modal de Detalhes */}
      <ProcedureDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedProcedure(null)
        }}
        procedure={selectedProcedure}
      />
    </div>
  )
}
