import { Link } from 'react-router-dom'
import type {IMovie} from './../types/movies'

interface MovieProps {
    movie: IMovie
}

const Movie = ({movie}: MovieProps) => {
    return (
        <Link to={`/movies/${movie.id}`} className="card-link">
            <div className="movie-card">
                <h2>{movie.title} ({movie.year})</h2>
                <p><strong>Rating:</strong> {movie.rating}/10</p>
            </div>
        </Link>
    )
}

export default Movie