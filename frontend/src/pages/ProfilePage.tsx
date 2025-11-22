import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../contexts/auth"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import type { IMovie } from "../types/movies"
import { movieApi } from "../services/api"

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [favoriteMovies, setFavoriteMovies] = useState<IMovie[]>([])
  const [watchlistMovies, setWatchlistMovies] = useState<IMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMovies = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const allMovies = await movieApi.getAll()

      const favorites = allMovies.filter((movie: IMovie) => user.favorites?.includes(movie._id) ?? false)
      const watchlist = allMovies.filter((movie: IMovie) => user.watchlist?.includes(movie._id) ?? false)

      setFavoriteMovies(favorites)
      setWatchlistMovies(watchlist)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth?tab=login")
      return
    }
    fetchMovies()
  }, [isAuthenticated, navigate, fetchMovies])

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "overview")
  }, [searchParams])

  useEffect(() => {
    if (user) {
      fetchMovies()
    }
  }, [user, fetchMovies])

  if (!user) return null

  const MovieCard = ({ movie }: { movie: IMovie }) => (
    <Link to={`/movies/${movie._id}`} className="block">
      <div className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-all hover:shadow-lg">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-card-foreground line-clamp-1">{movie.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full ml-2 flex-shrink-0">
            {movie.year}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">Director:</span> {movie.director}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-card-foreground">{movie.rating}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.provider.slice(0, 2).map((provider, idx) => (
              <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {provider}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={"/vite.svg"}
              alt={user.name ?? user.username}
              className="w-20 h-20 rounded-full border-4 border-primary"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-card-foreground">{user.name ?? user.username}</h1>
              <p className="text-muted-foreground">{user.username}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => navigate("/profile?tab=overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground border border-border hover:bg-muted"
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => navigate("/profile?tab=favorites")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "favorites"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border hover:bg-muted"
            }`}
          >
                Favoritos ({user.favorites?.length ?? 0})
          </button>
          <button
            onClick={() => navigate("/profile?tab=watchlist")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "watchlist"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border hover:bg-muted"
            }`}
          >
                Ver después ({user.watchlist?.length ?? 0})
          </button>
          <button
            onClick={() => navigate("/profile?tab=settings")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground border border-border hover:bg-muted"
            }`}
          >
            Configuración
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{user.favorites?.length ?? 0}</div>
                <div className="text-muted-foreground">Películas Favoritas</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{user.watchlist?.length ?? 0}</div>
                <div className="text-muted-foreground">Para Ver Después</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {(user.favorites?.length ?? 0) + (user.watchlist?.length ?? 0)}
                  </div>
                <div className="text-muted-foreground">Total Guardadas</div>
              </div>
            </div>

            {favoriteMovies.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Favoritos Recientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteMovies.slice(0, 3).map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Mis Favoritos</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando favoritos...</p>
              </div>
            ) : favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-xl text-muted-foreground mb-2">No tienes favoritos aún</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Explora el catálogo y marca tus películas favoritas
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Explorar Catálogo
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "watchlist" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Ver Después</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando lista...</p>
              </div>
            ) : watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {watchlistMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-xl text-muted-foreground mb-2">Tu lista está vacía</p>
                <p className="text-sm text-muted-foreground mb-4">Agrega películas que quieras ver más tarde</p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Explorar Catálogo
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Configuración de Cuenta</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Nombre</label>
                    <input
                      type="text"
                      value={user.name ?? user.username}
                      disabled
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Usuario</label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Preferencias</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                    <span className="text-card-foreground">Recibir notificaciones de nuevas películas</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                    <span className="text-card-foreground">Mostrar recomendaciones personalizadas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
