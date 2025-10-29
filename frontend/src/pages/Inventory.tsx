import { useState, useEffect } from 'react'
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = () => {
    try {
      setIsLoading(true)
      const savedInventory = localStorage.getItem('proclinic-inventory')
      if (savedInventory) {
        const inventoryData = JSON.parse(savedInventory)
        setInventory(inventoryData)
      } else {
        const mockInventory = [
          {
            id: '1',
            itemName: 'Seringa 5ml',
            batchCode: 'LOTE001',
            quantity: 25,
            minStock: 10,
            expirationDate: '2024-12-31',
            unitCost: 2.50,
            status: 'OK'
          },
          {
            id: '2',
            itemName: 'Gaze Estéril',
            batchCode: 'LOTE002',
            quantity: 5,
            minStock: 50,
            expirationDate: '2024-06-30',
            unitCost: 1.20,
            status: 'LOW_STOCK'
          },
          {
            id: '3',
            itemName: 'Álcool 70%',
            batchCode: 'LOTE003',
            quantity: 250,
            minStock: 100,
            expirationDate: '2025-03-15',
            unitCost: 0.80,
            status: 'OK'
          }
        ]
        setInventory(mockInventory)
        localStorage.setItem('proclinic-inventory', JSON.stringify(mockInventory))
      }
    } catch (error) {
      console.error('Erro ao carregar inventário:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = (item) => {
    if (confirm(`Tem certeza que deseja excluir o item "${item.itemName}" do inventário?`)) {
      setInventory(prev => {
        const updatedInventory = prev.filter(i => i.id !== item.id)
        localStorage.setItem('proclinic-inventory', JSON.stringify(updatedInventory))
        return updatedInventory
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'text-green-600'
      case 'LOW_STOCK':
        return 'text-red-600'
      case 'EXPIRING':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <TrendingUp className="h-4 w-4" />
      case 'LOW_STOCK':
        return <AlertTriangle className="h-4 w-4" />
      case 'EXPIRING':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventário</h1>
            <p className="mt-1 text-sm text-gray-500">
              Controle de estoque e movimentações
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Entrada
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar no inventário..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.itemName}</h3>
                  <p className="text-sm text-gray-500">Lote: {item.batchCode}</p>
                </div>
              </div>
              <div className={`flex items-center ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantidade:</span>
                <span className={`font-medium ${item.quantity < item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                  {item.quantity}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estoque Mínimo:</span>
                <span className="font-medium">{item.minStock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Validade:</span>
                <span className="font-medium">{new Date(item.expirationDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Custo Unitário:</span>
                <span className="font-medium">R$ {item.unitCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valor Total:</span>
                <span className="font-medium">R$ {(item.quantity * item.unitCost).toFixed(2)}</span>
              </div>
            </div>

            {item.status === 'LOW_STOCK' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm text-red-700">
                    <strong>Estoque baixo!</strong> Quantidade abaixo do mínimo.
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={() => handleDeleteItem(item)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Excluir item do inventário"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
