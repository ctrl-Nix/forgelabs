'use client'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

export const dynamic = 'force-dynamic'

type Status = 'idle' | 'loading' | 'done'

function ForgeInsightContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [monetization, setMonetization] = useState('')
  
  const [marketResult, setMarketResult] = useState<any>(null)
  const [prdResult, setPrdResult] = useState<any>(null)
  const [launchResult, setLaunchResult] = useState<any>(null)
  
  const [step1Status, setStep1Status] = useState<Status>('idle')
  const [step2Status, setStep2Status] = useState<Status>('idle')
  const [step3Status, setStep3Status] = useState<Status>('idle')

  const [creditError, setCreditError] = useState<any>(null)

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
        
      if (error) {
        console.error('Failed to load project:', error.message)
      } else if (data) {
        setIdea(data.name)
        setAudience(data.description ? data.description.slice(0, 50) + '...' : '')
      }
    }
    
    loadProject()
  }, [projectId])

  const handleSubmit = async () => {
    if (!idea || !audience || !monetization) return
    
    // Reset state
    setMarketResult(null)
    setPrdResult(null)
    setLaunchResult(null)
    setCreditError(null)
    
    setStep1Status('loading')
    setStep2Status('idle')
    setStep3Status('idle')
    
    try {
      const userKey = localStorage.getItem('FORGE_USER_API_KEY')
      const anthropicKey = localStorage.getItem('FORGE_ANTHROPIC_KEY')
      const openAiKey = localStorage.getItem('FORGE_OPENAI_KEY')
      
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'x-user-key': userKey || '',
        'x-anthropic-key': anthropicKey || '',
        'x-openai-key': openAiKey || '',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      }

      // Step 1: Market Analysis
      const res1 = await fetch('/api/forgeinsight/market', {
        method: 'POST',
        headers,
        body: JSON.stringify({ idea, audience, monetization, projectId })
      })

      const data1 = await res1.json()
      if (res1.status === 429 && data1.needsKey) {
        setCreditError(data1)
        setStep1Status('idle')
        return
      }
      if (data1.error) {
        alert('Error: ' + data1.error)
        setStep1Status('idle')
        return
      }
      setMarketResult(data1.research)
      setStep1Status('done')

      // Step 2: MoSCoW PRD
      setStep2Status('loading')
      const res2 = await fetch('/api/forgeinsight/prd', {
        method: 'POST',
        headers,
        body: JSON.stringify({ research: data1.research })
      })

      const data2 = await res2.json()
      if (data2.error) {
        alert('Error: ' + data2.error)
        setStep2Status('idle')
        return
      }
      setPrdResult(data2.prd)
      setStep2Status('done')

      // Step 3: Launch Plan
      setStep3Status('loading')
      const res3 = await fetch('/api/forgeinsight/launch', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prd: data2.prd })
      })

      const data3 = await res3.json()
      if (data3.error) {
        alert('Error: ' + data3.error)
        setStep3Status('idle')
        return
      }
      setLaunchResult(data3.launch)
      setStep3Status('done')

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#60a5fa", "#ffffff"]
      })
    } catch (err) {
      alert('Failed to run pipeline')
      setStep1Status('idle')
      setStep2Status('idle')
      setStep3Status('idle')
    }
  }

  const isPipelineRunning = step1Status === 'loading' || step2Status === 'loading' || step3Status === 'loading'

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground pb-20">
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
            <span className="font-mono-j text-xs text-blue-400/70 tracking-widest uppercase">Autonomous Product Pipeline</span>
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
            Market Analysis → MoSCoW PRD → Launch Plan
          </p>
        </motion.div>

        <div className="mb-12">
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

            {/* Pipeline Status Indicator */}
            {(step1Status !== 'idle') && (
              <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                <StatusItem label="Market Analysis" status={step1Status} />
                <span className="text-slate-400 hidden md:inline">→</span>
                <StatusItem label="MoSCoW PRD" status={step2Status} />
                <span className="text-slate-400 hidden md:inline">→</span>
                <StatusItem label="Launch Plan" status={step3Status} />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPipelineRunning || !idea}
              className="premium-button w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase rounded-md disabled:opacity-50"
            >
              {isPipelineRunning ? 'Pipeline Running...' : 'Execute Autonomous Pipeline'}
            </button>
          </div>
        </div>

        {/* Continuous Feed Output */}
        <div className="space-y-8">
          {marketResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-xl p-7">
              <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-blue-500">01</span> Market Analysis
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-3">MARKET SUMMARY</p>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{marketResult.market_summary}</p>
                </div>
                <div>
                  <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-3">MARKET GAP</p>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{marketResult.market_gap}</p>
                </div>
                <div>
                  <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-3">COMPETITORS</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketResult.competitors.map((c: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <h3 className="font-raj font-bold text-lg mb-1">{c.name}</h3>
                        <p className="text-blue-500 font-mono-j text-[10px] mb-2 uppercase">{c.pricing}</p>
                        <p className="text-slate-600 dark:text-gray-300 text-xs">{c.weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {prdResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-xl p-7">
              <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-blue-500">02</span> MoSCoW PRD
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(prdResult.moscow).map(([key, items]: [string, any]) => (
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
            </motion.div>
          )}

          {launchResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-xl p-7">
              <h2 className="font-raj font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-blue-500">03</span> 30-Day Launch Plan
              </h2>
              <div className="space-y-4">
                {launchResult.launch_plan_30_days.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                    <span className="font-mono-j text-blue-500 text-xs w-8 shrink-0">{(i+1).toString().padStart(2,'0')}</span>
                    <p className="text-slate-600 dark:text-gray-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

function StatusItem({ label, status }: { label: string, status: Status }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
        status === 'done' ? 'bg-green-500/20 text-green-500' :
        status === 'loading' ? 'bg-blue-500/20 text-blue-500 animate-pulse' :
        'bg-slate-500/20 text-slate-500'
      }`}>
        {status === 'done' ? '✓' : status === 'loading' ? '↻' : '○'}
      </div>
      <span className={`font-mono-j text-xs uppercase ${
        status === 'done' ? 'text-green-500' :
        status === 'loading' ? 'text-blue-500' :
        'text-slate-500'
      }`}>{label}</span>
    </div>
  )
}

export default function ForgeInsight() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-mono-j text-blue-500 text-xs tracking-widest uppercase">Initializing...</div>}>
      <ForgeInsightContent />
    </Suspense>
  )
}