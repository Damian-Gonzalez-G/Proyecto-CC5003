import { create } from 'zustand';
import type { IMovie } from '../types/movies';

interface MoviesState {
  movies: IMovie[];
  loading: boolean;
  error: string | null;
  setMovies: (movies: IMovie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMoviesStore = create<MoviesState>((set) => ({
  movies: [],
  loading: false,
  error: null,
  setMovies: (movies) => set({ movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
