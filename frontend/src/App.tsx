import { useState, useEffect, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Movie from './components/Movie'
import type {IMovie} from './types/movies'
import axios from 'axios'
import './App.css'

function App() {
  const baseUrl = "http://localhost:3001"
  const [movies, setMovies] = useState<IMovie[]>([]);
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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
        <div id="movieContainer">
          {movies.length > 0 ? 
          (movies.map(movie => <Movie key = {movie.id} movie={movie} />)) : 
          (<p>No hay películas aún.</p>)}
        </div>
    </>
  )
}

export default App
