import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ClipboardCheck,
  AlertTriangle,
  Wrench,
  Building2,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Brand from './Brand'

const NAV = [
  { to: '/', label: 'Internal Audit', icon: ClipboardCheck, end: true },
  { to: '/findings', label: 'Findings', icon: AlertTriangle },
  { to: '/capa', label: 'CAPA', icon: Wrench },
  { to: '/sites', label: 'Sites', icon: Building2 },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
]

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function AppLayout() {
  const { profile, org, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = NAV.filter((n) => !n.adminOnly || isAdmin)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Brand tone="light" size="md" to="/" />
      </div>

      {org && (
        <div className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Organization
          </p>
          <p className="truncate text-sm font-semibold text-white">{org.name}</p>
          {org.location && (
            <p className="truncate text-xs text-slate-400">{org.location}</p>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1 px-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-gradient text-white shadow-brand'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <NavLink
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
            {initials(profile?.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">
              {profile?.name}
            </span>
            <span className="block truncate text-xs capitalize text-slate-400">
              {profile?.role}
            </span>
          </span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-auth-panel lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-auth-panel">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar (mobile) */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Brand tone="dark" size="md" to="/" />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
