import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface AllergyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (allergy: any) => void
  patientId: string
  patientName: string
}

export default function AllergyModal({ isOpen, onClose, onSave, patientId, patientName }: AllergyModalProps) {
  const [formData, setFormData] = useState({
    display: '',
    category: 'MEDICATION',
    criticality: 'LOW',
    reactions: '',
    notes: '',
    onsetDate: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.display.trim()) {
      alert('Informe a substância/alérgeno!')
      return
    }
    
    setIsLoading(true)
    
    try {
      const allergyData = {
        id: Date.now().toString(),
        patientId,
        ...formData,
        clinicalStatus: 'active',
        recordedDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      await onSave(allergyData)
      
      // Reset form
      setFormData({
        display: '',
        category: 'MEDICATION',
        criticality: 'LOW',
        reactions: '',
        notes: '',
        onsetDate: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Erro ao salvar alergia:', error)
      alert('Erro ao salvar alergia. Tente novamente.')
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Registrar Alergia
            </h2>
            <p className="text-sm text-gray-500 mt-1">Paciente: {patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Substância/Alérgeno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Substância/Alérgeno *
              </label>
              <input
                type="text"
                name="display"
                required
                value={formData.display}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Penicilina, Dipirona, Amendoim, Látex"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome da substância que causa alergia ou intolerância
              </p>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="MEDICATION">Medicamento</option>
                <option value="FOOD">Alimento</option>
                <option value="ENVIRONMENT">Ambiental (pólen, poeira, etc.)</option>
                <option value="BIOLOGIC">Biológico (veneno, látex, etc.)</option>
              </select>
            </div>

            {/* Criticidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Criticidade/Gravidade *
              </label>
              <select
                name="criticality"
                required
                value={formData.criticality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="LOW">Baixa - Reação leve (coceira, vermelhidão)</option>
                <option value="HIGH">Alta - Reação grave (anafilaxia, choque)</option>
                <option value="UNABLE_TO_ASSESS">Não avaliada</option>
              </select>
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Alergias de criticidade ALTA bloquearão prescrições automaticamente
              </p>
            </div>

            {/* Reações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reações/Manifestações
              </label>
              <textarea
                name="reactions"
                value={formData.reactions}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Urticária generalizada, prurido intenso, edema de face"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descreva os sintomas e reações apresentados
              </p>
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Primeira Reação
              </label>
              <input
                type="date"
                name="onsetDate"
                value={formData.onsetDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Observações Adicionais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Adicionais
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Confirmado por teste alérgico em 2020, evitar derivados"
              />
            </div>

            {/* Alerta de Segurança */}
            {formData.criticality === 'HIGH' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <strong>ATENÇÃO: Alergia de Alta Criticidade</strong>
                    <p className="mt-1">
                      Esta alergia será destacada em VERMELHO no prontuário e bloqueará
                      automaticamente prescrições que contenham esta substância.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
              disabled={isLoading || !formData.display.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Registrar Alergia
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




