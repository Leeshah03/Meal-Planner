'use client'

import { useState } from 'react'
import { sendMagicLink } from './actions'

export default function LoginPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await sendMagicLink(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🥗</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-green)' }}>Meal Planner</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Sign in to plan your week</p>
        </div>

        {sent ? (
          <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-green-light)' }}>
            <div className="text-2xl mb-2">📬</div>
            <p className="font-medium" style={{ color: 'var(--color-green)' }}>Check your email</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>We sent you a magic link to sign in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-muted)' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-green-500 transition-colors"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-60"
              style={{ background: 'var(--color-green)' }}
            >
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
