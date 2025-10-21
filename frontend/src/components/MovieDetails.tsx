import { useState } from "react"
import type { IMovie } from "../types/movies"
import StreamingBadge from "./StreamingBadge"
import { useAuth } from "../contexts/auth"
import { movieApi } from "../services/api"

interface MovieDetailsProps {
  movie: IMovie
  onMovieUpdate?: (updatedMovie: IMovie) => void
}

const MovieDetails = ({ movie, onMovieUpdate }: MovieDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProvider, setNewProvider] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const { user, isAuthenticated, toggleFavorite, toggleWatchlist } = useAuth()

  const isFavorite = user?.favorites?.includes(movie._id) ?? false
  const isInWatchlist = user?.watchlist?.includes(movie._id) ?? false

  const handleProviderChange = async () => {
    if (!newProvider.trim()) return

    setIsUpdating(true)
    try {
      const movieUpdatePayload = {
        provider: [newProvider.trim()],
      }
      const updatedMovie = await movieApi.update(movie._id, movieUpdatePayload)
      if (onMovieUpdate) {
        onMovieUpdate(updatedMovie)
      }

      setIsModalOpen(false)
      setNewProvider("")
    } catch (error) {
      console.error("Error updating provider:", error)
      alert("Error al actualizar la plataforma")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggleFavorite = async () => {
    await toggleFavorite(movie._id)
  }

  const handleToggleWatchlist = async () => {
    await toggleWatchlist(movie._id)
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
        {isAuthenticated && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isFavorite
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              <span className="text-xl">{isFavorite ? "❤️" : "🤍"}</span>
              <span>{isFavorite ? "En Favoritos" : "Agregar a Favoritos"}</span>
            </button>
            <button
              onClick={handleToggleWatchlist}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isInWatchlist
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/50"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              <span className="text-xl">{isInWatchlist ? "✓" : "+"}</span>
              <span>{isInWatchlist ? "En tu Lista" : "Ver Después"}</span>
            </button>
          </div>
        )}

        <div className="text-center mb-8 pb-8 border-b border-border">
          <h1 className="text-5xl font-bold text-card-foreground mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text">
            {movie.title}
          </h1>
          <p className="text-2xl text-muted-foreground">({movie.year})</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-background/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <span>📋</span> Información General
              </h3>
              <div className="space-y-3">
                <p className="text-card-foreground">
                  <span className="font-medium text-primary">Director:</span> {movie.director}
                </p>
                <p className="text-card-foreground">
                  <span className="font-medium text-primary">Duración:</span> {movie.time} minutos
                </p>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-primary">Plataformas:</span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer"
                    >
                      Actualizar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movie.provider.map((provider, idx) => (
                      <StreamingBadge key={idx} provider={provider} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <span>🎭</span> Géneros
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <span>⭐</span> Calificación
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-5xl">⭐</span>
                <div>
                  <span className="text-5xl font-bold text-card-foreground">{movie.rating}</span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <span>🎬</span> Reparto
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <span key={index} className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Cambiar Plataforma</h2>

            <div className="mb-4">
              <label htmlFor="newProvider" className="block text-sm font-medium text-card-foreground mb-2">
                Nueva plataforma:
              </label>
              <input
                id="newProvider"
                type="text"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                placeholder="Ingresa la nueva plataforma"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isUpdating}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setNewProvider("")
                }}
                className="px-4 py-2 border border-border rounded-md text-card-foreground hover:bg-muted transition-colors cursor-pointer"
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                onClick={handleProviderChange}
                disabled={!newProvider.trim() || isUpdating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUpdating ? "Actualizando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MovieDetails
