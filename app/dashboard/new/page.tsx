'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewVenture() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <main className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center px-6">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
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
          <h1 className="font-raj font-bold text-4xl tracking-tight mb-2">Initialize Venture</h1>
          <p className="font-mono-j text-[10px] text-gray-500 tracking-widest uppercase">Phase 0: Inception Sequence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono-j text-[9px] text-gray-400 tracking-widest uppercase mb-2 block">Venture Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3 font-mono-j text-sm outline-none focus:border-blue-500/50 transition-all"
              placeholder="e.g. Project Nova"
            />
          </div>

          <div>
            <label className="font-mono-j text-[9px] text-gray-400 tracking-widest uppercase mb-2 block">Core Thesis / Description</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3 font-mono-j text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
              placeholder="Briefly describe the market problem you're solving..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-[11px] tracking-[0.25em] uppercase transition-all shadow-lg shadow-blue-900/20">
            {loading ? 'INITIALIZING...' : 'BEGIN INCEPTION'}
          </button>
          
          <Link href="/dashboard" className="block text-center font-mono-j text-[9px] text-gray-600 hover:text-gray-400 tracking-widest uppercase mt-4">
             Abort Sequence
          </Link>
        </form>
      </div>
    </main>
  )
}
