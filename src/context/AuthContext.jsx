import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'

const AuthContext = createContext(null)

// Multi-role compatibility: ensure roles[] exists and role/isAdmin reflect it so
// existing `role === 'admin'` checks keep working when users hold several roles.
function normalizeRoles(p) {
  const roles = Array.isArray(p.roles) && p.roles.length ? p.roles : p.role ? [p.role] : []
  const isAdmin = p.isAdmin === true || roles.includes('admin')
  const role = isAdmin ? 'admin' : roles.includes(p.role) ? p.role : roles[0] || p.role || 'member'
  return { ...p, roles, isAdmin, role }
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null) // users/{uid}
  const [org, setOrg] = useState(null) // organizations/{orgId}
  const [loading, setLoading] = useState(isFirebaseConfigured)

  // 1. Track Firebase auth state.
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (!user) {
        setProfile(null)
        setOrg(null)
        setLoading(false)
      }
    })
    return unsub
  }, [])

  // 2. Subscribe to the signed-in user's profile document.
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return undefined
    setLoading(true)
    const ref = doc(db, 'users', firebaseUser.uid)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setProfile(snap.exists() ? normalizeRoles({ id: snap.id, ...snap.data() }) : null)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [firebaseUser])

  // 3. Subscribe to the profile's organization.
  useEffect(() => {
    if (!isFirebaseConfigured || !profile?.orgId) {
      setOrg(null)
      return undefined
    }
    const ref = doc(db, 'organizations', profile.orgId)
    const unsub = onSnapshot(ref, (snap) => {
      setOrg(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    return unsub
  }, [profile?.orgId])

  const logout = () => signOut(auth)

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      org,
      loading,
      isConfigured: isFirebaseConfigured,
      isAuthenticated: Boolean(firebaseUser),
      isApproved: profile?.status === 'approved',
      isAdmin: profile?.role === 'admin',
      logout,
    }),
    [firebaseUser, profile, org, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
