import { useState, useEffect } from 'react'
import { MockDataService } from '../services/mockDataService'

export default function LoginDefinitivo() {
  const [email, setEmail] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Verificar se já está logado
  useEffect(() => {
    const authData = localStorage.getItem('proclinic-auth-local')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        if (parsed.isAuthenticated) {
          console.log('✅ Usuário já logado, recarregando página...')
          window.location.reload()
        }
      } catch (e) {
        console.log('❌ Erro ao verificar auth:', e)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🚀 LOGIN DEFINITIVO:', email, password)

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300))

    // LOGIN DIRETO - SEM QUALQUER TENTATIVA DE API
    if ((email === 'admin' && password === 'admin') ||
        (email === 'admin123' && password === 'admin123') ||
        (email === 'teste' && password === 'teste')) {
      
      console.log('✅ Login aprovado!')
      
      // Criar dados do usuário
      const user = {
        id: 'admin-local-id',
        name: 'Administrador Local',
        email: email,
        role: 'gestor',
        permissions: ['all']
      }
      
      // Salvar no localStorage com chave específica
      const authData = {
        isAuthenticated: true,
        user: user,
        token: 'local-token-' + Date.now(),
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('proclinic-auth-local', JSON.stringify(authData))
      
      // Inicializar dados mock
      MockDataService.initialize()
      
      console.log('✅ Login realizado com sucesso!')
      setError('✅ Login realizado! Redirecionando...')
      
      // Recarregar página para entrar no estado autenticado
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return
    }
    
    // Se chegou até aqui, credenciais inválidas
    console.log('❌ Credenciais inválidas')
    setError('Login ou senha incorretos. Use: admin / admin')
    setLoading(false)
  }


  const resetarSistema = () => {
    localStorage.clear()
    sessionStorage.clear()
    console.log('🔄 Sistema resetado!')
    setError('Sistema resetado! Use: admin / admin')
    setEmail('admin')
    setPassword('admin')
  }

  const forcarLogin = () => {
    console.log('🚀 FORÇANDO LOGIN...')
    
    // LOGIN DIRETO - SEM API
    const user = {
      id: 'admin-local-id',
      name: 'Administrador Local',
      email: 'admin',
      role: 'gestor',
      permissions: ['all']
    }
    
    // Salvar no localStorage
    const authData = {
      isAuthenticated: true,
      user: user,
      token: 'local-token-' + Date.now(),
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem('proclinic-auth-local', JSON.stringify(authData))
    
    // Inicializar dados mock
    MockDataService.initialize()
    
    console.log('✅ Login forçado realizado!')
    setError('✅ Login realizado! Redirecionando...')
    
    // Recarregar página para entrar no estado autenticado
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Proclinic
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestão Clínica - Versão Local
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Login
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className={`text-sm text-center ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Credenciais disponíveis:
            </p>
            <p className="text-xs text-gray-500 mt-1">
              admin / admin (Administrador)
            </p>
            <p className="text-xs text-gray-500">
              admin123 / admin123 (Alternativo)
            </p>
            <p className="text-xs text-gray-500">
              teste / teste (Teste)
            </p>
            
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={resetarSistema}
                className="text-xs text-blue-600 hover:text-blue-500 underline block"
              >
                🔄 Resetar Sistema
              </button>
              
              <button
                type="button"
                onClick={forcarLogin}
                className="text-xs text-purple-600 hover:text-purple-500 underline block font-bold"
              >
                🚀 FORÇAR LOGIN DIRETO
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
