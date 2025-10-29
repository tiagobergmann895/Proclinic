import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export interface User {
  id: string
  name: string
  email: string
  role: 'recepcao' | 'profissional' | 'financeiro' | 'gestor'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, role: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Tentar login via API primeiro
          const response = await authService.login(email, password)
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true
          })
        } catch (error) {
          // Fallback para dados mockados se API não estiver disponível
          console.warn('API não disponível, usando dados mockados:', error)
          
          // Verificar credenciais mockadas
          if ((email === 'admin123' && password === 'admin123') || 
              (email === 'admin@proclinic.com' && password === 'admin123')) {
            const mockUser = {
              id: 'admin-mock-id',
              name: 'Administrador',
              email: 'admin@proclinic.com',
              role: 'gestor'
            }
            
            set({
              user: mockUser,
              token: 'mock-token-' + Date.now(),
              isAuthenticated: true
            })
          } else {
            // Verificar se é um usuário registrado no localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('proclinic-users') || '[]')
            const user = registeredUsers.find((u: any) => 
              (u.email === email || u.name === email) && u.password === password
            )
            
            if (user) {
              set({
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role
                },
                token: 'mock-token-' + Date.now(),
                isAuthenticated: true
              })
            } else {
              throw new Error('Credenciais inválidas')
            }
          }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      register: async (name: string, email: string, password: string, role: string) => {
        console.log('Registrando usuário:', name, email, role)
        
        // Salvar usuário no localStorage
        const newUser = {
          id: 'user-mock-id-' + Date.now(),
          name: name,
          email: email,
          password: password, // Em produção, isso seria hash
          role: role,
          createdAt: new Date().toISOString()
        }
        
        const existingUsers = JSON.parse(localStorage.getItem('proclinic-users') || '[]')
        existingUsers.push(newUser)
        localStorage.setItem('proclinic-users', JSON.stringify(existingUsers))
        
        console.log('Usuário registrado:', newUser)
        
        const mockUser = {
          id: newUser.id,
          name: name,
          email: email,
          role: role
        }
        
        set({
          user: mockUser,
          token: 'mock-token-' + Date.now(),
          isAuthenticated: true
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
