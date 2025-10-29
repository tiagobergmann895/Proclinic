import { useState, useEffect } from 'react'
import { X, ShoppingCart, Plus, Trash2 } from 'lucide-react'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (purchase: any) => void
}

interface PurchaseItem {
  itemId: string
  itemName: string
  quantity: number
  unitCost: number
  total: number
}

export default function PurchaseModal({ isOpen, onClose, onSave }: PurchaseModalProps) {
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [items, setItems] = useState<PurchaseItem[]>([])
  const [availableItems, setAvailableItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unitCost, setUnitCost] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadAvailableItems()
      // Reset form
      setFormData({
        supplier: '',
        invoiceNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: ''
      })
      setItems([])
      setSelectedItemId('')
      setQuantity(1)
      setUnitCost(0)
    }
  }, [isOpen])

  const loadAvailableItems = () => {
    try {
      const savedItems = localStorage.getItem('proclinic-items')
      if (savedItems) {
        setAvailableItems(JSON.parse(savedItems))
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    }
  }

  const handleAddItem = () => {
    if (!selectedItemId || quantity <= 0 || unitCost <= 0) {
      alert('Preencha todos os campos do item!')
      return
    }

    const selectedItem = availableItems.find(item => item.id === selectedItemId)
    if (!selectedItem) return

    // Verificar se o item já foi adicionado
    const existingItemIndex = items.findIndex(item => item.itemId === selectedItemId)
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade e recalcular total
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitCost
      setItems(updatedItems)
    } else {
      // Adicionar novo item
      const newItem: PurchaseItem = {
        itemId: selectedItemId,
        itemName: selectedItem.name,
        quantity: quantity,
        unitCost: unitCost,
        total: quantity * unitCost
      }
      setItems([...items, newItem])
    }

    // Reset campos
    setSelectedItemId('')
    setQuantity(1)
    setUnitCost(0)
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.itemId !== itemId))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.supplier || !formData.purchaseDate || items.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um item!')
      return
    }
    
    setIsLoading(true)
    
    try {
      const purchaseData = {
        ...formData,
        items: items,
        totalAmount: calculateTotal(),
        createdAt: new Date().toISOString()
      }
      
      await onSave(purchaseData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar compra:', error)
      alert('Erro ao salvar compra. Tente novamente.')
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Nova Compra de Material
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Informações da Compra */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fornecedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor *
                </label>
                <input
                  type="text"
                  name="supplier"
                  required
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nome do fornecedor"
                />
              </div>

              {/* Número da Nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº da Nota Fiscal
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: NF-12345"
                />
              </div>

              {/* Data da Compra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Compra *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  required
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Observações */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Observações sobre a compra..."
                />
              </div>
            </div>
          </div>

          {/* Adicionar Itens */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Itens da Compra</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Selecionar Item */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione um item</option>
                    {availableItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.sku || 'Sem SKU'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                {/* Custo Unitário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo Unitário (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Item
                </button>
              </div>
            </div>

            {/* Lista de Itens Adicionados */}
            {items.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo Unit.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.itemId}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.itemName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          R$ {item.unitCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          R$ {item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.itemId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Total da Compra:
                      </td>
                      <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-900">
                        R$ {calculateTotal().toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum item adicionado. Adicione itens à compra acima.
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </span>
              ) : (
                'Finalizar Compra'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




