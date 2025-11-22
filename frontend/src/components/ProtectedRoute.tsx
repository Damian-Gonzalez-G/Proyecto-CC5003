import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth?tab=login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
