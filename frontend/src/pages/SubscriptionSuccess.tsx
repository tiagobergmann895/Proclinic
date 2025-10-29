import { useEffect } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SubscriptionSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Você pode fazer uma chamada para verificar o status da sessão
    console.log('Payment successful, session:', sessionId)
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pagamento Confirmado!
        </h1>

        <p className="text-gray-600 mb-8">
          Sua assinatura foi ativada com sucesso. Agora você tem acesso completo a todos os recursos do seu plano.
        </p>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-green-900 mb-2">
              Próximos Passos:
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Sua assinatura está ativa</li>
              <li>✓ Você receberá um email de confirmação</li>
              <li>✓ A fatura estará disponível na sua conta</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"
          >
            Ir para o Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>

          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200"
          >
            Ver Detalhes da Assinatura
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          ID da Sessão: {sessionId}
        </p>
      </div>
    </div>
  )
}




