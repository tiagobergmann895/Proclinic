import { useState, useEffect } from 'react'
import { Plus, Search, ShoppingCart, Calendar, DollarSign, Package, Eye } from 'lucide-react'
import PurchaseModal from '../components/PurchaseModal'

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = () => {
    try {
      setIsLoading(true)
      const savedPurchases = localStorage.getItem('proclinic-purchases')
      if (savedPurchases) {
        const purchasesData = JSON.parse(savedPurchases)
        setPurchases(purchasesData)
      } else {
        setPurchases([])
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageCost = (currentStock: number, currentCost: number, newQuantity: number, newCost: number) => {
    const totalValue = (currentStock * currentCost) + (newQuantity * newCost)
    const totalQuantity = currentStock + newQuantity
    return totalQuantity > 0 ? totalValue / totalQuantity : 0
  }

  const handleSavePurchase = async (purchaseData) => {
    try {
      const newPurchase = {
        id: Date.now().toString(),
        ...purchaseData
      }

      // Salvar a compra
      const updatedPurchases = [newPurchase, ...purchases]
      setPurchases(updatedPurchases)
      localStorage.setItem('proclinic-purchases', JSON.stringify(updatedPurchases))

      // Atualizar inventário e itens com custo médio
      const savedInventory = localStorage.getItem('proclinic-inventory')
      const inventory = savedInventory ? JSON.parse(savedInventory) : []

      const savedItems = localStorage.getItem('proclinic-items')
      const items = savedItems ? JSON.parse(savedItems) : []

      purchaseData.items.forEach(purchaseItem => {
        // Encontrar o item no inventário
        const inventoryIndex = inventory.findIndex(inv => inv.itemName === purchaseItem.itemName)
        
        if (inventoryIndex >= 0) {
          // Item já existe no inventário - calcular custo médio
          const existingItem = inventory[inventoryIndex]
          const currentStock = existingItem.quantity
          const currentCost = existingItem.unitCost
          const newQuantity = purchaseItem.quantity
          const newCost = purchaseItem.unitCost

          // Calcular custo médio
          const averageCost = calculateAverageCost(currentStock, currentCost, newQuantity, newCost)

          // Atualizar quantidade e custo médio
          inventory[inventoryIndex].quantity += newQuantity
          inventory[inventoryIndex].unitCost = averageCost
          inventory[inventoryIndex].status = inventory[inventoryIndex].quantity < inventory[inventoryIndex].minStock ? 'LOW_STOCK' : 'OK'
        } else {
          // Item não existe - adicionar ao inventário
          const item = items.find(i => i.id === purchaseItem.itemId)
          if (item) {
            inventory.push({
              id: Date.now().toString() + Math.random(),
              itemId: purchaseItem.itemId,
              itemName: purchaseItem.itemName,
              batchCode: `LOTE-${Date.now()}`,
              quantity: purchaseItem.quantity,
              minStock: item.minStock || 10,
              expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 ano
              unitCost: purchaseItem.unitCost,
              status: purchaseItem.quantity < (item.minStock || 10) ? 'LOW_STOCK' : 'OK'
            })
          }
        }

        // Atualizar o estoque no item
        const itemIndex = items.findIndex(i => i.id === purchaseItem.itemId)
        if (itemIndex >= 0) {
          items[itemIndex].stock = (items[itemIndex].stock || 0) + purchaseItem.quantity
        }
      })

      // Salvar inventário e itens atualizados
      localStorage.setItem('proclinic-inventory', JSON.stringify(inventory))
      localStorage.setItem('proclinic-items', JSON.stringify(items))

      alert('Compra registrada com sucesso! O estoque foi atualizado com custo médio.')
    } catch (error) {
      console.error('Erro ao salvar compra:', error)
      throw error
    }
  }

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase)
    setShowDetails(true)
  }

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compras de Materiais</h1>
            <p className="mt-1 text-sm text-gray-500">
              Registre compras e atualize o estoque com custo médio
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Compra
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Compras
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {purchases.length}
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
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valor Total Investido
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    R$ {purchases.reduce((sum, p) => sum + p.totalAmount, 0).toFixed(2)}
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
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Itens Comprados
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {purchases.reduce((sum, p) => sum + p.items.length, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por fornecedor ou nota fiscal..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Purchases List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando compras...</p>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma compra registrada
          </h3>
          <p className="text-gray-500 mb-6">
            Comece registrando sua primeira compra de materiais
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Compra
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota Fiscal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd. Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {purchase.supplier}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.invoiceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      R$ {purchase.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewDetails(purchase)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Nova Compra */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePurchase}
      />

      {/* Modal de Detalhes */}
      {showDetails && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes da Compra
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="p-6">
              {/* Informações da Compra */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Fornecedor</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPurchase.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nota Fiscal</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPurchase.invoiceNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data da Compra</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedPurchase.purchaseDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="text-sm font-medium text-green-600">
                      R$ {selectedPurchase.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  {selectedPurchase.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPurchase.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Itens da Compra */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Itens</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantidade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Custo Unit.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPurchase.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.itemName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            R$ {item.unitCost.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            R$ {item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




