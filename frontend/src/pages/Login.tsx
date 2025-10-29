import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import RegisterModal from '../components/RegisterModal'

export default function Login() {
  const [email, setEmail] = useState('admin123')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const { login, register } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('🚀 LOGIN DIRETO - SEM API:', email, password)

    // LOGIN DIRETO - SEM TENTATIVA DE API
    if ((email === 'admin123' && password === 'admin123') || 
        (email === 'admin@test.com' && password === 'admin123') ||
        (email === 'admin@proclinic.com' && password === 'admin123')) {
      
      console.log('✅ Login direto aprovado!')
      
      // Simular login bem-sucedido
      const mockUser = {
        id: 'admin-mock-id',
        name: 'Administrador',
        email: email,
        role: 'gestor'
      }
      
      // Salvar no localStorage
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: mockUser,
          token: 'mock-token-' + Date.now(),
          isAuthenticated: true
        }
      }))
      
      console.log('✅ Login realizado com sucesso!')
      setIsLoading(false)
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard'
      return
    }
    
    // Verificar usuários registrados
    const registeredUsers = JSON.parse(localStorage.getItem('proclinic-users') || '[]')
    const user = registeredUsers.find((u: any) => 
      (u.email === email || u.name === email) && u.password === password
    )
    
    if (user) {
      console.log('✅ Login usuário registrado aprovado:', user)
      
      // Salvar no localStorage
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token: 'mock-token-' + Date.now(),
          isAuthenticated: true
        }
      }))
      
      console.log('✅ Login realizado com sucesso!')
      setIsLoading(false)
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard'
      return
    }
    
    // Se chegou até aqui, credenciais inválidas
    console.log('❌ Credenciais inválidas')
    setError('Login ou senha incorretos. Tente: admin123 / admin123')
    setIsLoading(false)
  }

  const handleRegister = async (userData: any) => {
    try {
      await register(userData.name, userData.email, userData.password, userData.role)
      setShowRegisterModal(false)
    } catch (err: any) {
      console.error('Erro no registro:', err)
      throw err
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Proclinic
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestão Clínica
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                maxLength={100}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Credenciais pré-preenchidas:
            </p>
            <p className="text-xs text-gray-500 mt-1">
              admin123 / admin123 (Administrador)
            </p>
            <p className="text-xs text-gray-500">
              Clique em "Entrar" para acessar o sistema
            </p>
            
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  console.log('Sistema resetado completamente!')
                  setError('Sistema resetado! Use: admin123 / admin123')
                  setEmail('admin123')
                  setPassword('admin123')
                }}
                className="text-xs text-blue-600 hover:text-blue-500 underline block"
              >
                🔄 Resetar Sistema
              </button>
              
              <button
                onClick={async () => {
                  console.log('Criando usuário admin...')
                  try {
                    await register('Admin', 'admin@test.com', 'admin123', 'gestor')
                    setError('Usuário admin criado! Faça login com: admin@test.com / admin123')
                  } catch (err) {
                    console.error('Erro ao criar usuário:', err)
                    setError('Erro ao criar usuário')
                  }
                }}
                className="text-xs text-green-600 hover:text-green-500 underline block"
              >
                Criar Usuário Admin
              </button>
              
              <button
                onClick={async () => {
                  console.log('🚀 FORÇANDO LOGIN DIRETO...')
                  
                  // LOGIN DIRETO - SEM API
                  const mockUser = {
                    id: 'admin-mock-id',
                    name: 'Administrador',
                    email: 'admin123',
                    role: 'gestor'
                  }
                  
                  // Salvar no localStorage
                  localStorage.setItem('auth-storage', JSON.stringify({
                    state: {
                      user: mockUser,
                      token: 'mock-token-' + Date.now(),
                      isAuthenticated: true
                    }
                  }))
                  
                  console.log('✅ Login forçado realizado!')
                  setError('✅ Login realizado! Redirecionando...')
                  
                  // Redirecionar para dashboard
                  setTimeout(() => {
                    window.location.href = '/dashboard'
                  }, 1000)
                }}
                className="text-xs text-purple-600 hover:text-purple-500 underline block font-bold"
              >
                🚀 FORÇAR LOGIN DIRETO
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={() => {
                console.log('Abrindo modal de registro...')
                setShowRegisterModal(true)
              }}
              className="text-blue-600 hover:text-blue-500 font-medium underline"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
    </div>
  )
}

