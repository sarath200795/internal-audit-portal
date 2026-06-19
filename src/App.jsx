import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { OrgDataProvider } from './context/OrgDataContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import ConfigNotice from './components/ConfigNotice'
import { FullPageSpinner } from './components/ui/Spinner'

// Auth
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const RegisterOrg = lazy(() => import('./pages/auth/RegisterOrg'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const PendingApproval = lazy(() => import('./pages/auth/PendingApproval'))

// Legal
const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Terms = lazy(() => import('./pages/legal/Terms'))
const DataRetention = lazy(() => import('./pages/legal/DataRetention'))
const Cookies = lazy(() => import('./pages/legal/Cookies'))

// App
const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const Audits = lazy(() => import('./pages/app/Audits'))
const AuditDetail = lazy(() => import('./pages/app/AuditDetail'))
const Findings = lazy(() => import('./pages/app/Findings'))
const FindingDetail = lazy(() => import('./pages/app/FindingDetail'))
const Capa = lazy(() => import('./pages/app/Capa'))
const Sites = lazy(() => import('./pages/app/Sites'))
const Admin = lazy(() => import('./pages/app/Admin'))
const Profile = lazy(() => import('./pages/app/Profile'))

/** Redirect authenticated users away from auth pages. */
function PublicOnly({ children }) {
  const { isAuthenticated, isApproved, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to={isApproved ? '/' : '/pending'} replace />
  return children
}

export default function App() {
  const { isConfigured } = useAuth()

  if (!isConfigured) return <ConfigNotice />

  return (
    <Suspense fallback={<FullPageSpinner />}>
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route path="/register-org" element={<PublicOnly><RegisterOrg /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/pending" element={<PendingApproval />} />

      {/* Legal */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/data-retention" element={<DataRetention />} />
      <Route path="/cookies" element={<Cookies />} />

      {/* Protected app */}
      <Route
        element={
          <ProtectedRoute>
            <OrgDataProvider>
              <AppLayout />
            </OrgDataProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/audits" element={<Audits />} />
        <Route path="/audits/:id" element={<AuditDetail />} />
        <Route path="/findings" element={<Findings />} />
        <Route path="/findings/:id" element={<FindingDetail />} />
        <Route path="/capa" element={<Capa />} />
        <Route path="/sites" element={<Sites />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  )
}
