'use client'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'

export default function ChallengeMyIdea() {
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [monetization, setMonetization] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [creditError, setCreditError] = useState<any>(null)

  const handleSubmit = async () => {
    if (!idea || !audience || !monetization) return
    setLoading(true)
    setResult(null)
    setCreditError(null)

    try {
      const userKey = localStorage.getItem('FORGE_USER_API_KEY')
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-key': userKey || '',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      }

      const res = await fetch('/api/challengeidea', {
        method: 'POST',
        headers,
        body: JSON.stringify({ idea, audience, monetization })
      })

      const data = await res.json()
      if (res.status === 429 && data.needsKey) {
        setCreditError(data)
        return
      }
      if (data.error) {
        alert('Error: ' + data.error)
        return
      }
      setResult(data)

      // Only fire celebratory confetti if verdict is positive
      if (data.honest_verdict === 'Build it') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#f59e0b', '#fbbf24', '#ffffff'] })
      }
    } catch (err) {
      alert('Failed to run analysis')
    } finally {
      setLoading(false)
    }
  }

  const verdictColor = (v: string) => {
    if (v === 'Build it') return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' }
    if (v === 'Pivot first') return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500' }
    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500' }
  }

  const severityColor = (s: string) => {
    if (s === 'Critical') return 'text-red-500 bg-red-500/10 border-red-500/20'
    if (s === 'High') return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
        .verdict-glow-red { box-shadow: 0 0 40px rgba(239,68,68,0.15); }
        .verdict-glow-amber { box-shadow: 0 0 40px rgba(245,158,11,0.15); }
        .verdict-glow-green { box-shadow: 0 0 40px rgba(34,197,94,0.15); }
      `}</style>

      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-red-400 transition-colors duration-200 uppercase">
              ⚒ ForgeLabs
            </Link>
            <ThemeToggle />
          </div>
          <Link href="/dashboard" className="font-mono-j text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-foreground transition-colors duration-200 tracking-[0.15em] uppercase flex items-center gap-2">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-red-500/50" />
            <span className="font-mono-j text-xs text-red-400/70 tracking-widest uppercase">Autonomous Contrarian Agent</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                <path d="M12 8V12"/>
                <path d="M12 16H12.01"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">Challenge My Idea</h1>
          </div>
          <p className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-wide">
            The honest critic no AI tool is willing to be. Find holes before the market does.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="premium-card rounded-xl overflow-hidden p-7">
            <p className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase mb-6">// INPUT — be specific for brutal accuracy</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'YOUR IDEA', placeholder: 'e.g. AI tool for dog walkers', value: idea, setter: setIdea },
                { label: 'TARGET AUDIENCE', placeholder: 'e.g. freelance dog walkers', value: audience, setter: setAudience },
                { label: 'MONETIZATION', placeholder: 'e.g. $19/mo subscription', value: monetization, setter: setMonetization },
              ].map(field => (
                <div key={field.label}>
                  <label className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-wider uppercase mb-2 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-red-500/50"
                  />
                </div>
              ))}
            </div>

            <button
              id="challenge-submit-btn"
              onClick={handleSubmit}
              disabled={loading || !idea || !audience || !monetization}
              className="w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase rounded-md disabled:opacity-50 transition-all duration-200 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Weaknesses...
                </span>
              ) : 'Challenge This Idea →'}
            </button>

            {creditError && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <p className="font-mono-j text-xs text-red-400">{creditError.error}</p>
                <Link href="/dashboard/setup" className="font-mono-j text-xs text-red-400 underline mt-1 block">Add your API key →</Link>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Verdict Hero */}
              {(() => {
                const vc = verdictColor(result.honest_verdict)
                const glowClass = result.honest_verdict === 'Kill it' ? 'verdict-glow-red' : result.honest_verdict === 'Pivot first' ? 'verdict-glow-amber' : 'verdict-glow-green'
                return (
                  <div id="verdict-section" className={`premium-card rounded-xl p-8 border ${vc.border} ${glowClass}`}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className={`shrink-0 w-32 h-32 rounded-2xl ${vc.bg} border ${vc.border} flex flex-col items-center justify-center`}>
                        <span className={`font-mono-j text-[10px] tracking-widest uppercase mb-2 ${vc.text}`}>VERDICT</span>
                        <span className={`font-raj font-bold text-center text-lg leading-tight ${vc.text}`}>{result.honest_verdict}</span>
                        {result.survival_probability && (
                          <span className={`font-mono-j text-2xl font-bold mt-1 ${vc.text}`}>{result.survival_probability}<span className="text-sm">/10</span></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-mono-j text-[10px] tracking-widest uppercase mb-3 ${vc.text}`}>HONEST ASSESSMENT</p>
                        <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{result.verdict_reasoning}</p>
                        {result.biggest_assumption && (
                          <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                            <p className="font-mono-j text-[10px] text-slate-500 uppercase tracking-widest mb-1">BIGGEST UNPROVEN ASSUMPTION</p>
                            <p className="text-sm text-slate-600 dark:text-gray-300">{result.biggest_assumption}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Fatal Flaws */}
              {result.fatal_flaws?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card rounded-xl p-7">
                  <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                    <span className="text-red-500">01</span> Fatal Flaws
                  </h2>
                  <div className="space-y-4">
                    {result.fatal_flaws.map((f: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-mono-j text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest ${severityColor(f.severity)}`}>{f.severity}</span>
                          <p className="font-raj font-bold text-sm">{f.flaw}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{f.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Competitor Threats */}
              {result.competitor_threats?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card rounded-xl p-7">
                  <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                    <span className="text-red-500">02</span> Competitor Threats
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.competitor_threats.map((c: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-raj font-bold text-base">{c.name}</h3>
                          <span className="font-mono-j text-[10px] text-red-500/70 uppercase">{c.market_share}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{c.why_dangerous}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* The two-column bottom section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Steelman Case */}
                {result.steelman_case && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card rounded-xl p-7">
                    <h2 className="font-raj font-bold text-xl mb-4 flex items-center gap-3">
                      <span className="text-amber-500">03</span> Best Case For It
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{result.steelman_case}</p>
                  </motion.div>
                )}

                {/* Pivot Suggestions */}
                {result.pivot_suggestions?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="premium-card rounded-xl p-7">
                    <h2 className="font-raj font-bold text-xl mb-4 flex items-center gap-3">
                      <span className="text-amber-500">04</span> Pivot Suggestions
                    </h2>
                    <div className="space-y-4">
                      {result.pivot_suggestions.map((p: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <p className="font-raj font-bold text-sm text-amber-600 dark:text-amber-400 mb-1">{p.pivot}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">{p.why_better}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
