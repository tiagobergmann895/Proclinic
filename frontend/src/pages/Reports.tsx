import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Calendar, RefreshCw } from 'lucide-react'

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [reports, setReports] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    patients: { current: 0, previous: 0, change: 0 },
    procedures: { current: 0, previous: 0, change: 0 },
    costs: { current: 0, previous: 0, change: 0 }
  })
  const [profitability, setProfitability] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [selectedPeriod])

  const loadReports = () => {
    try {
      setIsLoading(true)
      
      // Carregar dados dos pacientes
      const savedPatients = localStorage.getItem('proclinic-patients')
      const patients = savedPatients ? JSON.parse(savedPatients) : []
      
      // Carregar dados dos procedimentos
      const savedProcedures = localStorage.getItem('proclinic-procedures')
      const procedures = savedProcedures ? JSON.parse(savedProcedures) : []
      
      // Carregar dados do inventário
      const savedInventory = localStorage.getItem('proclinic-inventory')
      const inventory = savedInventory ? JSON.parse(savedInventory) : []
      
      // Calcular métricas
      const currentPatients = patients.length
      const currentProcedures = procedures.length
      const currentRevenue = procedures.length * 500 // Mock: R$ 500 por procedimento
      const currentCosts = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0)
      
      // Calcular mudanças (mock)
      const previousPatients = Math.max(0, currentPatients - Math.floor(Math.random() * 10))
      const previousProcedures = Math.max(0, currentProcedures - Math.floor(Math.random() * 5))
      const previousRevenue = Math.max(0, currentRevenue - Math.floor(Math.random() * 5000))
      const previousCosts = Math.max(0, currentCosts - Math.floor(Math.random() * 2000))
      
      setReports({
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          change: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
        },
        patients: {
          current: currentPatients,
          previous: previousPatients,
          change: previousPatients > 0 ? ((currentPatients - previousPatients) / previousPatients) * 100 : 0
        },
        procedures: {
          current: currentProcedures,
          previous: previousProcedures,
          change: previousProcedures > 0 ? ((currentProcedures - previousProcedures) / previousProcedures) * 100 : 0
        },
        costs: {
          current: currentCosts,
          previous: previousCosts,
          change: previousCosts > 0 ? ((currentCosts - previousCosts) / previousCosts) * 100 : 0
        }
      })
      
      // Calcular rentabilidade por procedimento
      const procedureTypes = ['Consulta Médica', 'Cirurgia Simples', 'Exame Laboratorial']
      const profitabilityData = procedureTypes.map(type => {
        const revenue = Math.floor(Math.random() * 20000) + 5000
        const cost = Math.floor(revenue * (0.3 + Math.random() * 0.4))
        const profit = revenue - cost
        const margin = (profit / revenue) * 100
        
        return { procedure: type, revenue, cost, profit, margin }
      })
      
      setProfitability(profitabilityData)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Análise de performance e relatórios financeiros
            </p>
          </div>
          <button 
            onClick={loadReports}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedPeriod === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receita
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      R$ {reports.revenue.current.toLocaleString('pt-BR')}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{reports.revenue.change}%
                    </div>
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
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pacientes
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {reports.patients.current}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{reports.patients.change}%
                    </div>
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
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Procedimentos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {reports.procedures.current}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{reports.procedures.change}%
                    </div>
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
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Custos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      R$ {reports.costs.current.toLocaleString('pt-BR')}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      +{reports.costs.change}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profitability by Procedure */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Rentabilidade por Procedimento
          </h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lucro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitability.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.procedure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.revenue.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.cost.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.profit.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.margin.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
