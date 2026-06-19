import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, User, Mail, Lock, ArrowRight } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { requestAccess, subscribeOrganizations } from '../../services/orgs'
import { friendlyAuthError } from '../../lib/authErrors'

export default function Signup() {
  const navigate = useNavigate()
  const [orgs, setOrgs] = useState([])
  const [form, setForm] = useState({ orgId: '', name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = subscribeOrganizations(setOrgs)
    return unsub
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.orgId) {
      setError('Please select your organization.')
      return
    }
    setLoading(true)
    try {
      await requestAccess(form)
      navigate('/pending')
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h2 className="text-4xl font-extrabold tracking-tight text-ink-800">
        Join your team
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Select an existing organization to request access. An admin will approve
        you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Select
          label="Organization"
          name="orgId"
          icon={Building2}
          value={form.orgId}
          onChange={set('orgId')}
          required
        >
          <option value="">Select your organization…</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
              {o.location ? ` — ${o.location}` : ''}
            </option>
          ))}
        </Select>
        <Input
          label="Your name"
          name="name"
          icon={User}
          placeholder="Jordan Lee"
          value={form.name}
          onChange={set('name')}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={form.email}
          onChange={set('email')}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="At least 6 characters"
          value={form.password}
          onChange={set('password')}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} iconRight={ArrowRight} className="w-full">
          Request access
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="link-accent">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
