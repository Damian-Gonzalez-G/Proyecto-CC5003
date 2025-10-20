"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Movie from "../components/Movie"
import SearchBar from "../components/SearchBar"
import FilterBar from "../components/FilterBar"
import type { IMovie } from "../types/movies"
import axios from "axios"

const HomePage = () => {
  const baseUrl = "http://localhost:4000/api"
  const [movies, setMovies] = useState<IMovie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [isLoading, setIsLoading] = useState(true)

  const fetchMovies = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(baseUrl + "/movies")
      setMovies(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>()
    movies.forEach((movie) => movie.genre.forEach((g) => genreSet.add(g)))
    return Array.from(genreSet).sort()
  }, [movies])

  const availablePlatforms = useMemo(() => {
    const platformSet = new Set<string>()
    movies.forEach((movie) => movie.provider.forEach((p) => platformSet.add(p)))
    return Array.from(platformSet).sort()
  }, [movies])

  const filteredMovies = useMemo(() => {
    let filtered = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedGenre) {
      filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre))
    }

    if (selectedPlatform) {
      filtered = filtered.filter((movie) => movie.provider.includes(selectedPlatform))
    }

    // Sort movies
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
  }, [movies, searchQuery, selectedGenre, selectedPlatform, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-header text-5xl md:text-7xl font-bold mb-8">WatchGuide</h1>
      <p className="text-center text-muted-foreground mb-8 text-lg">
        Encuentra dónde ver tus películas favoritas con información siempre actualizada
      </p>

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
          {isLoading
            ? "Cargando películas..."
            : `${filteredMovies.length} película${filteredMovies.length !== 1 ? "s" : ""} encontrada${filteredMovies.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {isLoading ? (
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
