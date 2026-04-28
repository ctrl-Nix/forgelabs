'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SetupGuide() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [credits, setCredits] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('FORGE_USER_API_KEY')
    if (stored) setApiKey(stored)

    fetch('/api/credits')
      .then(r => r.json())
      .then(d => { if (!d.error) setCredits(d) })
      .catch(() => {})
  }, [])

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('FORGE_USER_API_KEY', apiKey.trim())
    } else {
      localStorage.removeItem('FORGE_USER_API_KEY')
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const clearKey = () => {
    localStorage.removeItem('FORGE_USER_API_KEY')
    setApiKey('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const hasKey = !!apiKey.trim()

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; opacity: 0; }
      `}</style>

      <nav className="border-b border-white/[0.04] px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-raj font-bold text-lg tracking-widest text-white hover:text-blue-400 transition-colors uppercase">
            ⚒ ForgeOS
          </Link>
          <Link href="/dashboard" className="font-mono-j text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
            ← Back to Control
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="mb-14 fade-up">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-blue-500/50" />
            <span className="font-mono-j text-[10px] text-blue-500/60 tracking-[0.35em] uppercase">System Configuration</span>
          </div>
          <h1 className="font-raj font-bold text-5xl mb-4 tracking-tight">Intelligence Engine</h1>
          <p className="text-gray-500 font-mono-j text-xs leading-relaxed max-w-2xl">
            ForgeOS gives you <strong className="text-white">3 free intelligence runs</strong> on our infrastructure.
            After that, bring your own Gemini API key to continue for free — forever.
          </p>
        </div>

        {/* Credit Status Panel */}
        <div className="fade-up mb-12 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="font-mono-j text-[9px] text-gray-500 tracking-widest uppercase mb-3">Free Credits</div>
            <div className="flex items-end gap-2">
              <span className="font-raj font-bold text-4xl text-blue-400">
                {credits ? credits.freeCredits.remaining : '—'}
              </span>
              <span className="font-mono-j text-[10px] text-gray-600 mb-1">/ {credits ? credits.freeCredits.total : '3'}</span>
            </div>
            <div className="mt-3 w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: credits ? `${((credits.freeCredits.total - credits.freeCredits.used) / credits.freeCredits.total) * 100}%` : '100%',
                  background: credits && credits.freeCredits.remaining === 0 ? '#ef4444' : '#3b82f6'
                }}
              />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="font-mono-j text-[9px] text-gray-500 tracking-widest uppercase mb-3">API Key Status</div>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${hasKey ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
              <span className="font-raj font-bold text-lg">
                {hasKey ? 'Connected' : 'Not Set'}
              </span>
            </div>
            <p className="font-mono-j text-[9px] text-gray-600 mt-2">
              {hasKey ? 'Using your personal Gemini key' : 'Using ForgeOS free credits'}
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="font-mono-j text-[9px] text-gray-500 tracking-widest uppercase mb-3">Total Runs</div>
            <span className="font-raj font-bold text-4xl text-white/80">
              {credits ? credits.totalRuns : '—'}
            </span>
            <p className="font-mono-j text-[9px] text-gray-600 mt-2">
              Tier: <span className="text-blue-400 uppercase">{credits?.tier || 'loading'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Manual */}
          <div className="space-y-8">
            <section>
              <h2 className="font-raj font-bold text-xl mb-6 text-blue-400 uppercase tracking-wide">How to Get Your Key (Free)</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Google's Gemini 2.5 Flash is <strong className="text-white">completely free</strong> for individual developers
                (up to 15 requests/min, 1500/day). Here's how to activate it:
              </p>
              <ol className="space-y-5">
                {[
                  { step: 'Open Google AI Studio', desc: 'Navigate to aistudio.google.com', link: 'https://aistudio.google.com' },
                  { step: 'Sign In with Google', desc: 'Any standard Gmail account works. No credit card needed.' },
                  { step: 'Click "Get API Key"', desc: 'Located in the left sidebar. Takes 10 seconds.' },
                  { step: 'Create a New Key', desc: 'Click "Create API Key" → select any project → copy the key.' },
                  { step: 'Paste Below', desc: 'Paste the key in the Injection Port on the right. Done.' },
                ].map((s, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono-j text-xs text-blue-400 font-bold group-hover:bg-blue-500/20 transition-colors">
                      {i+1}
                    </div>
                    <div className="text-sm pt-1">
                      <strong className="block text-white mb-0.5">{s.step}</strong>
                      <span className="text-gray-500">{s.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="p-5 rounded-lg border border-emerald-500/10 bg-emerald-500/5">
              <div className="font-mono-j text-[9px] text-emerald-400 tracking-widest uppercase mb-2">Why This is Safe</div>
              <ul className="text-[11px] text-gray-400 space-y-1.5 leading-relaxed">
                <li>• Your key is stored <strong className="text-white">only</strong> in your browser's localStorage</li>
                <li>• It is sent directly to Google's API — we never store or log it</li>
                <li>• You can revoke it anytime from Google AI Studio</li>
                <li>• ForgeOS has zero access to your Google account</li>
              </ul>
            </div>

            <div className="p-5 rounded-lg border border-amber-500/10 bg-amber-500/5">
              <div className="font-mono-j text-[9px] text-amber-400 tracking-widest uppercase mb-2">Without a Key</div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                You get <strong className="text-white">3 free runs</strong> powered by ForgeOS infrastructure. 
                After that, you'll need to add your own key. No subscriptions, no payments — just a free API key from Google.
              </p>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            <div className="p-8 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <h3 className="font-raj font-bold text-xl mb-6 uppercase tracking-wide">Injection Port</h3>
              <div className="space-y-6">
                <div>
                  <label className="font-mono-j text-[9px] text-gray-500 uppercase tracking-widest mb-2 block">Gemini API Key</label>
                  <div className="relative">
                    <input 
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-3 font-mono-j text-xs outline-none focus:border-blue-500/50 transition-all pr-16"
                    />
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-j text-[8px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <button 
                  onClick={saveKey}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-[10px] tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-900/20">
                  {saved ? '✓ SAVED SUCCESSFULLY' : hasKey ? 'UPDATE KEY' : 'SAVE TO BROWSER'}
                </button>
                {hasKey && (
                  <button 
                    onClick={clearKey}
                    className="w-full py-3 border border-red-500/20 hover:border-red-500/40 text-red-400/60 hover:text-red-400 font-mono-j text-[9px] rounded transition-all uppercase tracking-widest">
                    Remove Key & Revert to Free Credits
                  </button>
                )}
              </div>
            </div>

            {/* Quick Link */}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
              className="block p-6 rounded-xl border border-blue-500/10 hover:border-blue-500/30 bg-blue-500/5 transition-all group text-center">
              <div className="font-raj font-bold text-lg text-blue-400 group-hover:text-blue-300 transition-colors mb-1">
                Open Google AI Studio →
              </div>
              <div className="font-mono-j text-[9px] text-gray-600">
                aistudio.google.com/apikey
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
