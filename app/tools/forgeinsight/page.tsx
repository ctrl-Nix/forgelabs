'use client'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { supabase } from '../../lib/supabase'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'

function ForgeInsightContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [monetization, setMonetization] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (projectId) {
      supabase.from('projects').select('*').eq('id', projectId).single()
        .then(({ data }) => {
          if (data) {
            setIdea(data.name)
            setAudience(data.description.slice(0, 50) + '...')
          }
        })
    }
  }, [projectId])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + Math.random() * 5 : prev))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [loading])

  const [creditError, setCreditError] = useState<any>(null)

  const handleSubmit = async () => {
    if (!idea || !audience || !monetization) return
    setLoading(true)
    setResult(null)
    setCreditError(null)
    try {
      const userKey = localStorage.getItem('FORGE_USER_API_KEY')
      const res = await fetch('/api/forgeinsight', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-key': userKey || '' 
        },
        body: JSON.stringify({ idea, audience, monetization, projectId })
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
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#60a5fa", "#ffffff"]
      })
    } catch (err) {
      alert('Failed to run pipeline')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    const text = JSON.stringify(result.prd, null, 2)
    navigator.clipboard.writeText(text)
    alert('PRD copied to clipboard!')
  }

  const downloadPDF = () => {
    if (!result) return
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.text('ForgeLabs Market Research Report', 20, 20)
    doc.setFontSize(14)
    doc.text(`Idea: ${idea}`, 20, 35)
    doc.text(`Audience: ${audience}`, 20, 45)
    doc.text(`Monetization: ${monetization}`, 20, 55)
    doc.setFontSize(16)
    doc.text('Market Summary', 20, 75)
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(result.research.market_summary, 170)
    doc.text(splitSummary, 20, 85)
    doc.addPage()
    doc.setFontSize(16)
    doc.text('MoSCoW Prioritization', 20, 20)
    let y = 30
    Object.entries(result.prd.moscow).forEach(([key, items]: [string, any]) => {
      doc.setFontSize(12)
      doc.text(key.toUpperCase().replace('_', ' '), 20, y)
      y += 7
      doc.setFontSize(10)
      items.forEach((item: string) => {
        doc.text(`- ${item}`, 25, y)
        y += 5
      })
      y += 5
    })
    doc.save(`ForgeLabs_${idea.replace(/\s+/g, '_')}.pdf`)
  }

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'competitors', label: 'COMPETITORS' },
    { id: 'moscow', label: 'MoSCoW' },
    { id: 'launch', label: 'LAUNCH PLAN' },
  ]

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-blue-400 transition-colors duration-200 uppercase">
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
            <div className="w-6 h-px bg-blue-500/50" />
            <span className="font-mono-j text-xs text-blue-400/70 tracking-widest uppercase">Product Research Module</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">ForgeInsight</h1>
          </div>
          <p className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-wide">
            2-step AI pipeline · Competitor analysis · MoSCoW PRD · 30-day launch plan
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="premium-card rounded-xl overflow-hidden p-7">
            <p className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase mb-6">// INPUT PARAMETERS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'SAAS IDEA', placeholder: 'e.g. AI tool for dog walkers', value: idea, setter: setIdea },
                { label: 'TARGET AUDIENCE', placeholder: 'e.g. freelance dog walkers', value: audience, setter: setAudience },
                { label: 'MONETIZATION', placeholder: 'e.g. subscription', value: monetization, setter: setMonetization },
              ].map(field => (
                <div key={field.label}>
                  <label className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-wider uppercase mb-2 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-foreground bg-secondary/50 border border-border outline-none transition-all duration-200 font-mono-j rounded-md focus:border-blue-500/50"
                  />
                </div>
              ))}
            </div>

            {loading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-j text-[10px] text-blue-500 tracking-widest uppercase">Analyzing Intelligence...</span>
                  <span className="font-mono-j text-[10px] text-blue-500">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-blue-500/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-500" 
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !idea}
              className="premium-button w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase rounded-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Generate Research Report'}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card rounded-xl overflow-hidden p-7"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
                <div className="flex gap-1 p-1 rounded-lg bg-secondary/50 border border-border w-fit">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-md font-mono-j text-xs tracking-[0.15em] transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : 'text-slate-500 hover:text-foreground'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={copyToClipboard} className="px-4 py-2 rounded-md font-mono-j text-xs tracking-[0.15em] border border-border text-slate-500 hover:text-foreground transition-all">COPY JSON</button>
                  <button onClick={downloadPDF} className="px-4 py-2 rounded-md font-mono-j text-xs tracking-[0.15em] bg-blue-600 text-white hover:bg-blue-500 transition-all">PDF REPORT</button>
                </div>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-3">MARKET SUMMARY</p>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{result.research.market_summary}</p>
                    </div>
                    <div className="section-boundary" />
                    <div>
                      <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-3">MARKET GAP</p>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{result.research.market_gap}</p>
                    </div>
                  </div>
                )}
                {/* Other tabs follow same pattern */}
                {activeTab === 'competitors' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.research.competitors.map((c: any, i: number) => (
                      <div key={i} className="p-5 rounded-lg bg-secondary/30 border border-border">
                        <h3 className="font-raj font-bold text-xl mb-1">{c.name}</h3>
                        <p className="text-blue-500 font-mono-j text-[10px] mb-3 uppercase">{c.pricing}</p>
                        <p className="text-slate-600 dark:text-gray-300 text-xs">{c.weakness}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'moscow' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {Object.entries(result.prd.moscow).map(([key, items]: [string, any]) => (
                        <div key={key} className="p-5 rounded-lg bg-secondary/30 border border-border">
                          <p className="font-mono-j text-[10px] text-blue-500 tracking-wider mb-4 uppercase">{key.replace('_', ' ')}</p>
                          <ul className="space-y-2">
                            {items.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-gray-300">
                                <span className="text-blue-500 mt-1 shrink-0">›</span>{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                   </div>
                )}
                {activeTab === 'launch' && (
                   <div className="space-y-6">
                      {result.prd.launch_plan_30_days.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                          <span className="font-mono-j text-blue-500 text-xs w-8 shrink-0">{(i+1).toString().padStart(2,'0')}</span>
                          <p className="text-slate-600 dark:text-gray-300 text-xs">{item}</p>
                        </div>
                      ))}
                   </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

import Link from 'next/link'

export default function ForgeInsight() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-mono-j text-blue-500 text-xs tracking-widest uppercase">Initializing...</div>}>
      <ForgeInsightContent />
    </Suspense>
  )
}