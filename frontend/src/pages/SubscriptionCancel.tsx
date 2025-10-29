import { X, ArrowLeft, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SubscriptionCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <X className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pagamento Cancelado
        </h1>

        <p className="text-gray-600 mb-8">
          Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-yellow-900 mb-2">
            Tem alguma dúvida?
          </h3>
          <p className="text-sm text-yellow-700">
            Se você teve problemas durante o pagamento ou tem perguntas sobre os planos,
            nossa equipe de suporte está pronta para ajudar.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Tentar Novamente
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Dashboard
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Precisa de ajuda? Entre em contato: suporte@proclinic.com
        </p>
      </div>
    </div>
  )
}




