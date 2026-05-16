import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth-context'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import BuilderDashboard from './pages/BuilderDashboard'
import BuilderEditor from './pages/BuilderEditor'
import MemorialPage from './pages/MemorialPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public memorial pages — no auth required */}
      <Route path="/:slug" element={<MemorialPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Builder — authenticated counsellors only */}
      <Route path="/builder" element={<RequireAuth><BuilderDashboard /></RequireAuth>} />
      <Route path="/builder/new" element={<RequireAuth><BuilderEditor /></RequireAuth>} />
      <Route path="/builder/:id" element={<RequireAuth><BuilderEditor /></RequireAuth>} />

      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}
