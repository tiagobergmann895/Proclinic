import { useState, useEffect } from 'react'
import { X, Package, DollarSign, AlertTriangle, Plus, Trash2 } from 'lucide-react'

interface ExecuteProcedureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  procedure: any
}

interface ConsumedItem {
  itemId: string
  itemName: string
  quantityConsumed: number
  unitCost: number
  totalCost: number
  availableStock: number
}

interface AdditionalCost {
  id: string
  description: string
  amount: number
}

export default function ExecuteProcedureModal({ isOpen, onClose, onSave, procedure }: ExecuteProcedureModalProps) {
  const [formData, setFormData] = useState({
    chargedAmount: 0,
    laborCost: 0,
    notes: ''
  })

  const [consumedItems, setConsumedItems] = useState<ConsumedItem[]>([])
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([])
  const [availableItems, setAvailableItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantityToConsume, setQuantityToConsume] = useState(1)
  const [newCostDescription, setNewCostDescription] = useState('')
  const [newCostAmount, setNewCostAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && procedure) {
      loadAvailableItems()
      // Reset form
      setFormData({
        chargedAmount: 0,
        laborCost: 0,
        notes: ''
      })
      setConsumedItems([])
      setAdditionalCosts([])
      setSelectedItemId('')
      setQuantityToConsume(1)
      setNewCostDescription('')
      setNewCostAmount(0)
    }
  }, [isOpen, procedure])

  const loadAvailableItems = () => {
    try {
      const savedInventory = localStorage.getItem('proclinic-inventory')
      if (savedInventory) {
        const inventory = JSON.parse(savedInventory)
        // Apenas itens com estoque disponível
        const itemsWithStock = inventory.filter(item => item.quantity > 0)
        setAvailableItems(itemsWithStock)
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    }
  }

  const handleAddItem = () => {
    if (!selectedItemId || quantityToConsume <= 0) {
      alert('Selecione um item e quantidade válida!')
      return
    }

    const selectedItem = availableItems.find(item => item.id === selectedItemId)
    if (!selectedItem) return

    // Verificar estoque disponível (considerando itens já adicionados)
    const alreadyConsumed = consumedItems.find(item => item.itemId === selectedItemId)
    const totalConsumed = alreadyConsumed ? alreadyConsumed.quantityConsumed + quantityToConsume : quantityToConsume

    if (totalConsumed > selectedItem.quantity) {
      alert(`Estoque insuficiente! Disponível: ${selectedItem.quantity} unidades`)
      return
    }

    // Verificar se o item já foi adicionado
    const existingItemIndex = consumedItems.findIndex(item => item.itemId === selectedItemId)
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade
      const updatedItems = [...consumedItems]
      updatedItems[existingItemIndex].quantityConsumed += quantityToConsume
      updatedItems[existingItemIndex].totalCost = updatedItems[existingItemIndex].quantityConsumed * updatedItems[existingItemIndex].unitCost
      setConsumedItems(updatedItems)
    } else {
      // Adicionar novo item
      const newItem: ConsumedItem = {
        itemId: selectedItemId,
        itemName: selectedItem.itemName,
        quantityConsumed: quantityToConsume,
        unitCost: selectedItem.unitCost,
        totalCost: quantityToConsume * selectedItem.unitCost,
        availableStock: selectedItem.quantity
      }
      setConsumedItems([...consumedItems, newItem])
    }

    // Reset campos
    setSelectedItemId('')
    setQuantityToConsume(1)
  }

  const handleRemoveItem = (itemId: string) => {
    setConsumedItems(consumedItems.filter(item => item.itemId !== itemId))
  }

  const handleAddAdditionalCost = () => {
    if (!newCostDescription.trim() || newCostAmount <= 0) {
      alert('Preencha a descrição e o valor do custo adicional!')
      return
    }

    const newCost: AdditionalCost = {
      id: Date.now().toString(),
      description: newCostDescription,
      amount: newCostAmount
    }

    setAdditionalCosts([...additionalCosts, newCost])
    setNewCostDescription('')
    setNewCostAmount(0)
  }

  const handleRemoveAdditionalCost = (costId: string) => {
    setAdditionalCosts(additionalCosts.filter(cost => cost.id !== costId))
  }

  const calculateMaterialsCost = () => {
    return consumedItems.reduce((sum, item) => sum + item.totalCost, 0)
  }

  const calculateAdditionalCosts = () => {
    return additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)
  }

  const calculateTotalCost = () => {
    return calculateMaterialsCost() + formData.laborCost + calculateAdditionalCosts()
  }

  const calculateProfit = () => {
    return formData.chargedAmount - calculateTotalCost()
  }

  const calculateMargin = () => {
    if (formData.chargedAmount === 0) return 0
    return (calculateProfit() / formData.chargedAmount) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.chargedAmount <= 0) {
      alert('Informe o valor cobrado pelo procedimento!')
      return
    }

    if (consumedItems.length === 0) {
      const confirm = window.confirm('Nenhum material foi consumido. Deseja continuar?')
      if (!confirm) return
    }
    
    setIsLoading(true)
    
    try {
      const executionData = {
        procedureId: procedure.id,
        consumedItems: consumedItems,
        additionalCosts: additionalCosts,
        chargedAmount: formData.chargedAmount,
        laborCost: formData.laborCost,
        materialsCost: calculateMaterialsCost(),
        additionalCostsTotal: calculateAdditionalCosts(),
        totalCost: calculateTotalCost(),
        profit: calculateProfit(),
        margin: calculateMargin(),
        notes: formData.notes,
        executedAt: new Date().toISOString()
      }
      
      await onSave(executionData)
      onClose()
    } catch (error) {
      console.error('Erro ao executar procedimento:', error)
      alert('Erro ao executar procedimento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value)
    }))
  }

  if (!isOpen || !procedure) return null

  const profit = calculateProfit()
  const margin = calculateMargin()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Executar Procedimento
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {procedure.procedureType} - {procedure.patientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Informações do Procedimento */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Informações do Procedimento</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Paciente:</span>
                <span className="ml-2 font-medium">{procedure.patientName}</span>
              </div>
              <div>
                <span className="text-gray-500">Profissional:</span>
                <span className="ml-2 font-medium">{procedure.professionalName}</span>
              </div>
              <div>
                <span className="text-gray-500">Data:</span>
                <span className="ml-2 font-medium">
                  {new Date(procedure.scheduledAt).toLocaleString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Sala:</span>
                <span className="ml-2 font-medium">{procedure.room || 'Não especificada'}</span>
              </div>
            </div>
          </div>

          {/* Consumo de Materiais */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Materiais Consumidos</h3>
            
            {/* Adicionar Material */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione um material</option>
                    {availableItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.itemName} - Estoque: {item.quantity} - R$ {item.unitCost.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantityToConsume}
                      onChange={(e) => setQuantityToConsume(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Materiais */}
            {consumedItems.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Qtd.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Custo Unit.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumedItems.map((item) => (
                      <tr key={item.itemId}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.itemName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.quantityConsumed}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          R$ {item.unitCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          R$ {item.totalCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
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
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 border border-gray-200 rounded-lg">
                Nenhum material adicionado
              </div>
            )}
          </div>

          {/* Custos Adicionais */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Outros Custos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ex: Aluguel de sala, serviços terceirizados, exames externos, etc.
            </p>
            
            {/* Adicionar Custo */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição do Custo
                  </label>
                  <input
                    type="text"
                    value={newCostDescription}
                    onChange={(e) => setNewCostDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Aluguel de sala cirúrgica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newCostAmount}
                      onChange={(e) => setNewCostAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                    <button
                      type="button"
                      onClick={handleAddAdditionalCost}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Custos Adicionais */}
            {additionalCosts.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descrição
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {additionalCosts.map((cost) => (
                      <tr key={cost.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {cost.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          R$ {cost.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalCost(cost.id)}
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
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-900">
                        R$ {calculateAdditionalCosts().toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Valores e Custos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Valores e Custos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valor Cobrado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Cobrado do Paciente *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="chargedAmount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.chargedAmount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Custo de Mão de Obra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo de Mão de Obra
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="laborCost"
                    min="0"
                    step="0.01"
                    value={formData.laborCost}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Observações sobre a execução..."
                />
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Custo Materiais</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {calculateMaterialsCost().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Custo Mão de Obra</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {formData.laborCost.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Outros Custos</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {calculateAdditionalCosts().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Custo Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {calculateTotalCost().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Valor Cobrado</p>
                <p className="text-lg font-semibold text-indigo-600">
                  R$ {formData.chargedAmount.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Lucro</p>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {profit.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Margem de Lucro</p>
                <p className={`text-2xl font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {margin.toFixed(1)}%
                </p>
              </div>
            </div>

            {profit < 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm text-red-700">
                    <strong>Atenção!</strong> O procedimento está com margem negativa. 
                    O custo ({calculateTotalCost().toFixed(2)}) é maior que o valor cobrado ({formData.chargedAmount.toFixed(2)}).
                  </div>
                </div>
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
              disabled={isLoading || formData.chargedAmount <= 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Executando...
                </span>
              ) : (
                'Executar Procedimento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

