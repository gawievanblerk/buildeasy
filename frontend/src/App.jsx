import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BuilderPage from './pages/BuilderPage'
import Layout from './components/Layout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
        } />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          } />
          <Route path="builder/:appId?" element={
            isAuthenticated ? <BuilderPage /> : <Navigate to="/login" />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
