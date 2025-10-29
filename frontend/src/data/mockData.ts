// Dados mock para o sistema Proclinic
export const mockData = {
  // Usuários do sistema
  users: [
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@proclinic.com',
      role: 'gestor',
      permissions: ['all'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dr. João Silva',
      email: 'joao@proclinic.com',
      role: 'medico',
      permissions: ['patients', 'procedures', 'ehr'],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Enfermeira Maria',
      email: 'maria@proclinic.com',
      role: 'enfermeiro',
      permissions: ['patients', 'procedures'],
      createdAt: new Date().toISOString()
    }
  ],

  // Pacientes
  patients: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      birthDate: '1985-05-15',
      gender: 'M',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      emergencyContact: 'Maria Silva (11) 88888-8888',
      allergies: ['Penicilina', 'Dipirona'],
      medicalHistory: ['Hipertensão', 'Diabetes tipo 2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 88888-8888',
      birthDate: '1990-08-20',
      gender: 'F',
      address: 'Av. Paulista, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      emergencyContact: 'José Santos (11) 77777-7777',
      allergies: ['Iodo'],
      medicalHistory: ['Asma'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '(11) 77777-7777',
      birthDate: '1978-12-10',
      gender: 'M',
      address: 'Rua Augusta, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-100',
      cpf: '456.789.123-00',
      rg: '45.678.912-3',
      emergencyContact: 'Ana Costa (11) 66666-6666',
      allergies: [],
      medicalHistory: ['Hipertensão'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      phone: '(11) 66666-6666',
      birthDate: '1995-03-25',
      gender: 'F',
      address: 'Rua Consolação, 321',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01302-001',
      cpf: '789.123.456-00',
      rg: '78.912.345-6',
      emergencyContact: 'Carlos Oliveira (11) 55555-5555',
      allergies: ['Sulfa'],
      medicalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  // Itens de estoque
  items: [
    {
      id: '1',
      name: 'Seringa 5ml',
      description: 'Seringa descartável 5ml com agulha',
      category: 'Material Médico',
      unit: 'un',
      currentStock: 100,
      minStock: 20,
      maxStock: 200,
      costPrice: 2.50,
      salePrice: 5.00,
      supplier: 'Fornecedor A',
      barcode: '1234567890123',
      location: 'Estoque A',
      expiryDate: '2025-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Algodão',
      description: 'Algodão hidrófilo estéril',
      category: 'Material Médico',
      unit: 'kg',
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
      costPrice: 15.00,
      salePrice: 30.00,
      supplier: 'Fornecedor B',
      barcode: '1234567890124',
      location: 'Estoque B',
      expiryDate: '2025-06-30',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
      barcode: '1234567890125',
      location: 'Estoque A',
      expiryDate: '2025-09-30',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Luvas Cirúrgicas',
      description: 'Luvas cirúrgicas estéreis tamanho M',
      category: 'Material Médico',
      unit: 'par',
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      costPrice: 0.80,
      salePrice: 1.50,
      supplier: 'Fornecedor A',
      barcode: '1234567890126',
      location: 'Estoque C',
      expiryDate: '2025-08-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Máscara N95',
      description: 'Máscara de proteção N95',
      category: 'EPI',
      unit: 'un',
      currentStock: 300,
      minStock: 50,
      maxStock: 600,
      costPrice: 3.00,
      salePrice: 6.00,
      supplier: 'Fornecedor D',
      barcode: '1234567890127',
      location: 'Estoque B',
      expiryDate: '2025-10-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  // Procedimentos
  procedures: [
    {
      id: '1',
      patientId: '1',
      patientName: 'João Silva',
      type: 'Consulta',
      description: 'Consulta de rotina - cardiologia',
      status: 'completed',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      cost: 150.00,
      price: 200.00,
      doctor: 'Dr. João Silva',
      notes: 'Paciente com pressão arterial controlada. Manter medicação.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Maria Santos',
      type: 'Exame',
      description: 'Exame de sangue completo',
      status: 'in_progress',
      startTime: new Date().toISOString(),
      cost: 80.00,
      price: 120.00,
      doctor: 'Dr. João Silva',
      notes: 'Coleta realizada. Aguardando resultados do laboratório.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Pedro Costa',
      type: 'Procedimento',
      description: 'Curativo pós-cirúrgico',
      status: 'scheduled',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      cost: 50.00,
      price: 80.00,
      doctor: 'Enfermeira Maria',
      notes: 'Agendado para amanhã às 14h.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      patientId: '4',
      patientName: 'Ana Oliveira',
      type: 'Consulta',
      description: 'Consulta de rotina - ginecologia',
      status: 'scheduled',
      startTime: new Date(Date.now() + 172800000).toISOString(),
      cost: 120.00,
      price: 180.00,
      doctor: 'Dr. João Silva',
      notes: 'Primeira consulta. Verificar histórico médico.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  // Tipos de procedimentos
  procedureTypes: [
    {
      id: '1',
      name: 'Consulta',
      description: 'Consulta médica geral',
      baseCost: 100.00,
      basePrice: 150.00,
      duration: 30,
      category: 'Consulta'
    },
    {
      id: '2',
      name: 'Exame',
      description: 'Exame laboratorial',
      baseCost: 50.00,
      basePrice: 80.00,
      duration: 15,
      category: 'Exame'
    },
    {
      id: '3',
      name: 'Procedimento',
      description: 'Procedimento médico',
      baseCost: 80.00,
      basePrice: 120.00,
      duration: 45,
      category: 'Procedimento'
    },
    {
      id: '4',
      name: 'Cirurgia',
      description: 'Cirurgia ambulatorial',
      baseCost: 500.00,
      basePrice: 800.00,
      duration: 120,
      category: 'Cirurgia'
    }
  ],

  // Fornecedores
  suppliers: [
    {
      id: '1',
      name: 'Fornecedor A',
      contact: 'João Fornecedor',
      email: 'joao@fornecedora.com',
      phone: '(11) 11111-1111',
      address: 'Rua dos Fornecedores, 100',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      cnpj: '12.345.678/0001-90',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Fornecedor B',
      contact: 'Maria Fornecedora',
      email: 'maria@fornecedorb.com',
      phone: '(11) 22222-2222',
      address: 'Av. dos Fornecedores, 200',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02000-000',
      cnpj: '23.456.789/0001-01',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Fornecedor C',
      contact: 'Pedro Fornecedor',
      email: 'pedro@fornecedorc.com',
      phone: '(11) 33333-3333',
      address: 'Rua das Fornecedoras, 300',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03000-000',
      cnpj: '34.567.890/0001-12',
      createdAt: new Date().toISOString()
    }
  ],

  // Relatórios
  reports: {
    totalRevenue: 580.00,
    totalPatients: 4,
    totalProcedures: 4,
    totalItems: 5,
    averageProcedureValue: 145.00,
    monthlyRevenue: [
      { month: 'Jan', revenue: 1200.00 },
      { month: 'Fev', revenue: 1500.00 },
      { month: 'Mar', revenue: 1800.00 },
      { month: 'Abr', revenue: 2000.00 },
      { month: 'Mai', revenue: 2200.00 },
      { month: 'Jun', revenue: 2500.00 }
    ],
    topProcedures: [
      { name: 'Consulta', count: 2, revenue: 380.00 },
      { name: 'Exame', count: 1, revenue: 120.00 },
      { name: 'Procedimento', count: 1, revenue: 80.00 }
    ],
    inventoryValue: 1250.00,
    lowStockItems: [
      { name: 'Algodão', currentStock: 50, minStock: 10 },
      { name: 'Máscara N95', currentStock: 300, minStock: 50 }
    ]
  },

  // Configurações do sistema
  settings: {
    clinicName: 'Proclinic',
    clinicAddress: 'Rua da Saúde, 123',
    clinicCity: 'São Paulo',
    clinicState: 'SP',
    clinicZipCode: '01234-567',
    clinicPhone: '(11) 1234-5678',
    clinicEmail: 'contato@proclinic.com',
    clinicCnpj: '12.345.678/0001-90',
    clinicCnes: '1234567',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    language: 'pt-BR'
  }
}

// Função para inicializar dados mock no localStorage
export function initializeMockData() {
  console.log('🚀 Inicializando dados mock...')
  
  // Salvar cada categoria de dados
  Object.entries(mockData).forEach(([key, value]) => {
    const storageKey = `proclinic-${key}-local`
    localStorage.setItem(storageKey, JSON.stringify(value))
  })
  
  console.log('✅ Dados mock inicializados com sucesso!')
}

// Função para limpar dados mock
export function clearMockData() {
  console.log('🗑️ Limpando dados mock...')
  
  Object.keys(mockData).forEach(key => {
    const storageKey = `proclinic-${key}-local`
    localStorage.removeItem(storageKey)
  })
  
  console.log('✅ Dados mock limpos!')
}

// Função para obter dados mock
export function getMockData(key: string) {
  const storageKey = `proclinic-${key}-local`
  const data = localStorage.getItem(storageKey)
  return data ? JSON.parse(data) : null
}

// Função para salvar dados mock
export function saveMockData(key: string, data: any) {
  const storageKey = `proclinic-${key}-local`
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export default mockData




