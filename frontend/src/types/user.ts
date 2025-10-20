export interface IUser {
  _id: string
  name: string
  email: string
  avatar?: string
  favorites: string[]
  watchlist: string[]
  createdAt: string
}

export interface AuthContextType {
  user: IUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  toggleFavorite: (movieId: string) => void
  toggleWatchlist: (movieId: string) => void
}