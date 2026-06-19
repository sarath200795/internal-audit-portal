import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Brand from '../../components/Brand'
import LegalFooter from '../../components/LegalFooter'

/**
 * Renders a legal/policy document from structured `sections`.
 * Each section: { heading, paragraphs?: string[], bullets?: string[] }
 */
export default function LegalLayout({ title, lastUpdated, intro, sections, closing }) {
  return (
    <div className="min-h-screen bg-slate-100/70">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Brand tone="dark" to="/login" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-6 py-10"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-800">
          {title}
        </h1>
        {lastUpdated && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Last updated {lastUpdated}
          </p>
        )}
        {intro && <p className="mt-5 leading-relaxed text-slate-600">{intro}</p>}

        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-lg font-bold text-ink-800">
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mt-2 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 space-y-2">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2.5 text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {closing && (
          <p className="mt-10 rounded-xl bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500">
            {closing}
          </p>
        )}

        <div className="mt-10 border-t border-slate-200 pt-6">
          <LegalFooter tone="light" />
        </div>
      </motion.main>
    </div>
  )
}

export const CLOSING_NOTE =
  'This document is a general template provided for convenience and does not constitute legal advice. WE EHS recommends review by qualified counsel before relying on it.'
