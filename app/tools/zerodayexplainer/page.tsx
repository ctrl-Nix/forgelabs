'use client'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

export const dynamic = 'force-dynamic'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function ZeroDayExplainer() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('JavaScript')

  // Step results
  const [step1Result, setStep1Result] = useState<any>(null)
  const [step2Result, setStep2Result] = useState<any>(null)

  // Pipeline status
  const [step1Status, setStep1Status] = useState<Status>('idle')
  const [step2Status, setStep2Status] = useState<Status>('idle')
  const [step3Status, setStep3Status] = useState<Status>('idle')

  const [creditError, setCreditError] = useState<any>(null)

  const isRunning = step1Status === 'loading' || step2Status === 'loading' || step3Status === 'loading'

  const handleSubmit = async () => {
    if (!code) return

    // Reset
    setStep1Result(null)
    setStep2Result(null)
    setCreditError(null)
    setStep1Status('loading')
    setStep2Status('idle')
    setStep3Status('idle')

    try {
      const userKey = localStorage.getItem('FORGE_USER_API_KEY')
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-key': userKey || '',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      }

      // ─── STEP 1: Root Cause Analysis ─────────────────────────
      const res1 = await fetch('/api/zerodayexplainer', {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, error, language })
      })

      const data1 = await res1.json()
      if (res1.status === 429 && data1.needsKey) {
        setCreditError(data1)
        setStep1Status('idle')
        return
      }
      if (data1.error) {
        alert('Step 1 failed: ' + data1.error)
        setStep1Status('error')
        return
      }

      setStep1Result(data1)
      setStep1Status('done')

      // ─── STEP 2: Verify the Fix ──────────────────────────────
      setStep2Status('loading')
      const res2 = await fetch('/api/zerodayexplainer/verify', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          correctedCode: data1.corrected_code,
          originalError: error,
          language
        })
      })

      const data2 = await res2.json()
      if (data2.error) {
        alert('Step 2 failed: ' + data2.error)
        setStep2Status('error')
        return
      }

      setStep2Status('done')

      // ─── STEP 3: Edge Cases (included in verify response) ───
      setStep3Status('loading')
      // Step 3 data is already in data2.edgeCases from the verify route
      setStep2Result(data2)
      setStep3Status('done')

      // Confetti only if fix was confirmed
      if (data2.verification?.fix_confirmed) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#ffffff']
        })
      }

    } catch (err) {
      alert('Pipeline failed — check console')
      setStep1Status('idle')
      setStep2Status('idle')
      setStep3Status('idle')
    }
  }

  const statusColors: Record<Status, string> = {
    idle: 'bg-slate-500/20 text-slate-500',
    loading: 'bg-emerald-500/20 text-emerald-500 animate-pulse',
    done: 'bg-emerald-500/20 text-emerald-500',
    error: 'bg-red-500/20 text-red-500',
  }
  const statusIcon: Record<Status, string> = {
    idle: '○', loading: '↻', done: '✓', error: '✗'
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-emerald-400 transition-colors duration-200 uppercase">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-emerald-500/50" />
            <span className="font-mono-j text-xs text-emerald-400/70 tracking-widest uppercase">Autonomous Debugging Pipeline</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">Zero-Day Explainer</h1>
          </div>
          <p className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-wide">
            Analyze → Verify Fix → Confirm Edge Cases
          </p>
        </motion.div>

        <div className="premium-card rounded-xl p-7 mb-8">
          <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-6">// CODE ANALYSIS INPUT</p>
          <div className="space-y-4 mb-6">
            <textarea
              id="zeroday-code-input"
              placeholder="Paste broken code here..."
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-48 px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-emerald-500/50"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Error message (optional)..."
                value={error}
                onChange={e => setError(e.target.value)}
                className="w-full px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-emerald-500/50"
              />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-emerald-500/50"
              >
                {['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'C#'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pipeline Status Bar */}
          {step1Status !== 'idle' && (
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
              {[
                { label: 'Root Cause Analysis', status: step1Status },
                { label: 'Verify Fix', status: step2Status },
                { label: 'Edge Case Check', status: step3Status },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-400 hidden md:inline">→</span>}
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${statusColors[s.status]}`}>
                    {statusIcon[s.status]}
                  </div>
                  <span className={`font-mono-j text-xs uppercase ${
                    s.status === 'done' ? 'text-emerald-500' :
                    s.status === 'loading' ? 'text-emerald-400' :
                    s.status === 'error' ? 'text-red-500' : 'text-slate-500'
                  }`}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {creditError && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="font-mono-j text-xs text-red-400">{creditError.error}</p>
              <Link href="/dashboard/setup" className="font-mono-j text-xs text-red-400 underline mt-1 block">Add your API key →</Link>
            </div>
          )}

          <button
            id="zeroday-submit-btn"
            onClick={handleSubmit}
            disabled={isRunning || !code}
            className="premium-button w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase rounded-md bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 disabled:opacity-50"
          >
            {isRunning ? 'Pipeline Running...' : 'Execute Autonomous Debug Pipeline'}
          </button>
        </div>

        <AnimatePresence>
          {/* Step 1: Root Cause */}
          {step1Result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card rounded-xl p-7 mb-6"
            >
              <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-emerald-500">01</span> Root Cause Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">ROOT CAUSE</p>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{step1Result.root_cause}</p>
                  </div>
                  <div className="section-boundary" />
                  <div>
                    <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">EXPLANATION</p>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{step1Result.explanation}</p>
                  </div>
                  <div className="section-boundary" />
                  <div>
                    <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">FIXED CODE</p>
                    <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs font-mono-j overflow-x-auto">
                      <code>{step1Result.corrected_code}</code>
                    </pre>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <p className="font-mono-j text-[10px] text-emerald-500 mb-2 uppercase tracking-widest">Severity</p>
                    <p className="font-raj font-bold text-5xl text-emerald-500">{step1Result.severity}</p>
                  </div>
                  <div>
                    <p className="font-mono-j text-[10px] text-slate-500 tracking-widest uppercase mb-3">PREVENTION TIP</p>
                    <p className="text-xs text-slate-600 dark:text-gray-300">{step1Result.prevention_tip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 & 3: Verification + Edge Cases */}
          {step2Result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Verification */}
              <div className="premium-card rounded-xl p-7">
                <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="text-emerald-500">02</span> Fix Verification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg border text-center ${
                    step2Result.verification?.fix_confirmed
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}>
                    <p className="font-mono-j text-[10px] tracking-widest uppercase mb-2 text-slate-500">FIX STATUS</p>
                    <p className={`font-raj font-bold text-2xl ${step2Result.verification?.fix_confirmed ? 'text-emerald-500' : 'text-red-500'}`}>
                      {step2Result.verification?.fix_confirmed ? '✓ Confirmed' : '✗ Issues Found'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
                    <p className="font-mono-j text-[10px] tracking-widest uppercase mb-2 text-slate-500">CODE QUALITY</p>
                    <p className="font-raj font-bold text-4xl text-emerald-500">
                      {step2Result.verification?.code_quality_score}<span className="text-lg text-slate-500">/10</span>
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="font-mono-j text-[10px] tracking-widest uppercase mb-2 text-slate-500">SUMMARY</p>
                    <p className="text-xs text-slate-600 dark:text-gray-300">{step2Result.verification?.verification_summary}</p>
                  </div>
                </div>

                {step2Result.verification?.remaining_issues?.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                    <p className="font-mono-j text-[10px] text-red-500 tracking-widest uppercase mb-3">REMAINING ISSUES</p>
                    <ul className="space-y-1">
                      {step2Result.verification.remaining_issues.map((iss: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-gray-300">
                          <span className="text-red-500 mt-0.5">›</span>{iss}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Edge Cases */}
              {step2Result.edgeCases && (
                <div className="premium-card rounded-xl p-7">
                  <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                    <span className="text-emerald-500">03</span> Edge Case Analysis
                    {step2Result.edgeCases.production_ready && (
                      <span className="ml-auto font-mono-j text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                        Production Ready ✓
                      </span>
                    )}
                  </h2>
                  <div className="space-y-3 mb-6">
                    {step2Result.edgeCases.edge_cases?.map((ec: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-mono-j text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest ${
                            ec.risk === 'High' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                            ec.risk === 'Medium' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
                            'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                          }`}>{ec.risk}</span>
                          <p className="font-raj font-bold text-sm">{ec.case}</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{ec.suggestion}</p>
                      </div>
                    ))}
                  </div>
                  {step2Result.edgeCases.final_recommendation && (
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <p className="font-mono-j text-[10px] text-emerald-500 uppercase tracking-widest mb-2">FINAL RECOMMENDATION</p>
                      <p className="text-sm text-slate-600 dark:text-gray-300">{step2Result.edgeCases.final_recommendation}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}