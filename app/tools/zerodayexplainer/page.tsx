'use client'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

export const dynamic = 'force-dynamic'

export default function ZeroDayExplainer() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [creditError, setCreditError] = useState<any>(null)

  const handleSubmit = async () => {
    if (!code) return
    setLoading(true)
    setResult(null)
    setCreditError(null)
    setProgress(0)
    
    // Simulated progress
    const timer = setInterval(() => {
        setProgress(p => (p < 90 ? p + 10 : p))
    }, 400)

    try {
      const userKey = localStorage.getItem('FORGE_USER_API_KEY')
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const res = await fetch('/api/zerodayexplainer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-key': userKey || '',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ code, error, language })
      })
      const data = await res.json()
      if (res.status === 429 && data.needsKey) {
        setCreditError(data)
        return
      }
      setResult(data)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#ffffff"]
      })
    } catch (err) {
      alert('Failed to analyze code')
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
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
            <span className="font-mono-j text-xs text-emerald-400/70 tracking-widest uppercase">Engineering Module</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">Zero-Day Explainer</h1>
          </div>
        </motion.div>

        <div className="premium-card rounded-xl p-7 mb-8">
          <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-6">// CODE ANALYSIS INPUT</p>
          <div className="space-y-4 mb-6">
            <textarea
              placeholder="Paste broken code here..."
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-48 px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-emerald-500/50"
            />
            <input
              type="text"
              placeholder="Error message (optional)..."
              value={error}
              onChange={e => setError(e.target.value)}
              className="w-full px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-emerald-500/50"
            />
          </div>

          {loading && (
            <div className="mb-6">
              <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-emerald-500" />
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !code}
            className="premium-button w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase rounded-md bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
          >
            {loading ? 'Analyzing Codebase...' : 'Execute Root Cause Analysis'}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-card rounded-xl p-7">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div>
                       <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">ROOT CAUSE</p>
                       <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{result.root_cause}</p>
                     </div>
                     <div className="section-boundary" />
                     <div>
                       <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">EXPLANATION</p>
                       <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
                     </div>
                     <div className="section-boundary" />
                     <div>
                       <p className="font-mono-j text-[10px] text-emerald-500 tracking-widest uppercase mb-3">FIXED CODE</p>
                       <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs font-mono-j overflow-x-auto">
                         <code>{result.corrected_code}</code>
                       </pre>
                     </div>
                   </div>
                   <div className="space-y-6">
                     <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                        <p className="font-mono-j text-[10px] text-emerald-500 mb-2 uppercase tracking-widest">Severity</p>
                        <p className="font-raj font-bold text-5xl text-emerald-500">{result.severity}</p>
                     </div>
                     <div>
                       <p className="font-mono-j text-[10px] text-slate-500 tracking-widest uppercase mb-3">PREVENTION TIP</p>
                       <p className="text-xs text-slate-600 dark:text-gray-300">{result.prevention_tip}</p>
                     </div>
                   </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}