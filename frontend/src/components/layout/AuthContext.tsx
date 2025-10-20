import { useState, useEffect } from "react"
import type { IUser } from "../../types/user"
import type { AuthProviderProps } from "../../types/auth"
import { AuthContext } from "../../contexts/authContext"
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, _password?: string) => {
    void _password
    // Simulación de login - en producción, esto haría una llamada a la API
    const mockUser: IUser = {
      _id: "1",
      name: "Usuario Demo",
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      favorites: [],
      watchlist: [],
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const register = async (name: string, email: string, _password?: string) => {
    void _password
    // Simulación de registro - en producción, esto haría una llamada a la API
    const mockUser: IUser = {
      _id: "1",
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      favorites: [],
      watchlist: [],
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const toggleFavorite = (movieId: string) => {
    if (!user) return

    const updatedFavorites = user.favorites.includes(movieId)
      ? user.favorites.filter((id) => id !== movieId)
      : [...user.favorites, movieId]

    const updatedUser = { ...user, favorites: updatedFavorites }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const toggleWatchlist = (movieId: string) => {
    if (!user) return

    const updatedWatchlist = user.watchlist.includes(movieId)
      ? user.watchlist.filter((id) => id !== movieId)
      : [...user.watchlist, movieId]

    const updatedUser = { ...user, watchlist: updatedWatchlist }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
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
