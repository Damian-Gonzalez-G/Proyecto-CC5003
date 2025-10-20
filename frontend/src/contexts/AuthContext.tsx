import { useState, useEffect, type ReactNode } from "react"
import type { IUser } from "../types/user"
import { authApi } from "../services/api"
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
          setUser({
            ...userData,
            favorites: [],
            watchlist: [],
          })
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
        ...response.user,
        favorites: [],
        watchlist: [],
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

  const toggleFavorite = (movieId: string) => {
    if (!user) return

    const currentFavorites = user.favorites || []
    const updatedFavorites = currentFavorites.includes(movieId)
      ? currentFavorites.filter((id: string) => id !== movieId)
      : [...currentFavorites, movieId]

    const updatedUser = { ...user, favorites: updatedFavorites }
    setUser(updatedUser)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites))
  }

  const toggleWatchlist = (movieId: string) => {
    if (!user) return

    const currentWatchlist = user.watchlist || []
    const updatedWatchlist = currentWatchlist.includes(movieId)
      ? currentWatchlist.filter((id: string) => id !== movieId)
      : [...currentWatchlist, movieId]

    const updatedUser = { ...user, watchlist: updatedWatchlist }
    setUser(updatedUser)
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist))
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

