import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import ItemModal from '../components/ItemModal'

export default function Items() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    try {
      setIsLoading(true)
      const savedItems = localStorage.getItem('proclinic-items')
      if (savedItems) {
        const itemsData = JSON.parse(savedItems)
        setItems(itemsData)
      } else {
        const mockItems = [
          {
            id: '1',
            name: 'Seringa 5ml',
            category: 'Material Cirúrgico',
            unit: 'unidade',
            sku: 'SYR-5ML-001',
            minStock: 10,
            isControlled: true,
            stock: 25
          },
          {
            id: '2',
            name: 'Gaze Estéril',
            category: 'Material Cirúrgico',
            unit: 'unidade',
            sku: 'GAZ-EST-001',
            minStock: 50,
            isControlled: true,
            stock: 75
          },
          {
            id: '3',
            name: 'Álcool 70%',
            category: 'Medicamento',
            unit: 'ml',
            sku: 'ALC-70-001',
            minStock: 100,
            isControlled: false,
            stock: 250
          }
        ]
        setItems(mockItems)
        localStorage.setItem('proclinic-items', JSON.stringify(mockItems))
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveItem = async (itemData) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
        stock: 0,
        createdAt: new Date().toISOString()
      }
      
      setItems(prev => {
        const updatedItems = [newItem, ...prev]
        localStorage.setItem('proclinic-items', JSON.stringify(updatedItems))
        return updatedItems
      })
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      throw error
    }
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = (item) => {
    if (confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
      setItems(prev => {
        const updatedItems = prev.filter(i => i.id !== item.id)
        localStorage.setItem('proclinic-items', JSON.stringify(updatedItems))
        return updatedItems
      })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Itens</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os itens e materiais da clínica
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedItem(null)
              setIsModalOpen(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar itens..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SKU:</span>
                <span className="font-medium">{item.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Unidade:</span>
                <span className="font-medium">{item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estoque:</span>
                <span className={`font-medium ${item.stock < item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                  {item.stock}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mínimo:</span>
                <span className="font-medium">{item.minStock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Controlado:</span>
                <span className={`font-medium ${item.isControlled ? 'text-green-600' : 'text-gray-600'}`}>
                  {item.isControlled ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={() => handleEditItem(item)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                title="Editar item"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDeleteItem(item)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Excluir item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
        }}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </div>
  )
}
