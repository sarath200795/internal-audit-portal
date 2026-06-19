import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Clock, LogOut, XCircle } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function PendingApproval() {
  const { isAuthenticated, isApproved, profile, org, logout, loading } = useAuth()
  const navigate = useNavigate()

  // Auto-advance the moment an admin approves (profile is live from Firestore).
  useEffect(() => {
    if (isApproved) navigate('/', { replace: true })
  }, [isApproved, navigate])

  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />

  const rejected = profile?.status === 'rejected'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <AuthShell>
      <span
        className={`grid h-14 w-14 place-items-center rounded-2xl ${
          rejected ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
        }`}
      >
        {rejected ? <XCircle className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
      </span>

      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-800">
        {rejected ? 'Access not granted' : 'Awaiting approval'}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        {rejected ? (
          <>
            Your request to join{' '}
            <strong>{org?.name || 'this organization'}</strong> wasn’t approved.
            Please contact your administrator if you think this is a mistake.
          </>
        ) : (
          <>
            Thanks, {profile?.name?.split(' ')[0] || 'there'}! Your request to join{' '}
            <strong>{org?.name || 'your organization'}</strong> has been sent. An
            administrator needs to approve your account before you can access the
            portal. This page will update automatically once you’re approved.
          </>
        )}
      </p>

      <div className="mt-8">
        <Button variant="secondary" icon={LogOut} onClick={handleLogout} className="w-full">
          Sign out
        </Button>
      </div>
    </AuthShell>
  )
}
