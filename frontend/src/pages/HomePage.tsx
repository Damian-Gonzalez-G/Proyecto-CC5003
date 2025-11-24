import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import Movie from "../components/Movie"
import SearchBar from "../components/SearchBar"
import FilterBar from "../components/FilterBar"
import { useMoviesStore } from "../stores/moviesStore"
import { movieApi } from "../services/api"
import type { IMovie } from "../types/movies"

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [fetchedMovies, setFetchedMovies] = useState<IMovie[]>([])
  const { setMovies, loading, setLoading, error, setError } = useMoviesStore()

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: { q?: string; provider?: string } = {}
      if (searchQuery) params.q = searchQuery
      if (selectedPlatform) params.provider = selectedPlatform

      const data = await movieApi.getAll(params)
      setFetchedMovies(data)

      if (!searchQuery && !selectedPlatform) {
        setMovies(data)
      }
    } catch (err) {
      setError("Error al cargar películas")
      console.error("Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedPlatform, setMovies, setLoading, setError])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>()
    fetchedMovies.forEach((movie) => movie.genre.forEach((g) => genreSet.add(g)))
    return Array.from(genreSet).sort()
  }, [fetchedMovies])

  const availablePlatforms = useMemo(() => {
    const platformSet = new Set<string>()
    fetchedMovies.forEach((movie) => movie.provider.forEach((p) => platformSet.add(p)))
    return Array.from(platformSet).sort()
  }, [fetchedMovies])

  const filteredMovies = useMemo(() => {
    let filtered = [...fetchedMovies]

    if (selectedGenre) {
      filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre))
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "year":
          return b.year - a.year
        case "rating":
          return b.rating - a.rating
        case "title":
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return filtered
  }, [fetchedMovies, selectedGenre, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="page-header text-5xl md:text-7xl font-bold">WatchGuide</h1>
          <p className="text-center text-muted-foreground mt-4 text-lg">
            Encuentra dónde ver tus películas favoritas con información siempre actualizada
          </p>
        </div>
        <Link
          to="/movies/create"
          className="create-movie-btn px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
        >
          + Nueva Película
        </Link>
      </div>

      <div className="search-container mb-6">
        <SearchBar query={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="max-w-6xl mx-auto mb-6">
        <FilterBar
          genres={availableGenres}
          platforms={availablePlatforms}
          selectedGenre={selectedGenre}
          selectedPlatform={selectedPlatform}
          sortBy={sortBy}
          onGenreChange={setSelectedGenre}
          onPlatformChange={setSelectedPlatform}
          onSortChange={setSortBy}
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          {loading
            ? "Cargando películas..."
            : error
              ? error
              : `${filteredMovies.length} película${filteredMovies.length !== 1 ? "s" : ""} encontrada${filteredMovies.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => <Movie key={movie._id} movie={movie} />)
          ) : (
            <div className="no-results col-span-full">
              <p className="text-2xl mb-2">No se encontraron películas</p>
              <p className="text-sm">Intenta ajustar los filtros o el término de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage
