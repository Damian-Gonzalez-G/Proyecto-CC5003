import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/user';
import { userApi } from '../services/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  toggleFavorite: (movieId: string) => Promise<void>;
  toggleWatchlist: (movieId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      toggleFavorite: async (movieId: string) => {
        const user = get().user;
        if (!user) return;
        const updatedUser = await userApi.toggleFavorite(user.id, movieId);
        set({ user: updatedUser });
      },
      toggleWatchlist: async (movieId: string) => {
        const user = get().user;
        if (!user) return;
        const updatedUser = await userApi.toggleWatchlist(user.id, movieId);
        set({ user: updatedUser });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
