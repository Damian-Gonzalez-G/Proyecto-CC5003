import { useState, useEffect, type ReactNode } from "react"
import type { IUser } from "../types/user"
import { authApi, userApi } from "../services/api"
import { AuthContext } from "./auth"

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.me()
        if (userData && userData.id) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch {
        console.log("No authenticated user")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      const userData: IUser = {
        ...response
      }
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (username: string, name: string, password: string) => {
    try {
      await authApi.register(username, name, password)
      await login(username, password)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null)
    }
  }

  const toggleFavorite = async (movieId: string) => {
    if (!user) return

    try {
      const updatedUser = await userApi.toggleFavorite(user.id, movieId)
      setUser(updatedUser)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const toggleWatchlist = async (movieId: string) => {
    if (!user) return

    try {
      const updatedUser = await userApi.toggleWatchlist(user.id, movieId)
      setUser(updatedUser)
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        toggleFavorite,
        toggleWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

