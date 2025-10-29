import { mockData, initializeMockData, getMockData, saveMockData } from '../data/mockData'

export class MockDataService {
  // Inicializar dados mock
  static initialize() {
    initializeMockData()
  }

  // Limpar dados mock
  static clear() {
    localStorage.clear()
    sessionStorage.clear()
  }

  // Obter dados de uma categoria
  static get(category: string) {
    return getMockData(category)
  }

  // Salvar dados de uma categoria
  static save(category: string, data: any) {
    saveMockData(category, data)
  }

  // Obter pacientes
  static getPatients() {
    return this.get('patients') || []
  }

  // Adicionar paciente
  static addPatient(patient: any) {
    const patients = this.getPatients()
    const newPatient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    patients.push(newPatient)
    this.save('patients', patients)
    return newPatient
  }

  // Atualizar paciente
  static updatePatient(id: string, updates: any) {
    const patients = this.getPatients()
    const index = patients.findIndex(p => p.id === id)
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates, updatedAt: new Date().toISOString() }
      this.save('patients', patients)
      return patients[index]
    }
    return null
  }

  // Deletar paciente
  static deletePatient(id: string) {
    const patients = this.getPatients()
    const filtered = patients.filter(p => p.id !== id)
    this.save('patients', filtered)
    return true
  }

  // Obter itens
  static getItems() {
    return this.get('items') || []
  }

  // Adicionar item
  static addItem(item: any) {
    const items = this.getItems()
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    items.push(newItem)
    this.save('items', items)
    return newItem
  }

  // Atualizar item
  static updateItem(id: string, updates: any) {
    const items = this.getItems()
    const index = items.findIndex(i => i.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
      this.save('items', items)
      return items[index]
    }
    return null
  }

  // Deletar item
  static deleteItem(id: string) {
    const items = this.getItems()
    const filtered = items.filter(i => i.id !== id)
    this.save('items', filtered)
    return true
  }

  // Obter procedimentos
  static getProcedures() {
    return this.get('procedures') || []
  }

  // Adicionar procedimento
  static addProcedure(procedure: any) {
    const procedures = this.getProcedures()
    const newProcedure = {
      ...procedure,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    procedures.push(newProcedure)
    this.save('procedures', procedures)
    return newProcedure
  }

  // Atualizar procedimento
  static updateProcedure(id: string, updates: any) {
    const procedures = this.getProcedures()
    const index = procedures.findIndex(p => p.id === id)
    if (index !== -1) {
      procedures[index] = { ...procedures[index], ...updates, updatedAt: new Date().toISOString() }
      this.save('procedures', procedures)
      return procedures[index]
    }
    return null
  }

  // Deletar procedimento
  static deleteProcedure(id: string) {
    const procedures = this.getProcedures()
    const filtered = procedures.filter(p => p.id !== id)
    this.save('procedures', filtered)
    return true
  }

  // Obter relatórios
  static getReports() {
    return this.get('reports') || {}
  }

  // Obter configurações
  static getSettings() {
    return this.get('settings') || {}
  }

  // Atualizar configurações
  static updateSettings(settings: any) {
    this.save('settings', settings)
    return settings
  }

  // Obter estatísticas
  static getStats() {
    const patients = this.getPatients()
    const items = this.getItems()
    const procedures = this.getProcedures()
    const reports = this.getReports()

    return {
      totalPatients: patients.length,
      totalItems: items.length,
      totalProcedures: procedures.length,
      totalRevenue: reports.totalRevenue || 0,
      averageProcedureValue: reports.averageProcedureValue || 0,
      inventoryValue: reports.inventoryValue || 0,
      lowStockItems: reports.lowStockItems || []
    }
  }

  // Buscar dados
  static search(query: string, category: string) {
    const data = this.get(category) || []
    if (!query) return data

    const searchTerm = query.toLowerCase()
    return data.filter((item: any) => {
      return Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm)
      )
    })
  }

  // Filtrar dados
  static filter(category: string, filters: any) {
    const data = this.get(category) || []
    
    return data.filter((item: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        return item[key] === value
      })
    })
  }

  // Ordenar dados
  static sort(category: string, field: string, direction: 'asc' | 'desc' = 'asc') {
    const data = this.get(category) || []
    
    return data.sort((a: any, b: any) => {
      const aValue = a[field]
      const bValue = b[field]
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // Paginar dados
  static paginate(category: string, page: number = 1, limit: number = 10) {
    const data = this.get(category) || []
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit)
    }
  }

  // Exportar dados
  static export(category: string) {
    const data = this.get(category) || []
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${category}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Importar dados
  static import(category: string, file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          this.save(category, data)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }
}

export default MockDataService




