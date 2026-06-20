import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  CalendarClock,
  ClipboardList,
  Wrench,
  FileText,
  ListChecks,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subscribeAuditFindings } from '../services/auditModule'

/** Voxel-style audit officer (recreated from the EHS suite's helper, in blue). */
function OfficerCharacter({ className = '' }) {
  return (
    <svg viewBox="0 0 96 124" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1c44f" />
          <stop offset="1" stopColor="#d99a2b" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="48" cy="118" rx="24" ry="4.5" fill="rgba(15,23,42,0.14)" />

      {/* legs */}
      <rect x="38" y="92" width="9" height="24" rx="2" fill="#1f2937" />
      <rect x="49" y="92" width="9" height="24" rx="2" fill="#1f2937" />
      <rect x="37" y="112" width="11" height="5" rx="2" fill="#0f172a" />
      <rect x="48" y="112" width="11" height="5" rx="2" fill="#0f172a" />

      {/* left arm (holds clipboard) */}
      <rect x="24" y="57" width="9" height="26" rx="3.5" fill="#334155" />
      <rect x="24" y="80" width="9" height="7" rx="2.5" fill="#f3c79b" />

      {/* torso / shirt */}
      <rect x="32" y="55" width="32" height="39" rx="5" fill="#334155" />

      {/* hi-vis vest (blue) */}
      <rect x="33" y="55" width="12" height="33" rx="2" fill="url(#vest)" />
      <rect x="51" y="55" width="12" height="33" rx="2" fill="url(#vest)" />
      <rect x="40" y="54" width="16" height="9" rx="2" fill="url(#vest)" />
      {/* reflective stripes */}
      <rect x="33" y="66" width="12" height="3" fill="#e8eef7" opacity="0.92" />
      <rect x="51" y="66" width="12" height="3" fill="#e8eef7" opacity="0.92" />
      <rect x="33" y="77" width="12" height="3" fill="#e8eef7" opacity="0.92" />
      <rect x="51" y="77" width="12" height="3" fill="#e8eef7" opacity="0.92" />
      {/* depth shading on right side */}
      <rect x="58" y="55" width="6" height="39" rx="3" fill="rgba(15,23,42,0.10)" />

      {/* clipboard in left hand */}
      <g>
        <rect x="13" y="62" width="16" height="20" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
        <rect x="18" y="60" width="6" height="3.5" rx="1.5" fill="#94a3b8" />
        <rect x="16" y="68" width="10" height="1.8" rx="0.9" fill="#cbd5e1" />
        <rect x="16" y="72" width="10" height="1.8" rx="0.9" fill="#cbd5e1" />
        <rect x="16" y="76" width="7" height="1.8" rx="0.9" fill="#2563eb" />
      </g>

      {/* right arm (waves) */}
      <g className="assist-arm">
        <rect x="63" y="57" width="9" height="26" rx="3.5" fill="#334155" />
        <rect x="63" y="80" width="9" height="7" rx="2.5" fill="#f3c79b" />
      </g>

      {/* head */}
      <rect x="35" y="28" width="26" height="26" rx="7" fill="#f3c79b" />
      {/* ears */}
      <rect x="32" y="38" width="4" height="7" rx="2" fill="#eab98a" />
      <rect x="60" y="38" width="4" height="7" rx="2" fill="#eab98a" />
      {/* hair */}
      <rect x="32" y="20" width="32" height="14" rx="6" fill="url(#hair)" />
      <rect x="34" y="29" width="28" height="5" rx="2" fill="url(#hair)" />
      {/* face */}
      <circle cx="43" cy="41" r="1.7" fill="#1f2937" />
      <circle cx="53" cy="41" r="1.7" fill="#1f2937" />
      <rect x="45" y="47" width="6" height="1.8" rx="0.9" fill="#b87651" />
    </svg>
  )
}

const TIPS = [
  { icon: CalendarClock, text: 'Plan audits and assign an auditor & auditee in the Scheduler.' },
  { icon: ClipboardList, text: 'Auditors raise findings in the Auditor Workplace.' },
  { icon: Wrench, text: 'Auditees respond with a CAPA in the Auditee Workplace.' },
  { icon: ListChecks, text: 'Browse everything in the Findings & CAPA registers.' },
  { icon: FileText, text: 'Verify closure and export PDFs from Reports.' },
]

export default function HelpAssistant() {
  const { profile, org } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (!org?.id) return undefined
    return subscribeAuditFindings(org.id, setRecords)
  }, [org?.id])

  // Badge = open findings needing attention (records not yet closed).
  const openCount = useMemo(() => {
    let n = 0
    records.forEach((r) => {
      if (r.status !== 'Closed') n += (r.findings || []).length
    })
    return n
  }, [records])

  const firstName = profile?.name?.split(' ')[0] || 'there'

  const go = (to) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="assist-panel w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-auth-panel px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                <OfficerCharacter className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Audit Assistant</p>
                <p className="text-[10px] text-slate-300">{org?.name || 'Your organization'}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-ink-800">Hi {firstName}! 👋</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {openCount > 0
                ? `You have ${openCount} open finding${openCount === 1 ? '' : 's'} to drive to closure.`
                : 'Everything looks clear. Here’s how the audit flow works:'}
            </p>

            <ul className="mt-3 space-y-2.5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <t.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs leading-relaxed text-slate-600">{t.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => go('/')} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white transition active:scale-[0.98] hover:bg-brand-700">
                Open hub <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => go('/findings')} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                Findings
              </button>
              <button onClick={() => go('/capa')} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                CAPA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating character button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative block transition active:scale-95"
        aria-label={open ? 'Close audit assistant' : 'Open audit assistant'}
      >
        <span className="assist-char block drop-shadow-lg">
          <OfficerCharacter className="h-[88px] w-[68px]" />
        </span>
        {openCount > 0 && (
          <span className="absolute -right-1 top-1 grid min-w-[22px] place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white ring-2 ring-white">
            {openCount > 99 ? '99+' : openCount}
          </span>
        )}
      </button>
    </div>
  )
}
