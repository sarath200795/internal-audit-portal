import { motion } from 'framer-motion'
import { CalendarCheck, ShieldCheck, BarChart3 } from 'lucide-react'
import Brand, { LogoMark } from './Brand'
import LegalFooter from './LegalFooter'

const FEATURES = [
  { icon: CalendarCheck, label: 'ISO 45001 audit scheduling & execution matrix' },
  { icon: ShieldCheck, label: 'Org-scoped access with admin approvals' },
  { icon: BarChart3, label: 'Live findings, CAPA & closure dashboards' },
]

/**
 * Split-screen authentication layout. The dark marketing panel (left) is fixed;
 * the form content is passed as `children` and rendered on the light panel.
 */
export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: marketing panel */}
      <div className="relative hidden overflow-hidden bg-auth-panel p-10 text-white lg:flex lg:flex-col">
        <Brand tone="light" />

        <div className="relative z-10 mt-20 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold leading-tight tracking-tight"
          >
            Every finding, tracked to closure.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 text-base leading-relaxed text-slate-300"
          >
            Plan audits, raise findings and drive corrective actions across all
            your sites — with scheduling, CAPA workflows and real-time
            compliance dashboards.
          </motion.p>

          <div className="mt-9 space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.16 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <f.icon className="h-5 w-5 shrink-0 text-brand-400" />
                <span className="text-sm font-medium text-slate-100">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Watermark graphic */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-6 select-none opacity-[0.07]"
        >
          <LogoMark className="h-72 w-72" />
        </div>

        <div className="relative z-10 mt-auto pt-10">
          <LegalFooter tone="dark" />
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex min-h-screen flex-col bg-slate-100/70">
        {/* Mobile brand */}
        <div className="px-6 pt-8 lg:hidden">
          <Brand tone="dark" />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>

        <div className="px-6 pb-8 lg:hidden">
          <LegalFooter tone="light" />
        </div>
      </div>
    </div>
  )
}
