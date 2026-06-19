import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Wrench,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useOrgData } from '../../context/OrgDataContext'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge, { SEVERITY_TONES, STATUS_TONES, labelize } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, isOverdue, toDate } from '../../lib/format'

export default function Dashboard() {
  const { profile } = useAuth()
  const { findings, capas, audits, siteById } = useOrgData()

  const openFindings = findings.filter((f) => f.status !== 'closed')
  const overdueCapas = capas.filter(
    (c) => c.status !== 'closed' && isOverdue(c.dueDate),
  )
  const closedFindings = findings.filter((f) => f.status === 'closed')
  const closureRate = findings.length
    ? Math.round((closedFindings.length / findings.length) * 100)
    : 0

  const now = Date.now()
  const upcoming = audits
    .filter((a) => a.status !== 'completed')
    .filter((a) => {
      const d = toDate(a.scheduledDate)
      return d ? d.getTime() >= now - 1000 * 60 * 60 * 24 : true
    })
    .slice(0, 5)

  const recent = [...findings]
    .sort((a, b) => (toDate(b.raisedAt)?.getTime() || 0) - (toDate(a.raisedAt)?.getTime() || 0))
    .slice(0, 5)

  const sevCounts = ['major', 'minor', 'observation'].map((sev) => ({
    sev,
    count: openFindings.filter((f) => f.severity === sev).length,
  }))
  const sevMax = Math.max(1, ...sevCounts.map((s) => s.count))

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile?.name?.split(' ')[0] || ''}`.trim()}
        subtitle="Here’s where your audit program stands today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open findings"
          value={openFindings.length}
          icon={AlertTriangle}
          tone="red"
        />
        <StatCard
          label="Overdue CAPAs"
          value={overdueCapas.length}
          icon={Wrench}
          tone="amber"
        />
        <StatCard
          label="Audits in progress"
          value={audits.filter((a) => a.status !== 'completed').length}
          icon={ClipboardCheck}
          tone="brand"
          hint={`${audits.length} total`}
        />
        <StatCard
          label="Closure rate"
          value={`${closureRate}%`}
          icon={CheckCircle2}
          tone="green"
          hint={`${closedFindings.length}/${findings.length} closed`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent findings */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent findings"
            action={
              <Link to="/findings" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                View all
              </Link>
            }
          />
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No findings raised yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((f) => (
                <li key={f.id}>
                  <Link
                    to={`/findings/${f.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-800">
                        {f.description || 'Untitled finding'}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {siteById[f.siteId]?.name || 'Unassigned site'} · Clause{' '}
                        {f.clause || '—'} · {formatDate(f.raisedAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={SEVERITY_TONES[f.severity]}>
                        {labelize(f.severity)}
                      </Badge>
                      <Badge tone={STATUS_TONES[f.status]}>
                        {labelize(f.status)}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Severity breakdown */}
        <Card>
          <CardHeader title="Open by severity" />
          <div className="space-y-4">
            {sevCounts.map(({ sev, count }) => (
              <div key={sev}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium capitalize text-slate-600">
                    {sev}
                  </span>
                  <span className="font-bold text-ink-800">{count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      sev === 'major'
                        ? 'bg-rose-400'
                        : sev === 'minor'
                          ? 'bg-amber-400'
                          : 'bg-sky-400'
                    }`}
                    style={{ width: `${(count / sevMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming audits */}
      <Card className="mt-6">
        <CardHeader
          title="Upcoming & active audits"
          action={
            <Link to="/audits" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Open scheduler
            </Link>
          }
        />
        {upcoming.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No audits scheduled"
            message="Plan your first ISO 45001 audit from the Audits page."
            action={
              <Link
                to="/audits"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand"
              >
                Go to Audits <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {upcoming.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/audits/${a.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {a.title}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {siteById[a.siteId]?.name || 'Unassigned site'} ·{' '}
                      {formatDate(a.scheduledDate)}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONES[a.status]}>{labelize(a.status)}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
