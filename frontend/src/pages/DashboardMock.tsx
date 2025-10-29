import { useState, useEffect } from 'react'
import { MockDataService } from '../services/mockDataService'

export default function DashboardMock() {
  const [stats, setStats] = useState<any>({})
  const [patients, setPatients] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [procedures, setProcedures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      // Carregar estatísticas
      const statsData = MockDataService.getStats()
      setStats(statsData)

      // Carregar dados
      const patientsData = MockDataService.getPatients()
      const itemsData = MockDataService.getItems()
      const proceduresData = MockDataService.getProcedures()

      setPatients(patientsData)
      setItems(itemsData)
      setProcedures(proceduresData)

      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('proclinic-auth-local')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Proclinic</h1>
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Modo Local
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, Administrador
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>✅ Sistema Proclinic Funcionando Perfeitamente!</strong>
            <p className="mt-2">Dados mock carregados com sucesso. Sistema funcionando 100% local.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pacientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalPatients || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Itens em Estoque
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalItems || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Procedimentos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalProcedures || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Receita Total
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        R$ {stats.totalRevenue?.toFixed(2) || '0,00'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pacientes */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  👥 Pacientes Recentes
                </h3>
                <div className="space-y-3">
                  {patients.slice(0, 3).map(patient => (
                    <div key={patient.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-600">{patient.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Itens */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  📦 Itens em Estoque
                </h3>
                <div className="space-y-3">
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Estoque: {item.currentStock} {item.unit}</p>
                      <p className="text-sm text-gray-600">Preço: R$ {item.salePrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Procedimentos */}
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  🏥 Procedimentos Recentes
                </h3>
                <div className="space-y-3">
                  {procedures.slice(0, 4).map(procedure => (
                    <div key={procedure.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{procedure.description}</h4>
                          <p className="text-sm text-gray-600">Paciente: {procedure.patientName}</p>
                          <p className="text-sm text-gray-600">Valor: R$ {procedure.price.toFixed(2)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          procedure.status === 'completed' ? 'bg-green-100 text-green-800' :
                          procedure.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {procedure.status === 'completed' ? 'Concluído' :
                           procedure.status === 'in_progress' ? 'Em Andamento' :
                           'Agendado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




