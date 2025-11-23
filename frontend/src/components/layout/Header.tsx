import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/authStore"
import { useState } from "react"

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/auth?tab=login")
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isAuthenticated ? "/movies" : "/auth?tab=login"}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WatchGuide
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <Link to="/movies" className="text-foreground hover:text-primary transition-colors">
                Catálogo
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile?tab=favorites" className="text-foreground hover:text-primary transition-colors">
                  Favoritos
                </Link>
                <Link to="/profile?tab=watchlist" className="text-foreground hover:text-primary transition-colors">
                  Ver después
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <img
                      src={"/vite.svg"}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border-2 border-primary"
                    />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-card-foreground hover:bg-muted transition-colors"
                      >
                        Ver Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-card-foreground hover:bg-muted transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth?tab=login" className="text-foreground hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {isAuthenticated && (
                <Link
                    to="/movies"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                >
                  Catálogo
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile?tab=favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Favoritos
                  </Link>
                  <Link
                    to="/profile?tab=watchlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Ver después
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Ver Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?tab=login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/auth?tab=register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
