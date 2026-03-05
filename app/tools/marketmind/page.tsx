'use client'
import { useState } from 'react'

export default function MarketMind() {
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [monetization, setMonetization] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/marketmind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, audience, monetization })
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

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'competitors', label: 'COMPETITORS' },
    { id: 'moscow', label: 'MoSCoW' },
    { id: 'launch', label: 'LAUNCH PLAN' },
  ]

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
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #050508 inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.06] px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-blue-400 transition-colors duration-200 uppercase">
            ⚒ ForgeLabs
          </a>
          <a href="/dashboard" className="font-mono-j text-[10px] text-gray-400 hover:text-white transition-colors duration-200 tracking-[0.15em] uppercase flex items-center gap-2">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-blue-500/50" />
            <span className="font-mono-j text-[10px] text-blue-400/70 tracking-[0.35em] uppercase">Product Research Module</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-md"
              style={{
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60a5fa',
                boxShadow: '0 0 15px rgba(59,130,246,0.15)',
              }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="font-raj font-bold text-5xl tracking-tight">MarketMind</h1>
          </div>
          <p className="font-mono-j text-xs text-gray-400 tracking-wide">
            2-step AI pipeline · Competitor analysis · MoSCoW PRD · 30-day launch plan
          </p>
        </div>

        {/* Input Panel */}
        <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="relative rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(59,130,246,0.2)',
              background: 'rgba(255,255,255,0.02)',
              boxShadow: '0 0 40px rgba(59,130,246,0.05)',
            }}>

            <div className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)' }} />

            <div className="absolute top-3 left-3 w-3 h-3"
              style={{ borderTop: '1px solid rgba(59,130,246,0.5)', borderLeft: '1px solid rgba(59,130,246,0.5)' }} />
            <div className="absolute bottom-3 right-3 w-3 h-3"
              style={{ borderBottom: '1px solid rgba(59,130,246,0.5)', borderRight: '1px solid rgba(59,130,246,0.5)' }} />

            <div className="p-7">
              <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-6">// INPUT PARAMETERS</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'SAAS IDEA', placeholder: 'e.g. AI tool for dog walkers', value: idea, setter: setIdea },
                  { label: 'TARGET AUDIENCE', placeholder: 'e.g. freelance dog walkers in US', value: audience, setter: setAudience },
                  { label: 'MONETIZATION', placeholder: 'e.g. subscription, freemium', value: monetization, setter: setMonetization },
                ].map(field => (
                  <div key={field.label}>
                    <label className="font-mono-j text-[9px] text-gray-400 tracking-[0.25em] uppercase mb-2 block">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200 font-mono-j rounded-md"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                    />
                  </div>
                ))}
              </div>

              {loading && (
                <div className="flex items-center gap-6 mb-5">
                  {['Analyzing market', 'Identifying gaps', 'Generating PRD'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        style={{ animation: `pulse-dot 1s ease ${i * 0.3}s infinite` }} />
                      <span className="font-mono-j text-[9px] text-gray-400 tracking-[0.15em]">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !idea}
                className="w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase transition-all duration-200 rounded-md"
                style={{
                  background: loading || !idea ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,1)',
                  color: loading || !idea ? 'rgba(255,255,255,0.5)' : 'white',
                  cursor: loading || !idea ? 'not-allowed' : 'pointer',
                  boxShadow: !loading && idea ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
                }}>
                {loading ? 'Running Pipeline...' : 'Generate Research Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="fade-up">
            <div className="relative rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(59,130,246,0.2)',
                background: 'rgba(255,255,255,0.02)',
              }}>

              <div className="h-px w-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)' }} />

              <div className="absolute top-3 left-3 w-3 h-3"
                style={{ borderTop: '1px solid rgba(59,130,246,0.5)', borderLeft: '1px solid rgba(59,130,246,0.5)' }} />
              <div className="absolute bottom-3 right-3 w-3 h-3"
                style={{ borderBottom: '1px solid rgba(59,130,246,0.5)', borderRight: '1px solid rgba(59,130,246,0.5)' }} />

              <div className="p-7">
                <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-5">// RESEARCH OUTPUT</p>

                {/* Tabs */}
                <div className="flex gap-1 mb-7 p-1 rounded-lg w-fit"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className="px-4 py-2 rounded-md font-mono-j text-[9px] tracking-[0.15em] transition-all duration-200"
                      style={{
                        background: activeTab === tab.id ? 'rgba(59,130,246,0.25)' : 'transparent',
                        color: activeTab === tab.id ? '#93c5fd' : '#6b7280',
                        border: activeTab === tab.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                      }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">MARKET SUMMARY</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.research.market_summary}</p>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">MARKET GAP</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.research.market_gap}</p>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">TARGET PERSONAS</p>
                      <div className="space-y-2">
                        {result.research.target_personas.map((p: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className="font-mono-j text-[9px] text-blue-400/50 mt-0.5 shrink-0">0{i+1}</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="font-mono-j text-[9px] text-red-400/60 tracking-[0.3em] uppercase mb-3">RISK MATRIX</p>
                      <div className="space-y-2">
                        {result.research.risks.map((r: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-md"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="text-[9px] px-2 py-0.5 rounded font-mono-j tracking-wide shrink-0"
                              style={{
                                background: r.severity === 'High' ? 'rgba(239,68,68,0.12)' : r.severity === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                                color: r.severity === 'High' ? '#f87171' : r.severity === 'Medium' ? '#fbbf24' : '#34d399',
                                border: `1px solid ${r.severity === 'High' ? 'rgba(239,68,68,0.25)' : r.severity === 'Medium' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                              }}>
                              {r.severity}
                            </span>
                            <span className="text-gray-300 text-sm">{r.risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitors */}
                {activeTab === 'competitors' && (
                  <div className="space-y-4">
                    <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-4">COMPETITOR ANALYSIS</p>
                    {result.research.competitors.map((c: any, i: number) => (
                      <div key={i} className="p-5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-raj font-bold text-xl text-white tracking-wide">{c.name}</h3>
                          <span className="font-mono-j text-[9px] text-blue-300 tracking-wide">{c.pricing}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-mono-j text-[9px] text-yellow-400/70 tracking-[0.2em] shrink-0 mt-0.5">WEAKNESS</span>
                          <p className="text-gray-300 text-sm">{c.weakness}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MoSCoW */}
                {activeTab === 'moscow' && (
                  <div>
                    <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-6">FEATURE PRIORITIZATION</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {Object.entries(result.prd.moscow).map(([key, items]: [string, any]) => {
                        const config: any = {
                          must_have: { label: 'MUST HAVE', color: '#f87171', rgb: '248,113,113' },
                          should_have: { label: 'SHOULD HAVE', color: '#fbbf24', rgb: '251,191,36' },
                          could_have: { label: 'COULD HAVE', color: '#34d399', rgb: '52,211,153' },
                          wont_have: { label: "WON'T HAVE", color: '#9ca3af', rgb: '156,163,175' },
                        }
                        const c = config[key]
                        return (
                          <div key={key} className="p-5 rounded-lg"
                            style={{
                              background: `rgba(${c.rgb},0.04)`,
                              border: `1px solid rgba(${c.rgb},0.15)`,
                            }}>
                            <p className="font-mono-j text-[9px] tracking-[0.25em] mb-4" style={{ color: c.color }}>
                              {c.label}
                            </p>
                            <ul className="space-y-2">
                              {items.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <span style={{ color: c.color }} className="mt-1 shrink-0 text-xs">›</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-5 p-4 rounded-lg flex items-center justify-between"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                      <span className="font-mono-j text-[9px] text-blue-400/70 tracking-[0.2em]">TECH COMPLEXITY SCORE</span>
                      <span className="font-raj font-bold text-2xl text-blue-300">{result.prd.tech_complexity_score}<span className="text-sm text-gray-500">/10</span></span>
                    </div>
                  </div>
                )}

                {/* Launch */}
                {activeTab === 'launch' && (
                  <div className="space-y-6">
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">MVP SCOPE</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.prd.mvp_scope}</p>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">MONETIZATION STRATEGY</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.prd.monetization_strategy}</p>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="font-mono-j text-[9px] text-blue-400/60 tracking-[0.3em] uppercase mb-3">30-DAY ACTION PLAN</p>
                      <div className="space-y-3">
                        {result.prd.launch_plan_30_days.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-3 rounded-md"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="font-mono-j text-[9px] text-blue-400/50 shrink-0 mt-0.5 w-5">
                              {String(i+1).padStart(2,'0')}
                            </span>
                            <span className="text-gray-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}