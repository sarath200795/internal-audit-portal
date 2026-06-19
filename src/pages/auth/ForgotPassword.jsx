import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { resetPassword } from '../../services/orgs'
import { friendlyAuthError } from '../../lib/authErrors'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h2 className="text-4xl font-extrabold tracking-tight text-ink-800">
        Reset password
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Enter your email and we’ll send you a reset link.
      </p>

      {sent ? (
        <div className="mt-8 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          If an account exists for <strong>{email}</strong>, a password reset
          email is on its way. Check your inbox and spam folder.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} iconRight={ArrowRight} className="w-full">
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-7 text-center text-sm">
        <Link to="/login" className="inline-flex items-center gap-1.5 link-accent">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  )
}
