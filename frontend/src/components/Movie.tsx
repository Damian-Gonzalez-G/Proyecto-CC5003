import type {IMovie} from './../types/movies'

interface MovieProps {
    movie: IMovie
}

const Movie = ({movie}: MovieProps) => {
    return (
        <div className="movie-card">
            <h2>{movie.title} ({movie.year})</h2>
            <p><strong>Rating:</strong> {movie.rating}/10</p>
        </div>
    )
}

export default Movie