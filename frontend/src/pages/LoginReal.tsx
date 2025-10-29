import { useState } from 'react'

export default function LoginReal() {
  const [email, setEmail] = useState('admin123')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleLogin = () => {
    console.log('🚀 LOGIN REAL:', email, password)

    // LOGIN DIRETO - SEM QUALQUER TENTATIVA DE API
    if (email === 'admin123' && password === 'admin123') {
      console.log('✅ Login aprovado!')
      
      // Salvar no localStorage
      const user = {
        id: 'admin-mock-id',
        name: 'Administrador',
        email: 'admin123',
        role: 'gestor'
      }
      
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: user,
          token: 'mock-token-' + Date.now(),
          isAuthenticated: true
        }
      }))
      
      console.log('✅ Login realizado com sucesso!')
      setError('✅ Login realizado! Redirecionando...')
      
      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
      return
    }
    
    // Se chegou até aqui, credenciais inválidas
    console.log('❌ Credenciais inválidas')
    setError('Login ou senha incorretos. Use: admin123 / admin123')
  }

  const resetarSistema = () => {
    localStorage.clear()
    sessionStorage.clear()
    console.log('🔄 Sistema resetado!')
    setError('Sistema resetado! Use: admin123 / admin123')
    setEmail('admin123')
    setPassword('admin123')
  }

  const forcarLogin = () => {
    console.log('🚀 FORÇANDO LOGIN...')
    
    // LOGIN DIRETO - SEM API
    const user = {
      id: 'admin-mock-id',
      name: 'Administrador',
      email: 'admin123',
      role: 'gestor'
    }
    
    // Salvar no localStorage
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: user,
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Proclinic
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestão Clínica
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
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
            <div className={`text-sm text-center ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {error}
            </div>
          )}

          <div>
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
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
            
            <div className="mt-4 space-y-2">
              <button
                onClick={resetarSistema}
                className="text-xs text-blue-600 hover:text-blue-500 underline block"
              >
                🔄 Resetar Sistema
              </button>
              
              <button
                onClick={forcarLogin}
                className="text-xs text-purple-600 hover:text-purple-500 underline block font-bold"
              >
                🚀 FORÇAR LOGIN DIRETO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


