"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      if (storedToken) setToken(storedToken)
      else setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      checkAuth()
    }
  }, [token])

  const checkAuth = async () => {
    try {
      const userData = await authAPI.me()
      setUser(userData)
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      setUser(response)
      setToken(response.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup(name, email, password)
      setUser(response)
      setToken(response.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token)
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { authAPI } from "../services/api"

// const AuthContext = createContext()

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [token, setToken] = useState(localStorage.getItem("token"))

//   useEffect(() => {
//     if (token) {
//       checkAuth()
//     } else {
//       setLoading(false)
//     }
//   }, [token])

//   const checkAuth = async () => {
//     try {
//       const userData = await authAPI.me()
//       setUser(userData)
//     } catch (error) {
//       localStorage.removeItem("token")
//       setToken(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login(email, password)
//       setUser(response)
//       setToken(response.token)
//       localStorage.setItem("token", response.token)
//       return { success: true }
//     } catch (error) {
//       return { success: false, error: error.message }
//     }
//   }

//   const signup = async (name, email, password) => {
//     try {
//       const response = await authAPI.signup(name, email, password)
//       setUser(response)
//       setToken(response.token)
//       localStorage.setItem("token", response.token)
//       return { success: true }
//     } catch (error) {
//       return { success: false, error: error.message }
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     setToken(null)
//     localStorage.removeItem("token")
//   }

//   const value = {
//     user,
//     loading,
//     login,
//     signup,
//     logout,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

