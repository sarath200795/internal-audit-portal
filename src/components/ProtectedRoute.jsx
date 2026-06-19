import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageSpinner } from './ui/Spinner'

/**
 * Guards the authenticated app:
 *  - not signed in       -> /login
 *  - signed in, pending  -> /pending
 *  - admin-only route, not admin -> redirect to dashboard
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isApproved, isAdmin, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Signed in but profile not yet approved (or no profile doc found).
  if (!isApproved) {
    if (profile?.status === 'pending' || !profile) {
      return <Navigate to="/pending" replace />
    }
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
