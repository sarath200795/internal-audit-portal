import { useState } from 'react'
import { Building2, MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import { useOrgData } from '../../context/OrgDataContext'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { createSite, updateSite, deleteSite } from '../../services/sites'

export default function Sites() {
  const { orgId, sites, audits } = useOrgData()
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null) // null | {id?, name, location}
  const [saving, setSaving] = useState(false)

  const openNew = () => setModal({ name: '', location: '' })
  const openEdit = (s) => setModal({ id: s.id, name: s.name, location: s.location || '' })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal.id) {
        await updateSite(orgId, modal.id, { name: modal.name, location: modal.location })
      } else {
        await createSite(orgId, { name: modal.name, location: modal.location })
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (s) => {
    const auditCount = audits.filter((a) => a.siteId === s.id).length
    const msg = auditCount
      ? `Delete "${s.name}"? ${auditCount} audit(s) reference this site.`
      : `Delete "${s.name}"?`
    if (window.confirm(msg)) await deleteSite(orgId, s.id)
  }

  return (
    <div>
      <PageHeader
        title="Sites"
        subtitle="Locations covered by your audit program."
        action={
          isAdmin && (
            <Button icon={Plus} onClick={openNew}>
              Add site
            </Button>
          )
        }
      />

      {sites.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No sites yet"
          message={
            isAdmin
              ? 'Add your facilities so you can schedule audits against them.'
              : 'An administrator hasn’t added any sites yet.'
          }
          action={
            isAdmin && (
              <Button icon={Plus} onClick={openNew}>
                Add your first site
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => {
            const auditCount = audits.filter((a) => a.siteId === s.id).length
            return (
              <Card key={s.id} className="flex flex-col">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Building2 className="h-5 w-5" />
                  </span>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Edit site"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(s)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Delete site"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-ink-800">{s.name}</h3>
                {s.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {s.location}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-400">
                  {auditCount} audit{auditCount === 1 ? '' : 's'}
                </p>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.id ? 'Edit site' : 'Add site'}
      >
        {modal && (
          <form onSubmit={save} className="space-y-5">
            <Input
              label="Site name"
              icon={Building2}
              placeholder="Plant A — Assembly"
              value={modal.name}
              onChange={(e) => setModal((m) => ({ ...m, name: e.target.value }))}
              required
              autoFocus
            />
            <Input
              label="Location"
              icon={MapPin}
              placeholder="City, Country"
              value={modal.location}
              onChange={(e) => setModal((m) => ({ ...m, location: e.target.value }))}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {modal.id ? 'Save changes' : 'Add site'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
