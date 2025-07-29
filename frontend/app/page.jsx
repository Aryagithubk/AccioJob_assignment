"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { SessionProvider } from "./contexts/SessionContext"
import LoginForm from "./components/auth/LoginForm"
import SignupForm from "./components/auth/SignupForm"
import Dashboard from "./components/Dashboard"
import MainEditor from "./components/MainEditor"
import LoadingSpinner from "./components/ui/LoadingSpinner"

function AppContent() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState("login")
  const [selectedSession, setSelectedSession] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Code Generator</h1>
            <p className="text-gray-600">Create beautiful components with AI</p>
          </div>

          {currentView === "login" ? (
            <LoginForm onSwitchToSignup={() => setCurrentView("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setCurrentView("login")} />
          )}
        </div>
      </div>
    )
  }

  if (selectedSession) {
    return <MainEditor session={selectedSession} onBack={() => setSelectedSession(null)} />
  }

  return <Dashboard onSelectSession={setSelectedSession} />
}

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </AuthProvider>
  )
}
