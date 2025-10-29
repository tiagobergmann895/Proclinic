import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: string
  permissions?: string[]
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

export const useLocalAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        console.log('🚀 LOGIN LOCAL STORE:', email, password)

        // LOGIN DIRETO - SEM QUALQUER TENTATIVA DE API
        if ((email === 'admin' && password === 'admin') ||
            (email === 'admin123' && password === 'admin123') ||
            (email === 'teste' && password === 'teste')) {
          
          console.log('✅ Login aprovado no store!')
          
          const user: User = {
            id: 'admin-local-id',
            name: 'Administrador Local',
            email: email,
            role: 'gestor',
            permissions: ['all']
          }
          
          const token = 'local-token-' + Date.now()
          
          set({
            isAuthenticated: true,
            user: user,
            token: token
          })
          
          // Inicializar dados mock
          initializeMockData()
          
          console.log('✅ Login realizado com sucesso no store!')
          return true
        }
        
        console.log('❌ Credenciais inválidas no store')
        return false
      },

      logout: () => {
        console.log('🚪 Logout realizado')
        set({
          isAuthenticated: false,
          user: null,
          token: null
        })
        localStorage.removeItem('proclinic-auth')
      },

      checkAuth: () => {
        const authData = localStorage.getItem('proclinic-auth')
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            if (parsed.isAuthenticated) {
              set({
                isAuthenticated: true,
              user: parsed.user,
                token: parsed.token
              })
            }
          } catch (e) {
            console.log('❌ Erro ao verificar auth:', e)
          }
        }
      }
    }),
    {
      name: 'proclinic-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      })
    }
  )
)

// Função para inicializar dados mock
function initializeMockData() {
  // Dados mock para pacientes
  if (!localStorage.getItem('proclinic-patients')) {
    const patients = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        birthDate: '1985-05-15',
        gender: 'M',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        birthDate: '1990-08-20',
        gender: 'F',
        address: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777',
        birthDate: '1978-12-10',
        gender: 'M',
        address: 'Rua Augusta, 789',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-100',
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('proclinic-patients', JSON.stringify(patients))
  }

  // Dados mock para itens
  if (!localStorage.getItem('proclinic-items')) {
    const items = [
      {
        id: '1',
        name: 'Seringa 5ml',
        description: 'Seringa descartável 5ml',
        category: 'Material Médico',
        unit: 'un',
        currentStock: 100,
        minStock: 20,
        maxStock: 200,
        costPrice: 2.50,
        salePrice: 5.00,
        supplier: 'Fornecedor A',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Algodão',
        description: 'Algodão hidrófilo',
        category: 'Material Médico',
        unit: 'kg',
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        costPrice: 15.00,
        salePrice: 30.00,
        supplier: 'Fornecedor B',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Gaze',
        description: 'Gaze estéril 10x10cm',
        category: 'Material Médico',
        unit: 'un',
        currentStock: 200,
        minStock: 50,
        maxStock: 500,
        costPrice: 0.50,
        salePrice: 1.00,
        supplier: 'Fornecedor C',
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('proclinic-items', JSON.stringify(items))
  }

  // Dados mock para procedimentos
  if (!localStorage.getItem('proclinic-procedures')) {
    const procedures = [
      {
        id: '1',
        patientId: '1',
        patientName: 'João Silva',
        type: 'Consulta',
        description: 'Consulta de rotina',
        status: 'completed',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        cost: 150.00,
        price: 200.00,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'Maria Santos',
        type: 'Exame',
        description: 'Exame de sangue',
        status: 'in_progress',
        startTime: new Date().toISOString(),
        cost: 80.00,
        price: 120.00,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'Pedro Costa',
        type: 'Procedimento',
        description: 'Curativo',
        status: 'scheduled',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        cost: 50.00,
        price: 80.00,
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem('proclinic-procedures', JSON.stringify(procedures))
  }

  console.log('✅ Dados mock inicializados no store!')
}
