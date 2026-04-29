'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const tools = [
  {
    id: 'marketmind',
    name: 'MarketMind',
    description: 'Input a SaaS idea. Get competitor analysis, market gaps, target personas, and a full MoSCoW PRD in under 30 seconds.',
    category: 'Product Research',
    status: 'live',
    href: '/tools/marketmind',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    tag: '2-STEP AI PIPELINE',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: 'zerodayexplainer',
    name: 'Zero-Day Explainer',
    description: 'Paste broken code and an error message. Get root cause analysis, severity scoring, fixed code, and prevention tips.',
    category: 'Engineering',
    status: 'live',
    href: '/tools/zerodayexplainer',
    accent: '#10b981',
    accentRgb: '16,185,129',
    tag: '8 LANGUAGES',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 'engageos',
    name: 'EngageOS',
    description: 'AI-powered user engagement and retention suite. Behavioral triggers, smart nudges, and lifecycle automation.',
    category: 'Growth',
    status: 'waitlist',
    href: '/waitlist',
    accent: '#8b5cf6',
    accentRgb: '139,92,246',
    tag: 'COMING SOON',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
]


export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setChecking(false)
        fetchProjects()
      }
    })
  }, [router])


  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (!data.error) setProjects(data)
    } catch (e) {
      console.error('Failed to fetch projects')
    } finally {
      setLoadingProjects(false)
    }
  }

  if (checking) return (
    <main className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        .venture-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.04] px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-blue-400 transition-colors duration-200 uppercase">
            ⚒ ForgeOS
          </Link>
          <div className="flex items-center gap-8">
             <Link href="/dashboard/setup" className="font-mono-j text-[10px] text-blue-500/60 hover:text-blue-400 transition-colors duration-200 tracking-[0.15em] uppercase font-bold">
               Config AI
             </Link>
             <button

              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="font-mono-j text-[10px] text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-[0.15em] uppercase">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-14">

        {/* Header */}
        <div className="mb-14 fade-up flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500/50" />
              <span className="font-mono-j text-[10px] text-blue-500/60 tracking-[0.35em] uppercase">Project Control</span>
            </div>
            <h1 className="font-raj font-bold text-5xl md:text-6xl tracking-tight leading-none">
              Your Projects
            </h1>
          </div>
          
          <Link href="/dashboard/new" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-[10px] tracking-[0.22em] uppercase transition-all shadow-lg shadow-blue-900/20">
            + Create New Project
          </Link>
        </div>

        {/* Project List */}
        <div className="venture-grid mb-14">
          {loadingProjects ? (
             [1,2,3].map(i => (
               <div key={i} className="h-48 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-pulse" />
             ))
          ) : projects.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
               <p className="font-mono-j text-[10px] text-gray-600 tracking-widest uppercase mb-4">No active projects found.</p>
               <Link href="/dashboard/new" className="text-blue-400 font-mono-j text-[10px] tracking-widest uppercase hover:text-blue-300">
                  Begin Initial Sequence →
               </Link>
            </div>
          ) : (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))
          )}
        </div>

        <div className="mb-8">
           <h2 className="font-raj font-bold text-2xl tracking-wide mb-6">Standard Modules</h2>
           {/* Tool cards from original dashboard, but smaller/integrated */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {tools.filter(t => t.status === 'live').map((tool, i) => (
             <Link href={tool.href} key={tool.id}
               className="group relative p-6 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-400">{tool.icon}</div>
                  <span className="font-mono-j text-[8px] text-gray-700 tracking-widest uppercase">{tool.tag}</span>
                </div>
                <h3 className="font-raj font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{tool.description}</p>
                <div className="font-mono-j text-[8px] text-blue-500/50 group-hover:text-blue-400 transition-colors">LAUNCH MODULE →</div>
             </Link>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="fade-up mt-12" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-raj font-bold text-2xl tracking-wide">Recent System Events</h2>
            <Link href="/dashboard/history" className="font-mono-j text-[9px] text-blue-500/60 hover:text-blue-400 tracking-[0.2em] uppercase transition-colors">
              Audit Logs →
            </Link>
          </div>

          <div className="border border-white/[0.04] rounded-lg overflow-hidden bg-white/[0.01]">
            <RecentActivities />
          </div>
        </div>
      </div>
    </main>
  )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <Link href={`/projects/${project.id}`} 
      className="fade-up group relative p-7 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] hover:border-blue-500/40 transition-all"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
      
      <div className="absolute top-0 right-0 p-4">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="font-mono-j text-[8px] text-blue-500/60 tracking-[0.3em] uppercase mb-2">PHASE: {project.status?.toUpperCase() || 'INCEPTION'}</div>
        <h3 className="font-raj font-bold text-2xl text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
      </div>
      
      <p className="text-gray-500 text-xs mb-8 line-clamp-2 font-mono-j">{project.description}</p>
      
      <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]">
         <div className="flex -space-x-2">
            {[1,2].map(i => <div key={i} className="w-5 h-5 rounded-full border border-[#050508] bg-gray-800" />)}
         </div>
         <span className="font-mono-j text-[9px] text-gray-700 group-hover:text-white transition-colors">ENTER COMMAND →</span>
      </div>
    </Link>
  )
}

function RecentActivities() {

  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false })
        .limit(5)

      if (error) console.error('Error fetching activities:', error)
      else setActivities(data || [])
      setLoading(false)
    }

    fetchActivities()
  }, [])

  if (loading) return (
    <div className="p-8 text-center font-mono-j text-[10px] text-gray-700 tracking-widest uppercase">
      Scanning database...
    </div>
  )

  if (activities.length === 0) return (
    <div className="p-8 text-center font-mono-j text-[10px] text-gray-700 tracking-widest uppercase">
      No recent activity recorded.
    </div>
  )

  return (
    <div className="divide-y divide-white/[0.04]">
      {activities.map((act) => (
        <div key={act.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-md ${act.tool_id === 'marketmind' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {act.tool_id === 'marketmind' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              )}
            </div>
            <div>
              <div className="font-raj font-bold text-sm tracking-wide text-white/90">
                {act.tool_id === 'marketmind' ? 'MarketMind Research' : 'Zero-Day Bug Analysis'}
              </div>
              <div className="font-mono-j text-[9px] text-gray-600 tracking-wider">
                {new Date(act.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <Link href={`/tools/${act.tool_id}`} 
            className="font-mono-j text-[9px] text-gray-700 group-hover:text-white transition-colors tracking-widest">
            VIEW DETAILS →
          </Link>
        </div>
      ))}
    </div>
  )
}