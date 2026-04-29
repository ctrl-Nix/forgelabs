'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

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
    <main className="min-h-screen bg-[#050508] flex items-center justify-center">
       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
    </main>
  )

  const steps = [
    { id: 'marketmind', label: 'Inception', desc: 'Market research & PRD', status: 'ready', href: `/tools/marketmind?projectId=${id}` },
    { id: 'zeroday', label: 'Engineering', desc: 'Bug analysis & fix', status: 'ready', href: `/tools/zerodayexplainer?projectId=${id}` },
    { id: 'engage', label: 'Growth', desc: 'User retention engine', status: 'waitlist', href: '#' },
  ]

  return (
    <main className="min-h-screen bg-[#050508] text-white">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.04] px-8 py-4 bg-[#050508]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-blue-400 transition-colors uppercase">
            ⚒ ForgeOS
          </Link>
          <div className="font-mono-j text-[10px] text-gray-500 tracking-widest uppercase">
             PROJECT ID: {id?.toString().slice(0,8)}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-14">
        <div className="mb-14">
           <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500/50" />
              <span className="font-mono-j text-[10px] text-blue-500/60 tracking-[0.35em] uppercase">Project Profile</span>
           </div>
           <h1 className="font-raj font-bold text-5xl md:text-6xl tracking-tight leading-none mb-4">{project.name}</h1>
           <p className="max-w-2xl text-gray-500 font-mono-j text-xs leading-relaxed">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2">
              <h2 className="font-raj font-bold text-2xl mb-8 tracking-wide uppercase">Implementation Sequence</h2>
              <div className="space-y-4">
                 {steps.map((step, i) => (
                    <div key={step.id} className={`relative p-6 rounded-xl border ${step.status === 'waitlist' ? 'border-white/[0.02] bg-white/[0.01]' : 'border-white/[0.06] bg-white/[0.02] hover:border-blue-500/30'} transition-all group`}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="font-mono-j text-lg text-gray-800 font-black">0{i+1}</div>
                             <div>
                                <h3 className={`font-raj font-bold text-xl ${step.status === 'waitlist' ? 'text-gray-600' : 'text-white'}`}>{step.label}</h3>
                                <p className="text-gray-500 text-xs font-mono-j">{step.desc}</p>
                             </div>
                          </div>
                          {step.status === 'waitlist' ? (
                             <span className="font-mono-j text-[8px] text-gray-700 tracking-widest uppercase">LOCKED</span>
                          ) : (
                             <Link href={step.href} className="px-6 py-2 bg-white/5 hover:bg-blue-600 text-white font-mono-j text-[9px] tracking-widest rounded transition-all uppercase">
                                Launch Module
                             </Link>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                 <h3 className="font-raj font-bold text-lg mb-4 tracking-wide">Project Status</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="font-mono-j text-[9px] text-gray-600 uppercase">Phase</span>
                       <span className="font-mono-j text-[9px] text-emerald-400 uppercase">{project.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="font-mono-j text-[9px] text-gray-600 uppercase">Intelligence Runs</span>
                       <span className="font-mono-j text-[9px] text-white">04</span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <button className="w-full py-3 border border-white/10 rounded font-mono-j text-[9px] text-gray-500 hover:text-white hover:border-white/20 transition-all uppercase">
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
