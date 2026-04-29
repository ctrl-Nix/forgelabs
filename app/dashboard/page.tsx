'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

const tools = [
  {
    id: 'forgeinsight',
    name: 'ForgeInsight',
    description: 'Input a SaaS idea. Get competitor analysis, market gaps, target personas, and a full MoSCoW PRD in under 30 seconds.',
    category: 'Product Research',
    status: 'live',
    href: '/tools/forgeinsight',
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

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchProjects(session.user.id)
    }
    checkUser()
  }, [router])

  const fetchProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) console.error('Error:', error)
    else setProjects(data || [])
    setLoadingProjects(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
        .venture-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }
      `}</style>

      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-blue-400 transition-colors duration-200 uppercase">
              ⚒ ForgeOS
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-6">
             <Link href="/dashboard/setup" className="font-mono-j text-xs text-slate-500 dark:text-gray-400 hover:text-blue-400 transition-colors duration-200 tracking-[0.15em] uppercase font-bold">
               Config AI
             </Link>
             <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="font-mono-j text-xs text-slate-500 dark:text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-[0.15em] uppercase">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-14 fade-up flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blue-500/50" />
              <span className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase">Project Control</span>
            </div>
            <h1 className="font-raj font-bold text-5xl md:text-6xl tracking-tight leading-none">
              Your Projects
            </h1>
          </div>
          <Link href="/dashboard/new" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-xs tracking-[0.22em] uppercase transition-all shadow-lg shadow-blue-900/20">
            + Create New Project
          </Link>
        </div>

        <div className="venture-grid mb-14">
          <AnimatePresence>
            {loadingProjects ? (
               [1,2,3].map(i => (
                 <div key={i} className="h-48 rounded-lg bg-secondary/30 border border-border animate-pulse" />
               ))
            ) : projects.length === 0 ? (
              <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-secondary/10">
                 <p className="font-mono-j text-xs text-slate-500 tracking-widest uppercase mb-4">No active projects found.</p>
                 <Link href="/dashboard/new" className="text-blue-400 font-mono-j text-xs tracking-widest uppercase hover:text-blue-300">
                    Begin Initial Sequence →
                 </Link>
              </div>
            ) : (
              projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="section-boundary" />

        <div className="mb-8 mt-12">
           <h2 className="font-raj font-bold text-2xl tracking-wide mb-6 uppercase">Standard Modules</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.filter(t => t.status === 'live').map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={tool.href} className="premium-card group relative p-6 rounded-lg block">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-500">{tool.icon}</div>
                    <span className="font-mono-j text-xs text-slate-500 tracking-widest uppercase">{tool.tag}</span>
                  </div>
                  <h3 className="font-raj font-bold text-lg mb-2">{tool.name}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">{tool.description}</p>
                  <div className="font-mono-j text-[10px] text-blue-500/50 group-hover:text-blue-500 transition-colors tracking-widest uppercase font-bold">Launch Intelligence →</div>
                </Link>
              </motion.div>
            ))}
           </div>
        </div>

        <div className="section-boundary" />

        <div className="fade-up mt-12" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-raj font-bold text-2xl tracking-wide uppercase">Recent System Events</h2>
            <Link href="/dashboard/history" className="font-mono-j text-xs text-slate-500 hover:text-blue-500 tracking-wider uppercase transition-colors">
              Audit Logs →
            </Link>
          </div>
          <div className="premium-card rounded-lg overflow-hidden">
            <RecentActivities />
          </div>
        </div>
      </div>
    </main>
  )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <Link href={`/projects/${project.id}`} className="premium-card group relative p-7 rounded-xl block">
      <div className="absolute top-4 right-4">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="font-mono-j text-[10px] text-slate-400 tracking-widest uppercase mb-2">PHASE: {project.status?.toUpperCase() || 'INCEPTION'}</div>
        <h3 className="font-raj font-bold text-2xl text-foreground group-hover:text-blue-500 transition-colors">{project.name}</h3>
      </div>
      <p className="text-slate-500 text-xs mb-8 line-clamp-2 font-mono-j">{project.description}</p>
      <div className="flex items-center justify-between pt-5 border-t border-border">
         <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary/50" />)}
         </div>
         <span className="font-mono-j text-[10px] text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest font-bold">Enter Control →</span>
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
      if (error) console.error(error)
      else setActivities(data || [])
      setLoading(false)
    }
    fetchActivities()
  }, [])

  if (loading) return <div className="p-8 text-center font-mono-j text-xs text-slate-500 animate-pulse">Loading Logs...</div>

  return (
    <div className="divide-y divide-border">
      {activities.length === 0 ? (
        <div className="p-8 text-center font-mono-j text-xs text-slate-500 italic">No recent events recorded.</div>
      ) : (
        activities.map((act) => (
          <div key={act.id} className="px-6 py-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <div className="text-xs font-mono-j text-foreground uppercase tracking-wider">{act.tool_id.replace('forgeinsight', 'ForgeInsight').replace('zerodayexplainer', 'Zero-Day Explainer')}</div>
                <div className="text-[10px] text-slate-500 font-mono-j uppercase">{new Date(act.timestamp).toLocaleString()}</div>
              </div>
            </div>
            <div className="text-[10px] font-mono-j text-emerald-500 uppercase tracking-widest">SUCCESSFUL RUN</div>
          </div>
        ))
      )}
    </div>
  )
}