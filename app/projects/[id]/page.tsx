'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export const dynamic = 'force-dynamic'

export default function ProjectDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) router.push('/dashboard')
      else setProject(data)
      setLoading(false)
    }
    fetchProject()
  }, [id, router])

  if (loading) return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
    </main>
  )

  const steps = [
    { id: 'forgeinsight', label: 'ForgeInsight', desc: 'Market research, PRD & launch plan', status: 'ready', href: `/tools/forgeinsight?projectId=${id}` },
    { id: 'challengeidea', label: 'Challenge My Idea', desc: 'Contrarian validation & risk analysis', status: 'ready', href: `/tools/challengeidea` },
    { id: 'zeroday', label: 'Zero-Day Explainer', desc: 'Bug analysis, fix & verification', status: 'ready', href: `/tools/zerodayexplainer?projectId=${id}` },
    { id: 'engage', label: 'EngageOS', desc: 'User retention engine', status: 'waitlist', href: '#' },
  ]

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-blue-400 transition-colors uppercase">
              ⚒ ForgeLabs
            </Link>
            <ThemeToggle />
          </div>
          <div className="font-mono-j text-xs text-slate-500 dark:text-gray-500 tracking-widest uppercase">
             PROJECT ID: {id?.toString().slice(0,8)}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-14">
        <div className="mb-14">
           <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500/50" />
              <span className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase">Project Profile</span>
           </div>
           <h1 className="font-raj font-bold text-5xl md:text-6xl tracking-tight leading-none mb-4">{project.name}</h1>
           <p className="max-w-2xl text-slate-500 dark:text-gray-500 font-mono-j text-xs leading-relaxed">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2">
              <h2 className="font-raj font-bold text-2xl mb-8 tracking-wide uppercase">Available Tools</h2>
              <div className="space-y-4">
                 {steps.map((step, i) => (
                    <div key={step.id} className={`premium-card p-6 rounded-xl`}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="font-mono-j text-lg text-slate-300 dark:text-gray-800 font-black">0{i+1}</div>
                             <div>
                                <h3 className={`font-raj font-bold text-xl ${step.status === 'waitlist' ? 'text-slate-500 dark:text-gray-600' : 'text-slate-900 dark:text-foreground'}`}>{step.label}</h3>
                                <p className="text-slate-500 dark:text-gray-500 text-xs font-mono-j">{step.desc}</p>
                             </div>
                          </div>
                          {step.status === 'waitlist' ? (
                             <span className="font-mono-j text-xs text-slate-400 dark:text-gray-700 tracking-widest uppercase">LOCKED</span>
                          ) : (
                             <Link href={step.href} className="px-6 py-2 bg-slate-200 dark:bg-card shadow-sm hover:bg-blue-600 text-slate-900 dark:text-foreground font-mono-j text-xs tracking-widest rounded transition-all uppercase">
                                Launch Module
                             </Link>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-6 rounded-xl border border-slate-300 dark:border-white/6 bg-white/[0.02]">
                 <h3 className="font-raj font-bold text-lg mb-4 tracking-wide">Project Status</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="font-mono-j text-xs text-slate-500 dark:text-gray-600 uppercase">Phase</span>
                       <span className="font-mono-j text-xs text-emerald-400 uppercase">{project.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-mono-j text-xs text-slate-500 dark:text-gray-600 uppercase">Pipeline Runs</span>
                       <span className="font-mono-j text-xs text-slate-900 dark:text-foreground">04</span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <button className="w-full py-3 border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded font-mono-j text-xs text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-foreground hover:border-white/20 transition-all uppercase">
                       Archive Project
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  )
}