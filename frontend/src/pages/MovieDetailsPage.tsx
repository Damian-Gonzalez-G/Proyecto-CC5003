import { useState, useEffect, useCallback } from "react"
import MovieDetails from "../components/MovieDetails"
import type { IMovie } from "../types/movies"
import { movieApi } from "../services/api"
import { useParams, Link, useNavigate } from "react-router-dom"

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fetchMovie = useCallback(async () => {
    if (!id) return
    try {
      const data = await movieApi.getById(id)
      setMovie(data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    fetchMovie()
  }, [fetchMovie])

  const handleMovieUpdate = (updatedMovie: IMovie) => {
    setMovie(updatedMovie)
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await movieApi.delete(id)
      navigate("/movies")
    } catch (err) {
      console.error("Error deleting movie:", err)
      alert("Error al eliminar la película")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!movie) {
    return (
      <div className="loading-state">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Cargando película...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/movies" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors">
            ← Volver al inicio
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-movie-btn px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            🗑️ Eliminar Película
          </button>
        </div>

        <div className="movie-details-container">
          <MovieDetails movie={movie} onMovieUpdate={handleMovieUpdate} />
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Confirmar Eliminación</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar esta película? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-border rounded-md text-card-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="confirm-delete-btn px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetailsPage
