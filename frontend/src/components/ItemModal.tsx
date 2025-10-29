import { useState } from 'react'
import { X, Package } from 'lucide-react'

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: any) => void
  item?: any
}

export default function ItemModal({ isOpen, onClose, onSave, item }: ItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    sku: '',
    minStock: 0,
    isControlled: false
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Nome é obrigatório!')
      return
    }
    
    setIsLoading(true)
    
    try {
      await onSave(formData)
      setFormData({
        name: '',
        category: '',
        unit: '',
        sku: '',
        minStock: 0,
        isControlled: false
      })
      onClose()
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      alert('Erro ao salvar item. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {item ? 'Editar Item' : 'Novo Item'}
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
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Item *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Seringa 5ml"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Material Cirúrgico">Material Cirúrgico</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Equipamento">Equipamento</option>
                <option value="Consumível">Consumível</option>
              </select>
            </div>

            {/* Unidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade *
              </label>
              <select
                name="unit"
                required
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione a unidade</option>
                <option value="unidade">Unidade</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="mg">Miligrama (mg)</option>
                <option value="g">Grama (g)</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="L">Litro (L)</option>
                <option value="m">Metro (m)</option>
                <option value="cm">Centímetro (cm)</option>
              </select>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU/Código
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: SYR-5ML-001"
              />
            </div>

            {/* Estoque Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Mínimo
              </label>
              <input
                type="number"
                name="minStock"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>

            {/* Controlado */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isControlled"
                  checked={formData.isControlled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Item controlado (requer lote e validade)
                </span>
              </label>
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
              disabled={isLoading || !formData.name.trim() || !formData.unit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </span>
              ) : (
                item ? 'Salvar Alterações' : 'Salvar Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



