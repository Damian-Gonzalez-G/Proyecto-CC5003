import { Link } from "react-router-dom";
import type { IMovie } from "../types/movies";

interface MovieProps {
  movie: IMovie
};

const Movie = ({ movie }: MovieProps) => {
  return (
    <Link to={`/movies/${movie.id}`} className="block">
      <div className="movie-card group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {movie.title}
          </h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full ml-2 flex-shrink-0">
            {movie.year}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Director:</span> {movie.director}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Género:</span> {movie.genre.join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-card-foreground">{movie.rating}</span>
            <span className="text-muted-foreground text-sm">/10</span>
          </div>
          <span className="text-xs text-muted-foreground">{movie.time} min</span>
        </div>
      </div>
    </Link>
  )
};

export default Movie;
