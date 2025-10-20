import axios from "axios"
import type { IMovie } from "../types/movies"
import type { IUser } from "../types/user"

const API_BASE_URL = "http://localhost:4000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Movie API
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

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<{ token: string; user: IUser }>("/login", {
      username,
      password,
    })
    return response.data
  },

  logout: async () => {
    await api.post("/login/logout")
  },

  me: async () => {
    const response = await api.get<IUser>("/login/me")
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

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health")
  return response.data
}

export default api
