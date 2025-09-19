"use client"

import { useState } from "react";
import type { IMovie } from "../types/movies";
import axios from "axios";

interface MovieDetailsProps {
  movie: IMovie
  onMovieUpdate?: (updatedMovie: IMovie) => void
};

const MovieDetails = ({ movie, onMovieUpdate }: MovieDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProviderChange = async () => {
    if (!newProvider.trim()) return;

    setIsUpdating(true);
    try {
      const baseUrl = "http://localhost:3001";
      const response = await axios.put(`${baseUrl}/movies/${movie.id}`, {
        ...movie,
        provider: [newProvider.trim()],
      });

      const updatedMovie = { ...movie, provider: [newProvider.trim()] };
      if (onMovieUpdate) {
        onMovieUpdate(updatedMovie);
      }

      setIsModalOpen(false);
      setNewProvider("");
    } catch (error) {
      console.error("Error updating provider:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-card-foreground mb-2">{movie.title}</h1>
          <p className="text-xl text-muted-foreground">({movie.year})</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Información General</h3>
              <div className="space-y-3">
                <p className="text-card-foreground">
                  <span className="font-medium text-primary">Director:</span> {movie.director}
                </p>
                <p className="text-card-foreground">
                  <span className="font-medium text-primary">Duración:</span> {movie.time} minutos
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-card-foreground">
                    <span className="font-medium text-primary">Plataforma:</span>{" "}
                    {Array.isArray(movie.provider) ? movie.provider.join(", ") : movie.provider}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-4 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre, index) => (
                  <span key={index} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Calificación</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl">⭐</span>
                <span className="text-3xl font-bold text-card-foreground">{movie.rating}</span>
                <span className="text-xl text-muted-foreground">/10</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Reparto</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <span key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Cambiar Plataforma</h2>

            <div className="mb-4">
              <label htmlFor="newProvider" className="block text-sm font-medium text-card-foreground mb-2">
                Nueva plataforma:
              </label>
              <input
                id="newProvider"
                type="text"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                placeholder="Ingresa la nueva plataforma"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isUpdating}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setNewProvider("")
                }}
                className="px-4 py-2 border border-border rounded-md text-card-foreground hover:bg-muted transition-colors cursor-pointer"
                disabled={isUpdating}
              >
                Cancelar
              </button>
              <button
                onClick={handleProviderChange}
                disabled={!newProvider.trim() || isUpdating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUpdating ? "Actualizando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default MovieDetails;
