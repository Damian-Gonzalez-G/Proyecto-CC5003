interface FilterBarProps {
  genres: string[]
  platforms: string[]
  selectedGenre: string
  selectedPlatform: string
  sortBy: string
  onGenreChange: (genre: string) => void
  onPlatformChange: (platform: string) => void
  onSortChange: (sort: string) => void
}

const FilterBar = ({
  genres,
  platforms,
  selectedGenre,
  selectedPlatform,
  sortBy,
  onGenreChange,
  onPlatformChange,
  onSortChange,
}: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Género</label>
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos los géneros</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Plataforma</label>
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas las plataformas</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Ordenar por</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="title">Título (A-Z)</option>
          <option value="year">Año (Más reciente)</option>
          <option value="rating">Calificación (Mayor)</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
