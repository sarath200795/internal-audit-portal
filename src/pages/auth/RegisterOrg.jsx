import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, MapPin, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { createOrganization } from '../../services/orgs'
import { friendlyAuthError } from '../../lib/authErrors'

export default function RegisterOrg() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    orgName: '',
    location: '',
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createOrganization(form)
      navigate('/')
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        You become the admin
      </span>
      <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-800">
        Create organization
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Set up your company workspace. The first account is the administrator and
        approves teammates.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Organization name"
            name="orgName"
            icon={Building2}
            placeholder="Acme Industries"
            value={form.orgName}
            onChange={set('orgName')}
            required
          />
          <Input
            label="Location / Address"
            name="location"
            icon={MapPin}
            placeholder="City, Country"
            value={form.location}
            onChange={set('location')}
          />
        </div>
        <Input
          label="Your name (admin)"
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
          Create organization
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="link-accent">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
