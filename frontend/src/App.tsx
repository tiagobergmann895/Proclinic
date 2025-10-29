import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginDefinitivo from './pages/LoginDefinitivo'
import DashboardMock from './pages/DashboardMock'
import Patients from './pages/Patients'
import Items from './pages/Items'
import Procedures from './pages/Procedures'
import Inventory from './pages/Inventory'
import Purchases from './pages/Purchases'
import Reports from './pages/Reports'
import Subscription from './pages/Subscription'
import SubscriptionSuccess from './pages/SubscriptionSuccess'
import SubscriptionCancel from './pages/SubscriptionCancel'
import PatientEHR from './pages/PatientEHR'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Verificar autenticação ao carregar
  React.useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('proclinic-auth-local')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          if (parsed.isAuthenticated) {
            setIsAuthenticated(true)
          }
        } catch (e) {
          console.log('❌ Erro ao verificar auth:', e)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Carregando...</div>
    </div>
  }

  if (!isAuthenticated) {
    return <LoginDefinitivo />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardMock />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:patientId/ehr" element={<PatientEHR />} />
          <Route path="/items" element={<Items />} />
          <Route path="/procedures" element={<Procedures />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
