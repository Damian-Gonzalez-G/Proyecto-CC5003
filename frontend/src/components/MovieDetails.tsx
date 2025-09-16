import type {IMovie} from '../types/movies'

interface MovieDetailsProps {
    movie: IMovie
}

const MovieDetails = ({movie}: MovieDetailsProps) => {
    return (
        <div className="movie-details">
            <h2>{movie.title} ({movie.year})</h2>
            <p>Director: {movie.director}</p>
            <p>Genre: {movie.genre}</p>
            <p>Length: {movie.time}</p>
            <p>Provider: {movie.provider}</p>
            <p><strong>Rating:</strong> {movie.rating}/10</p>
            <p>Cast: {movie.cast}</p>
        </div>
    )
}

export default MovieDetails