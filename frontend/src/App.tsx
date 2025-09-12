import { useState, useEffect, useCallback } from 'react'
import Movie from './components/Movie'
import SearchBar from './components/SearchBar'
import type {IMovie} from './types/movies'
import axios from 'axios'
import './App.css'

function App() {

  const baseUrl = "http://localhost:3001"
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

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h1>Hito 1</h1>
      <SearchBar query={searchQuery} onChange={setSearchQuery} />
      <div id="movieContainer">
        {filteredMovies.length > 0 ? 
        (filteredMovies.map(movie => <Movie key = {movie.id} movie={movie} />)) : 
        (<p>No hay películas aún.</p>)}
      </div>
    </>
  )
}

export default App
