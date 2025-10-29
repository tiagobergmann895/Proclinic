import { X, Package, DollarSign, TrendingUp, Calendar, User } from 'lucide-react'

interface ProcedureDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  procedure: any
}

export default function ProcedureDetailsModal({ isOpen, onClose, procedure }: ProcedureDetailsModalProps) {
  if (!isOpen || !procedure) return null

  const hasExecution = procedure.status === 'DONE' && procedure.chargedAmount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detalhes do Procedimento
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {procedure.procedureType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Informações Gerais */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <User className="h-4 w-4 mr-2" />
                  Paciente
                </p>
                <p className="text-sm font-medium text-gray-900">{procedure.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <User className="h-4 w-4 mr-2" />
                  Profissional
                </p>
                <p className="text-sm font-medium text-gray-900">{procedure.professionalName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Agendada
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(procedure.scheduledAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sala</p>
                <p className="text-sm font-medium text-gray-900">{procedure.room || 'Não especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  procedure.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {procedure.status === 'DONE' ? 'Concluído' : 'Agendado'}
                </span>
              </div>
              {hasExecution && procedure.executedAt && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Data de Execução
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(procedure.executedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Informações Financeiras - Apenas se executado */}
          {hasExecution && (
            <>
              {/* Outros Custos */}
              {procedure.additionalCosts && procedure.additionalCosts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Outros Custos
                  </h3>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {procedure.additionalCosts.map((cost, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {cost.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              R$ {cost.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Total Outros Custos:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            R$ {procedure.additionalCostsTotal.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Materiais Consumidos */}
              {procedure.consumedItems && procedure.consumedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Materiais Consumidos
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Material
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
                        {procedure.consumedItems.map((item, index) => (
                          <tr key={index}>
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
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Total Materiais:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            R$ {procedure.materialsCost.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Resumo Financeiro */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Resumo Financeiro
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 mb-1">Custo Materiais</p>
                    <p className="text-xl font-bold text-blue-700">
                      R$ {(procedure.materialsCost || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-600 mb-1">Custo Mão de Obra</p>
                    <p className="text-xl font-bold text-purple-700">
                      R$ {(procedure.laborCost || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-600 mb-1">Outros Custos</p>
                    <p className="text-xl font-bold text-orange-700">
                      R$ {(procedure.additionalCostsTotal || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Custo Total</p>
                    <p className="text-xl font-bold text-gray-700">
                      R$ {(procedure.totalCost || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-600 mb-1">Valor Cobrado</p>
                    <p className="text-xl font-bold text-indigo-700">
                      R$ {(procedure.chargedAmount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className={`col-span-2 p-4 rounded-lg border ${
                    procedure.profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-xs mb-1 ${procedure.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Lucro
                    </p>
                    <p className={`text-3xl font-bold flex items-center ${
                      procedure.profit >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      <TrendingUp className="h-6 w-6 mr-2" />
                      R$ {(procedure.profit || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className={`col-span-2 p-4 rounded-lg border ${
                    procedure.margin >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-xs mb-1 ${procedure.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Margem de Lucro
                    </p>
                    <p className={`text-3xl font-bold ${
                      procedure.margin >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {(procedure.margin || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {procedure.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{procedure.notes}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Se não foi executado */}
          {!hasExecution && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Este procedimento ainda não foi executado.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

