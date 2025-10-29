const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Dados mock para teste
const users = [
  { id: '1', name: 'Administrador', email: 'admin@proclinic.com', role: 'gestor', password: 'admin123' },
  { id: '2', name: 'Recepcionista', email: 'recepcao@proclinic.com', role: 'recepcao', password: 'admin123' },
  { id: '3', name: 'Dr. João Silva', email: 'joao@proclinic.com', role: 'profissional', password: 'admin123' },
  { id: '4', name: 'Financeiro', email: 'financeiro@proclinic.com', role: 'financeiro', password: 'admin123' }
];

// Login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      accessToken: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Register
app.post('/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    role,
    password
  };
  
  users.push(newUser);
  
  res.json({
    accessToken: 'fake-jwt-token',
    refreshToken: 'fake-refresh-token',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Mock endpoints
app.get('/patients', (req, res) => {
  res.json([
    { id: '1', name: 'Maria Silva', document: '123.456.789-00', phone: '(11) 99999-9999', email: 'maria@email.com' },
    { id: '2', name: 'João Santos', document: '987.654.321-00', phone: '(11) 88888-8888', email: 'joao@email.com' }
  ]);
});

app.get('/items', (req, res) => {
  res.json([
    { id: '1', name: 'Seringa 5ml', category: 'Material Cirúrgico', unit: 'unidade', sku: 'SYR-5ML-001', minStock: 10, stock: 25 },
    { id: '2', name: 'Gaze Estéril', category: 'Material Cirúrgico', unit: 'unidade', sku: 'GAZ-EST-001', minStock: 50, stock: 75 }
  ]);
});

app.get('/procedures', (req, res) => {
  res.json([
    { id: '1', patientName: 'Maria Silva', professionalName: 'Dr. João Silva', procedureType: 'Consulta Médica', scheduledAt: '2024-01-20T09:00:00', status: 'SCHEDULED' },
    { id: '2', patientName: 'João Santos', professionalName: 'Dr. João Silva', procedureType: 'Cirurgia Simples', scheduledAt: '2024-01-20T14:00:00', status: 'DONE' }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/auth/login`);
});



