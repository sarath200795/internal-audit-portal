import { Loader2 } from 'lucide-react'

export default function Spinner({ className = 'h-6 w-6' }) {
  return <Loader2 className={`animate-spin text-brand-500 ${className}`} />
}

export function FullPageSpinner() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100/70">
      <Spinner className="h-8 w-8" />
    </div>
  )
}
