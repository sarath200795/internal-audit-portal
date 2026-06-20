import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Send, Move, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subscribeAuditFindings, subscribeAuditPlans } from '../services/auditModule'

/* ── Sam: a roaming voxel audit officer that answers questions about the
 *    live audit data. Modeled on the EHS suite's "Sam — Safety Bot",
 *    recoloured blue for the Internal Audit portal. ── */

function Officer({ className = '' }) {
  // Sam — voxel safety officer (red hi-vis vest), matched to the Fire Marshal mascot.
  return (
    <svg viewBox="0 0 96 134" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sam-vest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#c81e1e" />
        </linearGradient>
        <linearGradient id="sam-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7cf5b" />
          <stop offset="1" stopColor="#e0a92e" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="127" rx="22" ry="4.2" fill="rgba(15,23,42,0.16)" />

      {/* legs (swing while walking) */}
      <g className="sam-leg sam-leg-l">
        <rect x="39" y="95" width="9" height="27" rx="2" fill="#1e2a4a" />
        <rect x="38" y="118" width="11" height="6" rx="2" fill="#0f1b33" />
      </g>
      <g className="sam-leg sam-leg-r">
        <rect x="49" y="95" width="9" height="27" rx="2" fill="#1e2a4a" />
        <rect x="48" y="118" width="11" height="6" rx="2" fill="#0f1b33" />
      </g>

      {/* arms (static, at sides) */}
      <rect x="25" y="60" width="8" height="25" rx="3" fill="url(#sam-vest)" />
      <rect x="25" y="82" width="8" height="7" rx="2.5" fill="#f0c89c" />
      <rect x="63" y="60" width="8" height="25" rx="3" fill="url(#sam-vest)" />
      <rect x="63" y="82" width="8" height="7" rx="2.5" fill="#f0c89c" />

      {/* torso / undershirt */}
      <rect x="32" y="58" width="32" height="41" rx="5" fill="#16233f" />
      {/* red hi-vis vest */}
      <rect x="33" y="58" width="30" height="37" rx="3" fill="url(#sam-vest)" />
      <rect x="38" y="56" width="20" height="8" rx="3" fill="url(#sam-vest)" />
      <rect x="58" y="58" width="5" height="37" rx="2.5" fill="rgba(15,23,42,0.14)" />
      {/* vertical reflective stripes */}
      <rect x="40" y="62" width="3.6" height="31" rx="1" fill="#eef2f7" opacity="0.95" />
      <rect x="52.4" y="62" width="3.6" height="31" rx="1" fill="#eef2f7" opacity="0.95" />

      {/* clipboard in left hand */}
      <rect x="14" y="66" width="15" height="19" rx="2" fill="#fff" stroke="#cbd5e1" strokeWidth="1.2" />
      <rect x="18.5" y="64" width="6" height="3.4" rx="1.5" fill="#94a3b8" />
      <rect x="16.5" y="71" width="10" height="1.8" rx="0.9" fill="#cbd5e1" />
      <rect x="16.5" y="75" width="10" height="1.8" rx="0.9" fill="#cbd5e1" />
      <rect x="16.5" y="79" width="7" height="1.8" rx="0.9" fill="#dc2626" />

      {/* head */}
      <rect x="33" y="28" width="30" height="28" rx="7" fill="#f0c89c" />
      <rect x="30" y="39" width="4" height="8" rx="2" fill="#e6b485" />
      <rect x="62" y="39" width="4" height="8" rx="2" fill="#e6b485" />
      {/* blonde hair */}
      <rect x="30" y="19" width="36" height="15" rx="7" fill="url(#sam-hair)" />
      <rect x="33" y="29" width="30" height="5" rx="2" fill="url(#sam-hair)" />
      <rect x="30" y="27" width="5" height="10" rx="2" fill="url(#sam-hair)" />
      <rect x="61" y="27" width="5" height="10" rx="2" fill="url(#sam-hair)" />
      {/* face */}
      <circle cx="42" cy="42" r="1.9" fill="#26303f" />
      <circle cx="54" cy="42" r="1.9" fill="#26303f" />
      <rect x="44.5" y="48.5" width="7" height="1.9" rx="0.95" fill="#b87651" />
    </svg>
  )
}

const QUICK = [
  ['Today’s status', 'status'],
  ['What needs attention?', 'attention'],
  ['How many open findings?', 'findings'],
  ['Give me a summary', 'summary'],
]

function sample(arr, key) {
  const ids = arr.map((x) => x[key]).filter(Boolean)
  if (!ids.length) return ''
  if (ids.length <= 2) return ids.join(', ')
  return `${ids[0]}, ${ids[1]} and ${ids.length - 2} more`
}

export default function HelpAssistant() {
  const { profile, org } = useAuth()
  const [records, setRecords] = useState([])
  const [plans, setPlans] = useState([])

  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [roaming, setRoaming] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const charRef = useRef(null)
  const scrollRef = useRef(null)
  const drag = useRef({ startX: 0, offset: 0, moved: false })
  const roam = useRef({ x: 0, dir: -1 })

  useEffect(() => {
    if (!org?.id) return undefined
    const a = subscribeAuditFindings(org.id, setRecords)
    const b = subscribeAuditPlans(org.id, setPlans)
    return () => { a && a(); b && b() }
  }, [org?.id])

  const firstName = profile?.name?.split(' ')[0] || 'there'

  const stats = useMemo(() => {
    const all = []
    records.forEach((r) => (r.findings || []).forEach((f) => all.push({ ...f, _status: r.status })))
    const openF = all.filter((f) => f._status !== 'Closed')
    const byType = (t) => openF.filter((f) => f.type === t).length
    const pendingResp = all.filter((f) => f._status === 'Reported' && f.response?.status !== 'Completed')
    const now = Date.now()
    const overdueCapa = all.filter(
      (f) => f.response?.status === 'Completed' && f._status !== 'Closed' && f.response.targetDate && new Date(f.response.targetDate).getTime() < now,
    )
    const doneKeys = new Set(records.map((r) => `${r.taskDetails?.planId}_${r.taskDetails?.area}_${r.taskDetails?.auditee}`))
    let plannedPending = 0
    plans.forEach((p) => (p.matrix || []).forEach((row) => {
      if (!doneKeys.has(`${p.docId}_${row.area}_${row.auditee}`)) plannedPending++
    }))
    const closureRate = all.length ? Math.round((all.filter((f) => f._status === 'Closed').length / all.length) * 100) : 0
    return {
      all, openF, byType, pendingResp, overdueCapa, plannedPending, closureRate,
      total: records.length,
      reported: records.filter((r) => r.status === 'Reported').length,
      inVerif: records.filter((r) => r.status === 'Submitted for Verification').length,
      closed: records.filter((r) => r.status === 'Closed').length,
    }
  }, [records, plans])

  const attentionCount = stats.openF.length + stats.plannedPending

  function answer(intent) {
    const s = stats
    if (intent === 'status')
      return `Across the program: ${s.total} audit${s.total === 1 ? '' : 's'} — ${s.reported} reported, ${s.inVerif} in verification, ${s.closed} closed. There ${s.openF.length === 1 ? 'is' : 'are'} ${s.openF.length} open finding${s.openF.length === 1 ? '' : 's'} (closure rate ${s.closureRate}%).`
    if (intent === 'attention') {
      const lines = ['Here’s where to focus:']
      let i = 1
      if (s.openF.length) lines.push(`${i++}) ${s.openF.length} open finding(s) to drive to closure: ${sample(s.openF, 'id')}.`)
      if (s.pendingResp.length) lines.push(`${i++}) ${s.pendingResp.length} finding(s) awaiting an auditee CAPA: ${sample(s.pendingResp, 'id')}.`)
      if (s.overdueCapa.length) lines.push(`${i++}) ${s.overdueCapa.length} CAPA(s) overdue past target date.`)
      if (s.plannedPending) lines.push(`${i++}) ${s.plannedPending} planned audit task(s) not yet executed.`)
      if (lines.length === 1) lines.push('Nothing needs attention right now — all findings are closed. 🎉')
      return lines.join('\n')
    }
    if (intent === 'findings')
      return s.openF.length
        ? `There ${s.openF.length === 1 ? 'is' : 'are'} ${s.openF.length} open finding(s) — ${s.byType('Major NC')} major, ${s.byType('Minor NC')} minor, ${s.byType('Observation') + s.byType('OFI')} observation/OFI. IDs: ${sample(s.openF, 'id')}.`
        : 'No open findings — every finding is closed. 🎉'
    if (intent === 'capa') {
      const withCapa = s.all.filter((f) => f.response?.status === 'Completed').length
      return `${withCapa} corrective action(s) on record. ${s.overdueCapa.length} overdue, ${s.pendingResp.length} finding(s) still awaiting a CAPA from the auditee.`
    }
    if (intent === 'summary')
      return `Summary: ${s.total} audit(s) logged, ${s.openF.length} open finding(s), ${s.overdueCapa.length} overdue CAPA(s), ${s.plannedPending} planned task(s) pending. Closure rate is ${s.closureRate}%.`
    if (intent === 'help')
      return 'I can summarise your audits, tell you what needs attention, count open findings, or track CAPAs. Tap a chip below or just ask.'
    return 'I’m not sure about that one yet. Try “what needs attention?”, “how many open findings?”, or “give me a summary”.'
  }

  function route(text) {
    const q = text.toLowerCase()
    if (/attention|focus|priorit|urgent/.test(q)) return 'attention'
    if (/summary|overview|recap|doing/.test(q)) return 'summary'
    if (/capa|corrective|overdue|remediat/.test(q)) return 'capa'
    if (/finding|nonconform|\bnc\b|observation/.test(q)) return 'findings'
    if (/status|today|progress/.test(q)) return 'status'
    if (/help|how do|what can you|hello|\bhi\b/.test(q)) return 'help'
    return 'default'
  }

  const ask = (label, intent) => {
    const reply = answer(intent)
    setMessages((m) => [...m, { role: 'user', text: label }])
    setTyping(true)
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: 'sam', text: reply }])
      setTyping(false)
    }, 420)
  }

  const send = (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    ask(text, route(text))
  }

  const openPanel = () => {
    if (messages.length === 0) {
      setMessages([
        { role: 'sam', text: `Hi ${firstName}! I’m Sam, your audit assistant — I read your live audit data.` },
        { role: 'sam', text: `This hub runs the ISO 45001 lifecycle: plan in the Scheduler, raise findings in the Auditor Workplace, respond with CAPA in the Auditee Workplace, then verify in Reports.` },
        { role: 'sam', text: attentionCount ? `🔎 ${attentionCount} item(s) need attention. Ask me “what needs attention?”.` : 'Everything looks clear right now. 🎉' },
      ])
    }
    setOpen(true)
  }

  // autoscroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing, open])

  // initial position (bottom-right)
  useEffect(() => {
    roam.current.x = window.innerWidth - 88
    if (charRef.current) charRef.current.style.left = `${roam.current.x}px`
  }, [])

  // roam loop — walk left/right along the bottom when roaming and panel closed
  const moving = roaming && !open && !dragging && !hidden
  useEffect(() => {
    if (!moving) return undefined
    let raf = 0
    let last = 0
    const step = (t) => {
      if (!last) last = t
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const st = roam.current
      st.x += st.dir * 42 * dt
      const min = 8
      const max = window.innerWidth - 80
      if (st.x < min) { st.x = min; st.dir = 1 }
      if (st.x > max) { st.x = max; st.dir = -1 }
      if (charRef.current) {
        charRef.current.style.left = `${st.x}px`
        const inner = charRef.current.firstChild
        if (inner) inner.style.transform = `scaleX(${st.dir > 0 ? -1 : 1})`
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [moving])

  // drag to reposition / pin
  const onPointerDown = (e) => {
    const rect = charRef.current.getBoundingClientRect()
    drag.current = { startX: e.clientX, offset: e.clientX - rect.left, moved: false }
    setDragging(true)
    charRef.current.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    if (Math.abs(e.clientX - drag.current.startX) > 4) drag.current.moved = true
    const x = Math.max(8, Math.min(window.innerWidth - 80, e.clientX - drag.current.offset))
    roam.current.x = x
    if (charRef.current) charRef.current.style.left = `${x}px`
  }
  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (drag.current.moved) setRoaming(false) // pinned
    else openPanel() // tap → open
  }

  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-brand transition active:scale-95 hover:bg-brand-700 print:hidden"
      >
        <span className="grid h-6 w-6 place-items-center"><Officer className="h-6 w-6" /></span>
        Ask Sam
      </button>
    )
  }

  return (
    <>
      {open && (
        <div className="assist-panel fixed bottom-24 right-4 z-50 flex max-h-[calc(100dvh-7rem)] w-[330px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl print:hidden">
          {/* header */}
          <div className="flex items-center justify-between bg-auth-panel px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/10">
                <Officer className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Sam — Audit Bot</p>
                <p className="text-[10px] text-slate-300">Insights from your live audits</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-slate-50/60 px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-100'}`}>
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <p className="sam-typing rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100">
                  <span /><span /><span />
                </p>
              </div>
            )}
          </div>

          {/* quick replies */}
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-3 pt-2.5">
            {QUICK.map(([label, intent]) => (
              <button key={label} onClick={() => ask(label, intent)} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700">
                {label}
              </button>
            ))}
          </div>

          {/* input */}
          <form onSubmit={send} className="flex items-center gap-2 px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your audits…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-ink-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
            />
            <button type="submit" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white transition active:scale-95 hover:bg-brand-700" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* footer toggles */}
          <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-500">
            <button onClick={() => setRoaming((v) => !v)} className="inline-flex items-center gap-1.5 transition hover:text-brand-600">
              <Move className="h-3.5 w-3.5" />
              {roaming ? 'Drag Sam to pin him' : 'Let Sam roam'}
            </button>
            <button onClick={() => { setHidden(true); setOpen(false) }} className="inline-flex items-center gap-1.5 transition hover:text-brand-600">
              <EyeOff className="h-3.5 w-3.5" /> Hide
            </button>
          </div>
        </div>
      )}

      {/* the character */}
      <button
        ref={charRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ left: 0 }}
        className={`fixed bottom-2 z-40 touch-none select-none ${roaming ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} print:hidden`}
        aria-label="Audit assistant Sam"
      >
        <span className={`block drop-shadow-lg ${moving ? 'sam-walking' : 'assist-char'}`}>
          <Officer className="h-[84px] w-[64px]" />
        </span>
        {attentionCount > 0 && (
          <span className="pointer-events-none absolute -right-1 top-1 grid min-w-[22px] place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white ring-2 ring-white">
            {attentionCount > 99 ? '99+' : attentionCount}
          </span>
        )}
      </button>
    </>
  )
}
