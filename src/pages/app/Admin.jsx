import { useState } from 'react'
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  Users,
  Building2,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useOrgData } from '../../context/OrgDataContext'
import PageHeader from '../../components/PageHeader'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge, { STATUS_TONES, labelize } from '../../components/ui/Badge'
import { approveUser, rejectUser, setUserRole } from '../../services/users'
import { updateOrganization } from '../../services/orgs'
import { formatDate } from '../../lib/format'

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export default function Admin() {
  const { org, firebaseUser } = useAuth()
  const { orgId, users } = useOrgData()
  const [orgForm, setOrgForm] = useState({ name: org?.name || '', location: org?.location || '' })
  const [savingOrg, setSavingOrg] = useState(false)
  const [orgSaved, setOrgSaved] = useState(false)

  const pending = users.filter((u) => u.status === 'pending')
  const members = users.filter((u) => u.status === 'approved')

  const saveOrg = async (e) => {
    e.preventDefault()
    setSavingOrg(true)
    setOrgSaved(false)
    try {
      await updateOrganization(orgId, { name: orgForm.name, location: orgForm.location })
      setOrgSaved(true)
    } finally {
      setSavingOrg(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Admin"
        subtitle="Approve teammates, manage roles and organization settings."
      />

      {/* Pending approvals */}
      <Card className="mb-6">
        <CardHeader
          title="Pending access requests"
          subtitle="New teammates waiting for your approval."
          action={
            pending.length > 0 && (
              <Badge tone="amber">
                <Clock className="h-3 w-3" /> {pending.length} waiting
              </Badge>
            )
          }
        />
        {pending.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">
            No pending requests.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-800">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">
                      {u.email} · requested {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" icon={Check} onClick={() => approveUser(u.id)}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={X}
                    onClick={() => rejectUser(u.id)}
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Members */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Members"
            subtitle={`${members.length} approved`}
            action={<Users className="h-5 w-5 text-slate-300" />}
          />
          <ul className="divide-y divide-slate-100">
            {members.map((u) => {
              const isSelf = u.id === firebaseUser?.uid
              return (
                <li key={u.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                      {initials(u.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-800">
                        {u.name} {isSelf && <span className="text-xs text-slate-400">(you)</span>}
                      </p>
                      <p className="truncate text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={u.role === 'admin' ? 'brand' : 'slate'}>
                      {labelize(u.role)}
                    </Badge>
                    {!isSelf && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setUserRole(u.id, u.role === 'admin' ? 'member' : 'admin')
                        }
                      >
                        {u.role === 'admin' ? 'Make member' : 'Make admin'}
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Org settings */}
        <Card>
          <CardHeader title="Organization" />
          <form onSubmit={saveOrg} className="space-y-4">
            <Input
              label="Name"
              icon={Building2}
              value={orgForm.name}
              onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Location"
              icon={MapPin}
              value={orgForm.location}
              onChange={(e) => setOrgForm((f) => ({ ...f, location: e.target.value }))}
            />
            {orgSaved && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                Organization updated.
              </p>
            )}
            <Button type="submit" icon={ShieldCheck} loading={savingOrg} className="w-full">
              Save settings
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
