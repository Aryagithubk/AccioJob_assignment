"use client"

import { createContext, useContext, useState } from "react"
import { sessionAPI } from "../services/api"

const SessionContext = createContext()

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const data = await sessionAPI.getAll()
      setSessions(data)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (title) => {
    try {
      const newSession = await sessionAPI.create(title)
      setSessions((prev) => [newSession, ...prev])
      return newSession
    } catch (error) {
      console.error("Failed to create session:", error)
      throw error
    }
  }

  const updateSession = async (id, updates) => {
    try {
      const updatedSession = await sessionAPI.update(id, updates)
      setSessions((prev) => prev.map((s) => (s._id === id ? updatedSession : s)))
      return updatedSession
    } catch (error) {
      console.error("Failed to update session:", error)
      throw error
    }
  }

  const deleteSession = async (id) => {
    try {
      await sessionAPI.delete(id)
      setSessions((prev) => prev.filter((s) => s._id !== id))
    } catch (error) {
      console.error("Failed to delete session:", error)
      throw error
    }
  }

  const value = {
    sessions,
    loading,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
