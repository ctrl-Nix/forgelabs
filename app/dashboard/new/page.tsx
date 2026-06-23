'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

export default function NewVenture() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ name, description })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push('/dashboard')
    } catch (err: any) {
      alert('Failed to initialize venture: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-slate-900 dark:text-foreground flex flex-col items-center justify-center px-6">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="max-w-md w-full">
        <div className="mb-10 text-center">
          <div className="inline-block p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
             </svg>
          </div>
          <h1 className="font-raj font-bold text-4xl tracking-tight mb-2">New Project</h1>
          <p className="font-mono-j text-xs text-slate-500 dark:text-gray-500 tracking-widest uppercase">Organize your research and pipeline runs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase mb-2 block">Project Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-card shadow-sm dark:bg-white/3 border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded px-4 py-3 font-mono-j text-sm outline-none focus:border-blue-500/50 transition-all"
              placeholder="e.g. Project Nova"
            />
          </div>

          <div>
            <label className="font-mono-j text-xs text-slate-500 dark:text-gray-400 tracking-widest uppercase mb-2 block">Description</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-card shadow-sm dark:bg-white/3 border border-slate-200 dark:border-slate-200 dark:border-white/10 rounded px-4 py-3 font-mono-j text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
              placeholder="Briefly describe the market problem you're solving..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-foreground font-bold rounded-sm text-[11px] tracking-wider uppercase transition-all shadow-lg shadow-blue-900/20">
            {loading ? 'CREATING...' : 'CREATE PROJECT'}
          </button>
          
          <Link href="/dashboard" className="block text-center font-mono-j text-xs text-slate-500 dark:text-gray-600 hover:text-slate-500 dark:text-gray-400 tracking-widest uppercase mt-4">
             Cancel
          </Link>
        </form>
      </div>
    </main>
  )
}