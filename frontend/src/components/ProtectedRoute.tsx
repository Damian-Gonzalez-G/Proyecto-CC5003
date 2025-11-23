import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth?tab=login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
