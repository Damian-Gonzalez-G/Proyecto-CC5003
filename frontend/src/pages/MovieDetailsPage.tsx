import { useState, useEffect, useCallback } from "react"
import MovieDetails from "../components/MovieDetails"
import type { IMovie } from "../types/movies"
import axios from "axios"
import { useParams, Link } from "react-router-dom"

const MovieDetailsPage = () => {
  const baseUrl = "http://localhost:4000/api"
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<IMovie | null>(null)

  const fetchMovie = useCallback(async () => {
    if (!id) return
    try {
      const response = await axios.get(baseUrl + `/movies/${id}`)
      setMovie(response.data)
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
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-6">
          ← Volver al inicio
        </Link>

        <div className="movie-details-container">
          <MovieDetails movie={movie} onMovieUpdate={handleMovieUpdate} />
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage
