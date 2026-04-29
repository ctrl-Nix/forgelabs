'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await supabase.from('waitlist').insert({ email, tool_interest: 'EngageOS' })
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-900 dark:text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {!submitted ? (
          <>
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-4xl font-bold mb-3">EngageOS</h1>
            <p className="text-slate-500 dark:text-gray-400 mb-2">AI-powered user engagement suite</p>
            <p className="text-slate-500 dark:text-gray-600 text-sm mb-8">Coming soon. Join the waitlist to get early access.</p>

            <div className="bg-slate-200 dark:bg-card shadow-sm border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded-2xl p-6">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-200 dark:bg-card shadow-sm border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 mb-4 text-slate-900 dark:text-foreground placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-slate-900 dark:text-foreground py-3 rounded-lg font-medium transition"
              >
                {loading ? 'Joining...' : 'Notify Me When It Launches'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold mb-3">You're on the list!</h1>
            <p className="text-slate-500 dark:text-gray-400 mb-8">We'll notify you when EngageOS launches.</p>
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-slate-900 dark:text-foreground px-8 py-3 rounded-lg font-medium transition">
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  )
}