'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export const dynamic = 'force-dynamic'

export default function HistoryPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false })

      if (error) console.error('Error fetching activities:', error)
      else setActivities(data || [])
      setLoading(false)
    }

    fetchActivities()
  }, [router])

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-blue-400 transition-colors duration-200 uppercase">
            ⚒ ForgeOS
          </Link>
          <Link href="/dashboard" className="font-mono-j text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-foreground transition-colors duration-200 tracking-[0.15em] uppercase">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="font-raj font-bold text-4xl mb-8 tracking-tight">Activity History</h1>

        {loading ? (
          <div className="text-center py-20 font-mono-j text-xs text-slate-400 dark:text-gray-700 tracking-widest uppercase">
            Fetching history...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 dark:border-white/5 rounded-lg bg-white/[0.01]">
             <p className="font-mono-j text-xs text-slate-400 dark:text-gray-700 tracking-widest uppercase">No history found.</p>
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden bg-white/[0.01] divide-y divide-white/[0.04]">
            {activities.map((act) => (
              <div key={act.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-md ${act.tool_id === 'forgeinsight' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {act.tool_id === 'forgeinsight' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-raj font-bold text-xl tracking-wide text-foreground/90 capitalize">
                      {act.tool_id.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="font-mono-j text-xs text-slate-500 dark:text-gray-500 tracking-wider">
                      {new Date(act.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                   {act.data && (
                     <button 
                      onClick={() => {
                        console.log(act.data)
                        alert('Check console for data (UI for viewing coming soon)')
                      }}
                      className="font-mono-j text-xs px-4 py-2 border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-foreground transition-all">
                      VIEW DATA
                     </button>
                   )}
                   <Link href={`/tools/${act.tool_id}`} 
                    className="font-mono-j text-xs px-4 py-2 bg-slate-200 dark:bg-card shadow-sm rounded text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:bg-white/10 transition-all tracking-widest uppercase">
                    Relaunch →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}