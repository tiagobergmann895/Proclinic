// Configuração do sistema offline
const OfflineConfig = {
  // Configurações do sistema
  system: {
    name: 'Proclinic',
    version: '1.0.0',
    mode: 'offline',
    description: 'Sistema de Gestão Clínica - Modo Offline'
  },

  // Configurações de dados
  data: {
    storagePrefix: 'proclinic-',
    storageSuffix: '-offline',
    autoSave: true,
    backupInterval: 300000, // 5 minutos
    maxBackups: 10
  },

  // Configurações de interface
  ui: {
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm'
  },

  // Configurações de clínica
  clinic: {
    name: 'Proclinic',
    address: 'Rua da Saúde, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 1234-5678',
    email: 'contato@proclinic.com',
    cnpj: '12.345.678/0001-90',
    cnes: '1234567'
  },

  // Configurações de backup
  backup: {
    enabled: true,
    interval: 300000, // 5 minutos
    maxBackups: 10,
    autoExport: false
  },

  // Configurações de notificações
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
    email: false
  },

  // Configurações de segurança
  security: {
    encryptData: false,
    passwordProtection: false,
    sessionTimeout: 3600000, // 1 hora
    maxLoginAttempts: 5
  },

  // Configurações de relatórios
  reports: {
    defaultFormat: 'json',
    includeCharts: true,
    autoGenerate: false,
    schedule: 'daily'
  },

  // Configurações de exportação
  export: {
    formats: ['json', 'csv', 'pdf'],
    defaultFormat: 'json',
    includeMetadata: true,
    compress: false
  },

  // Configurações de importação
  import: {
    formats: ['json', 'csv'],
    validateData: true,
    backupBeforeImport: true,
    mergeData: false
  },

  // Configurações de cache
  cache: {
    enabled: true,
    maxSize: 50, // MB
    ttl: 3600000, // 1 hora
    strategy: 'lru'
  },

  // Configurações de performance
  performance: {
    lazyLoading: true,
    virtualScrolling: true,
    debounceSearch: 300,
    maxResults: 1000
  },

  // Configurações de desenvolvimento
  development: {
    debug: false,
    logLevel: 'info',
    enableDevTools: false,
    mockData: true
  }
};

// Função para obter configuração
function getConfig(key) {
  return key ? OfflineConfig[key] : OfflineConfig;
}

// Função para definir configuração
function setConfig(key, value) {
  if (typeof key === 'object') {
    Object.assign(OfflineConfig, key);
  } else {
    OfflineConfig[key] = value;
  }
  saveConfig();
}

// Função para salvar configuração
function saveConfig() {
  localStorage.setItem('proclinic-config-offline', JSON.stringify(OfflineConfig));
}

// Função para carregar configuração
function loadConfig() {
  const saved = localStorage.getItem('proclinic-config-offline');
  if (saved) {
    try {
      const config = JSON.parse(saved);
      Object.assign(OfflineConfig, config);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  }
}

// Função para resetar configuração
function resetConfig() {
  localStorage.removeItem('proclinic-config-offline');
  location.reload();
}

// Função para exportar configuração
function exportConfig() {
  const blob = new Blob([JSON.stringify(OfflineConfig, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'proclinic-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Função para importar configuração
function importConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        Object.assign(OfflineConfig, config);
        saveConfig();
        resolve(config);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}

// Carregar configuração ao inicializar
loadConfig();

// Exportar para uso global
window.OfflineConfig = OfflineConfig;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.saveConfig = saveConfig;
window.loadConfig = loadConfig;
window.resetConfig = resetConfig;
window.exportConfig = exportConfig;
window.importConfig = importConfig;




