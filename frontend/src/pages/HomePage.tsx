"use client"

import { useState, useEffect, useCallback } from "react";
import Movie from "../components/Movie";
import SearchBar from "../components/SearchBar";
import type { IMovie } from "../types/movies";
import axios from "axios";

const HomePage = () => {
  const baseUrl = "http://localhost:4000/api";
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(baseUrl + "/movies");
      setMovies(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-header text-4xl md:text-6xl font-bold mb-8">🎬 WatchGuide</h1>

      <div className="search-container">
        <SearchBar query={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => <Movie key={movie._id} movie={movie} />)
        ) : (
          <div className="no-results col-span-full">
            <p className="text-xl">No se encontraron películas.</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
};

export default HomePage;
