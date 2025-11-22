import { Link } from "react-router-dom"
import type { IMovie } from "../types/movies"
import StreamingBadge from "./StreamingBadge"

interface MovieProps {
  movie: IMovie
}

const Movie = ({ movie }: MovieProps) => {
  return (
    <Link to={`/movies/${movie._id}`} className="block">
      <div className="movie-card group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {movie.title}
          </h3>
          <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full ml-2 flex-shrink-0">
            {movie.year}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Director:</span> {movie.director}
          </p>
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 3).map((genre, idx) => (
              <span key={idx} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span className="font-bold text-card-foreground text-lg">{movie.rating}</span>
            <span className="text-muted-foreground text-sm">/10</span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{movie.time} min</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {movie.provider.slice(0, 3).map((provider, idx) => (
            <StreamingBadge key={idx} provider={provider} />
          ))}
          {movie.provider.length > 3 && (
            <span className="text-xs text-muted-foreground">+{movie.provider.length - 3} más</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default Movie
