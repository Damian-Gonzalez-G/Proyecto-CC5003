import axios from "axios"
import type { IMovie } from "../types/movies"
import type { IUser } from "../types/user"

const API_BASE_URL = "/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const setCsrfToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["X-CSRF-Token"] = token;
  } else {
    delete api.defaults.headers.common["X-CSRF-Token"];
  }
};

export const movieApi = {
  getAll: async (params?: { q?: string; provider?: string }) => {
    const response = await api.get<IMovie[]>("/movies", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<IMovie>(`/movies/${id}`)
    return response.data
  },

  create: async (movie: Partial<IMovie>) => {
    const response = await api.post<IMovie>("/movies", movie)
    return response.data
  },

  update: async (id: string, movie: Partial<IMovie>) => {
    const response = await api.put<IMovie>(`/movies/${id}`, movie)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/movies/${id}`)
  },
}

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<IUser>("/login", {
      username,
      password,
    })
    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }
    return response.data
  },

  logout: async () => {
    await api.post("/login/logout")
    setCsrfToken(null);
  },

  me: async () => {
    const response = await api.get<IUser>("/login/me")
    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }
    return response.data
  },

  register: async (username: string, name: string, password: string) => {
    const response = await api.post<IUser>("/users", {
      username,
      name,
      password,
    })
    return response.data
  },
}

export const userApi = {
  toggleFavorite: async (userId: string, movieId: string) => {
    const response = await api.put<IUser>(`/users/${userId}/favorites`, { movieId })
    return response.data
  },

  toggleWatchlist: async (userId: string, movieId: string) => {
    const response = await api.put<IUser>(`/users/${userId}/watchlist`, { movieId })
    return response.data
  },
}

export const healthCheck = async () => {
  const response = await api.get("/health")
  return response.data
}

export default api
