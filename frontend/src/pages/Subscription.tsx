import { useState, useEffect } from 'react'
import { Check, X, CreditCard, AlertCircle } from 'lucide-react'
import axios from 'axios'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  popular?: boolean
  features: string[]
}

export default function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)

  useEffect(() => {
    loadPlans()
    loadSubscriptionStatus()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await axios.get('http://localhost:3000/subscriptions/plans')
      setPlans(response.data)
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
      setError('Não foi possível carregar os planos')
    } finally {
      setLoading(false)
    }
  }

  const loadSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get('http://localhost:3000/subscriptions/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubscriptionStatus(response.data)
    } catch (error) {
      console.error('Erro ao carregar status da assinatura:', error)
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId)
      setError(null)

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Você precisa estar logado para assinar')
        return
      }

      const response = await axios.post(
        'http://localhost:3000/subscriptions/create-checkout-session',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Redirecionar para o Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error: any) {
      console.error('Erro ao criar sessão de pagamento:', error)
      setError(error.response?.data?.message || 'Erro ao processar pagamento')
    } finally {
      setSubscribing(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:3000/subscriptions/cancel',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert('Assinatura cancelada com sucesso. Você continuará com acesso até o final do período pago.')
      loadSubscriptionStatus()
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      alert('Erro ao cancelar assinatura. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600">
            Selecione o plano ideal para sua clínica
          </p>
        </div>

        {/* Status da Assinatura Atual */}
        {subscriptionStatus?.active && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Assinatura Ativa
                </h3>
                <p className="text-green-700">
                  Plano: {subscriptionStatus.planId}
                </p>
                {subscriptionStatus.currentPeriodEnd && (
                  <p className="text-sm text-green-600">
                    Próxima cobrança: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
              >
                Cancelar Assinatura
              </button>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Mais Popular
                </div>
              )}

              <div className="p-8">
                {/* Nome do Plano */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </h3>

                {/* Preço */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id || subscriptionStatus?.active}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {subscribing === plan.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      {subscriptionStatus?.active ? 'Plano Atual' : 'Assinar Agora'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            ✓ Cancelamento a qualquer momento
          </p>
          <p className="mb-2">
            ✓ Pagamento 100% seguro com Stripe
          </p>
          <p>
            ✓ Suporte especializado em português
          </p>
        </div>

        {/* FAQ ou Informações */}
        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Como funciona o período de teste?
              </h3>
              <p className="text-gray-600">
                Todos os planos incluem 14 dias de teste gratuito. Você pode cancelar a qualquer momento durante este período sem ser cobrado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Posso mudar de plano depois?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor será ajustado proporcionalmente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quais formas de pagamento são aceitas?
              </h3>
              <p className="text-gray-600">
                Aceitamos todos os principais cartões de crédito (Visa, Mastercard, American Express, Elo) através do Stripe, processador de pagamentos mais seguro do mundo.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                O que acontece se eu cancelar?
              </h3>
              <p className="text-gray-600">
                Você continuará tendo acesso ao sistema até o final do período pago. Após isso, sua conta será desativada mas seus dados permanecerão seguros por 90 dias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




