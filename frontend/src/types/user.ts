export interface IUser {
  id: string
  username: string
  name?: string
  favorites?: string[]
  watchlist?: string[]
}

export interface AuthContextType {
  user: IUser | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  toggleFavorite: (movieId: string) => void
  toggleWatchlist: (movieId: string) => void
}
