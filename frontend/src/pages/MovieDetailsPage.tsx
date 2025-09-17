import { useState, useEffect, useCallback } from 'react'
import MovieDetails from '../components/MovieDetails'
import type {IMovie} from '../types/movies'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import '../App.css'

const MovieDetailsPage = () => {
    const baseUrl = "http://localhost:3001"
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<IMovie| null>(null);
    // const [error, setError] = useState<string | null>(null);
    
    const fetchMovie = useCallback(async () => {
        if (!id) return;
        try {
            const response = await axios.get(baseUrl + `/movies/${id}`);
            setMovie(response.data);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchMovie();
    }, [fetchMovie]);

    if (!movie) {
        return <p>Cargando...</p>;
    }

    return (
        <>
            <div className="details-wrapper">
                <MovieDetails key={movie.id} movie={movie} />
            </div>
        </>
    )
}

export default MovieDetailsPage