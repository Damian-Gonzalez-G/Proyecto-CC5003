import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { movieApi } from "../services/api"
import type { IMovie } from "../types/movies"

const CreateMoviePage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    year: "",
    time: "",
    rating: "",
    genre: "",
    cast: "",
    provider: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const movieData: Partial<IMovie> = {
        title: formData.title,
        director: formData.director,
        year: parseInt(formData.year),
        time: parseInt(formData.time),
        rating: parseFloat(formData.rating),
        genre: formData.genre.split(",").map((g) => g.trim()).filter((g) => g),
        cast: formData.cast.split(",").map((c) => c.trim()).filter((c) => c),
        provider: formData.provider.split(",").map((p) => p.trim()).filter((p) => p),
      }

      const createdMovie = await movieApi.create(movieData)
      navigate(`/movies/${createdMovie._id}`)
    } catch (err) {
      console.error("Error creating movie:", err)
      setError("Error al crear la película. Verifica los datos e intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/movies" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-6">
          ← Volver al inicio
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-card-foreground mb-8">Crear Nueva Película</h1>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 shadow-2xl space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                Título *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: The Matrix"
              />
            </div>

            <div>
              <label htmlFor="director" className="block text-sm font-medium text-card-foreground mb-2">
                Director *
              </label>
              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Lana Wachowski"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-card-foreground mb-2">
                  Año *
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1800"
                  max="2100"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: 1999"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-card-foreground mb-2">
                  Duración (minutos) *
                </label>
                <input
                  id="time"
                  name="time"
                  type="number"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: 136"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-card-foreground mb-2">
                Calificación (0-10) *
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                required
                min="0"
                max="10"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: 8.7"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-card-foreground mb-2">
                Géneros (separados por comas) *
              </label>
              <input
                id="genre"
                name="genre"
                type="text"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Acción, Ciencia Ficción"
              />
            </div>

            <div>
              <label htmlFor="cast" className="block text-sm font-medium text-card-foreground mb-2">
                Reparto (separados por comas)
              </label>
              <textarea
                id="cast"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
              />
            </div>

            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-card-foreground mb-2">
                Plataformas (separadas por comas) *
              </label>
              <input
                id="provider"
                name="provider"
                type="text"
                value={formData.provider}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Netflix, HBO Max"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creando..." : "Crear Película"}
              </button>
              <Link
                to="/movies"
                className="flex-1 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateMoviePage
