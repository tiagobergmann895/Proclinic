const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'dev-secret-key';

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      accessToken: token,
      refreshToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role
      }
    });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      accessToken: token,
      refreshToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Patients
app.get('/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    console.error('Patients error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/patients', authenticateToken, async (req, res) => {
  try {
    const patient = await prisma.patient.create({
      data: req.body
    });
    res.json(patient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Items
app.get('/items', authenticateToken, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Items error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/items', authenticateToken, async (req, res) => {
  try {
    const item = await prisma.item.create({
      data: req.body
    });
    res.json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Procedures
app.get('/procedures', authenticateToken, async (req, res) => {
  try {
    const procedures = await prisma.procedure.findMany({
      include: {
        patient: true,
        professional: true,
        procedureType: true
      },
      orderBy: { scheduledAt: 'desc' }
    });
    res.json(procedures);
  } catch (error) {
    console.error('Procedures error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/procedures', authenticateToken, async (req, res) => {
  try {
    const procedure = await prisma.procedure.create({
      data: req.body
    });
    res.json(procedure);
  } catch (error) {
    console.error('Create procedure error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/auth/login`);
  console.log(`💾 Conectado ao banco PostgreSQL`);
});



