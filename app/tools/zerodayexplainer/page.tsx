'use client'
import { useState } from 'react'

export default function ZeroDayExplainer() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/zerodayexplainer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, error, language })
    })
    const data = await res.json()
    if (data.error) {
      alert('Error: ' + data.error)
      setLoading(false)
      return
    }
    setResult(data)
    setLoading(false)
  }

  const severityConfig: any = {
    Critical: { color: '#f87171', rgb: '248,113,113' },
    High: { color: '#fb923c', rgb: '251,146,60' },
    Medium: { color: '#fbbf24', rgb: '251,191,36' },
    Low: { color: '#34d399', rgb: '52,211,153' },
  }

  const confidenceConfig: any = {
    High: { color: '#34d399', rgb: '52,211,153' },
    Medium: { color: '#fbbf24', rgb: '251,191,36' },
    Low: { color: '#f87171', rgb: '248,113,113' },
  }

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
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #050508 inset !important;
          -webkit-text-fill-color: white !important;
        }
        select option { background: #0a0a12; color: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 2px; }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.06] px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-emerald-400 transition-colors duration-200 uppercase">
            ⚒ ForgeLabs
          </a>
          <a href="/dashboard" className="font-mono-j text-[10px] text-gray-400 hover:text-white transition-colors duration-200 tracking-[0.15em] uppercase">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-emerald-500/50" />
            <span className="font-mono-j text-[10px] text-emerald-400/70 tracking-[0.35em] uppercase">Engineering Module</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md"
              style={{
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#34d399',
                boxShadow: '0 0 15px rgba(16,185,129,0.15)',
              }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">Zero-Day Explainer</h1>
          </div>
          <p className="font-mono-j text-xs text-gray-400 tracking-wide">
            Root cause analysis · Severity scoring · Fixed code · Prevention tips
          </p>
        </div>

        {/* Input Panel */}
        <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="relative rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(16,185,129,0.2)',
              background: 'rgba(255,255,255,0.02)',
              boxShadow: '0 0 40px rgba(16,185,129,0.04)',
            }}>

            <div className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.7), transparent)' }} />

            <div className="absolute top-3 left-3 w-3 h-3"
              style={{ borderTop: '1px solid rgba(16,185,129,0.5)', borderLeft: '1px solid rgba(16,185,129,0.5)' }} />
            <div className="absolute bottom-3 right-3 w-3 h-3"
              style={{ borderBottom: '1px solid rgba(16,185,129,0.5)', borderRight: '1px solid rgba(16,185,129,0.5)' }} />

            <div className="p-7">
              <p className="font-mono-j text-[9px] text-emerald-400/60 tracking-[0.3em] uppercase mb-6">// INPUT PARAMETERS</p>

              {/* Language selector */}
              <div className="mb-4">
                <label className="font-mono-j text-[9px] text-gray-400 tracking-[0.25em] uppercase mb-2 block">
                  LANGUAGE
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200 font-mono-j rounded-md appearance-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                  onFocus={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(16,185,129,0.6)'}
                  onBlur={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  {['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'CSS'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Code input */}
              <div className="mb-4">
                <label className="font-mono-j text-[9px] text-gray-400 tracking-[0.25em] uppercase mb-2 block">
                  BROKEN CODE
                </label>
                <textarea
                  placeholder="Paste your broken code here..."
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200 font-mono-j rounded-md resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>

              {/* Error input */}
              <div className="mb-6">
                <label className="font-mono-j text-[9px] text-gray-400 tracking-[0.25em] uppercase mb-2 block">
                  ERROR MESSAGE <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Paste the error message here..."
                  value={error}
                  onChange={e => setError(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200 font-mono-j rounded-md resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e2e8f0',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>

              {loading && (
                <div className="flex items-center gap-6 mb-5">
                  {['Parsing code', 'Identifying root cause', 'Generating fix'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        style={{ animation: `pulse-dot 1s ease ${i * 0.3}s infinite` }} />
                      <span className="font-mono-j text-[9px] text-gray-400 tracking-[0.15em]">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !code}
                className="w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase transition-all duration-200 rounded-md"
                style={{
                  background: loading || !code ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,1)',
                  color: loading || !code ? 'rgba(255,255,255,0.5)' : 'white',
                  cursor: loading || !code ? 'not-allowed' : 'pointer',
                  boxShadow: !loading && code ? '0 0 20px rgba(16,185,129,0.25)' : 'none',
                }}>
                {loading ? 'Analyzing...' : 'Explain This Bug'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="fade-up space-y-4">

            {/* Badges */}
            <div className="flex gap-3">
              {result.severity && severityConfig[result.severity] && (
                <span className="font-mono-j text-[9px] px-3 py-1.5 rounded-md tracking-[0.15em]"
                  style={{
                    color: severityConfig[result.severity].color,
                    background: `rgba(${severityConfig[result.severity].rgb},0.1)`,
                    border: `1px solid rgba(${severityConfig[result.severity].rgb},0.25)`,
                  }}>
                  SEVERITY: {result.severity.toUpperCase()}
                </span>
              )}
              {result.confidence && confidenceConfig[result.confidence] && (
                <span className="font-mono-j text-[9px] px-3 py-1.5 rounded-md tracking-[0.15em]"
                  style={{
                    color: confidenceConfig[result.confidence].color,
                    background: `rgba(${confidenceConfig[result.confidence].rgb},0.1)`,
                    border: `1px solid rgba(${confidenceConfig[result.confidence].rgb},0.25)`,
                  }}>
                  CONFIDENCE: {result.confidence.toUpperCase()}
                </span>
              )}
            </div>

            {/* Root Cause */}
            <div className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.03)' }}>
              <div className="h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(248,113,113,0.5), transparent)' }} />
              <div className="p-6">
                <p className="font-mono-j text-[9px] text-red-400/60 tracking-[0.3em] uppercase mb-3">ROOT CAUSE</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.root_cause}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(251,191,36,0.15)', background: 'rgba(251,191,36,0.03)' }}>
              <div className="h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
              <div className="p-6">
                <p className="font-mono-j text-[9px] text-yellow-400/60 tracking-[0.3em] uppercase mb-3">EXPLANATION</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
              </div>
            </div>

            {/* Fixed Code */}
            <div className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(52,211,153,0.15)', background: 'rgba(5,5,8,0.8)' }}>
              <div className="h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)' }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono-j text-[9px] text-emerald-400/60 tracking-[0.3em] uppercase">FIXED CODE</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.corrected_code)}
                    className="font-mono-j text-[9px] text-gray-500 hover:text-white transition-colors tracking-[0.15em] px-3 py-1.5 rounded-md"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                    COPY
                  </button>
                </div>
                <pre className="text-emerald-300/90 text-xs font-mono-j overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {result.corrected_code}
                </pre>
              </div>
            </div>

            {/* Prevention Tip */}
            <div className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(59,130,246,0.15)', background: 'rgba(59,130,246,0.03)' }}>
              <div className="h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }} />
              <div className="p-6">
                <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">PREVENTION TIP</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.prevention_tip}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}