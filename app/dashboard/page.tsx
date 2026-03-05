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

export default function Dashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setChecking(false)
    })
  }, [])

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
        @keyframes scanMove {
          0% { top: 0%; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          pointer-events: none;
          animation: scanMove 2s linear infinite;
        }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Top ambient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.04] px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-blue-400 transition-colors duration-200 uppercase">
            ⚒ ForgeLabs
          </Link>
          <div className="flex items-center gap-8">
            {[
              { label: 'MarketMind', href: '/tools/marketmind' },
              { label: 'Zero-Day', href: '/tools/zerodayexplainer' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="font-mono-j text-[10px] text-gray-600 hover:text-white transition-colors duration-200 tracking-[0.15em] uppercase">
                {item.label}
              </Link>
            ))}
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="font-mono-j text-[10px] text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-[0.15em] uppercase">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-14">

        {/* Header with description */}
        <div className="mb-14 fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-blue-500/50" />
            <span className="font-mono-j text-[10px] text-blue-500/60 tracking-[0.35em] uppercase">Command Center</span>
          </div>
          <h1 className="font-raj font-bold text-5xl md:text-6xl tracking-tight leading-none mb-5">
            Select Your Module
          </h1>
          {/* Description block */}
          <div className="max-w-2xl border-l-2 border-blue-500/20 pl-5 space-y-1.5">
            <p className="font-mono-j text-xs text-gray-500 tracking-wide leading-relaxed">
              ForgeLabs is a modular AI engineering suite built for early-stage product teams.
            </p>
            <p className="font-mono-j text-xs text-gray-600 tracking-wide leading-relaxed">
              Each module is an independent AI agent — plug in your idea, get structured, actionable output.
            </p>
            <p className="font-mono-j text-xs text-gray-700 tracking-wide leading-relaxed">
              No fluff. No hallucinations dressed as insight. Just engineered outputs.
            </p>
          </div>
          <p className="font-mono-j text-xs text-gray-700 tracking-[0.1em] mt-5">
            3 modules · 2 operational · 1 incoming
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {tools.map((tool, i) => {
            const isHovered = hovered === tool.id
            return (
              <Link href={tool.href} key={tool.id}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                className="fade-up block"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="relative h-full rounded-lg overflow-hidden"
                  style={{
                    border: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.5)` : 'rgba(255,255,255,0.06)'}`,
                    background: isHovered
                      ? `linear-gradient(145deg, rgba(${tool.accentRgb},0.08) 0%, #050508 100%)`
                      : 'rgba(255,255,255,0.02)',
                    boxShadow: isHovered
                      ? `0 0 30px rgba(${tool.accentRgb},0.15), 0 0 60px rgba(${tool.accentRgb},0.08), 0 0 100px rgba(${tool.accentRgb},0.04), inset 0 0 30px rgba(${tool.accentRgb},0.04)`
                      : 'none',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>

                  {/* Scanline effect on hover */}
                  {isHovered && (
                    <div className="scan-line"
                      style={{ background: `linear-gradient(90deg, transparent, rgba(${tool.accentRgb},0.4), transparent)` }} />
                  )}

                  {/* Top glow line */}
                  <div className="absolute top-0 left-0 right-0 h-px transition-all duration-300"
                    style={{
                      background: isHovered
                        ? `linear-gradient(90deg, transparent, rgba(${tool.accentRgb},1), transparent)`
                        : 'transparent',
                      boxShadow: isHovered ? `0 0 10px rgba(${tool.accentRgb},1), 0 0 20px rgba(${tool.accentRgb},0.5)` : 'none',
                    }} />

                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-3 h-3 transition-all duration-300"
                    style={{
                      borderTop: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.8)` : 'rgba(255,255,255,0.08)'}`,
                      borderLeft: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.8)` : 'rgba(255,255,255,0.08)'}`,
                    }} />
                  <div className="absolute bottom-3 right-3 w-3 h-3 transition-all duration-300"
                    style={{
                      borderBottom: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.8)` : 'rgba(255,255,255,0.08)'}`,
                      borderRight: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.8)` : 'rgba(255,255,255,0.08)'}`,
                    }} />

                  <div className="p-7">
                    {/* Icon + status */}
                    <div className="flex items-start justify-between mb-7">
                      <div className="p-2.5 rounded-md transition-all duration-300"
                        style={{
                          background: isHovered ? `rgba(${tool.accentRgb},0.12)` : 'rgba(255,255,255,0.04)',
                          color: isHovered ? tool.accent : '#374151',
                          border: `1px solid ${isHovered ? `rgba(${tool.accentRgb},0.3)` : 'rgba(255,255,255,0.06)'}`,
                          boxShadow: isHovered ? `0 0 15px rgba(${tool.accentRgb},0.25)` : 'none',
                        }}>
                        {tool.icon}
                      </div>
                      <span className="font-mono-j text-[9px] px-2.5 py-1 rounded-sm tracking-[0.15em]"
                        style={{
                          color: tool.status === 'live' ? '#10b981' : '#8b5cf6',
                          background: tool.status === 'live' ? 'rgba(16,185,129,0.07)' : 'rgba(139,92,246,0.07)',
                          border: `1px solid ${tool.status === 'live' ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)'}`,
                        }}>
                        {tool.status === 'live' ? '● LIVE' : '○ SOON'}
                      </span>
                    </div>

                    {/* Name */}
                    <h2 className="font-raj font-bold text-2xl mb-3 tracking-wide transition-colors duration-300"
                      style={{ color: isHovered ? tool.accent : 'white' }}>
                      {tool.name}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 font-light">
                      {tool.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                      <span className="font-mono-j text-[9px] text-gray-700 tracking-[0.2em] uppercase">
                        {tool.category}
                      </span>
                      <span className="font-mono-j text-[9px] tracking-[0.15em] transition-colors duration-300"
                        style={{ color: isHovered ? tool.accent : '#1f2937' }}>
                        {tool.tag} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Stats bar */}
        <div className="fade-up border border-white/[0.04] rounded-lg overflow-hidden"
          style={{ animationDelay: '0.4s' }}>
          <div className="flex divide-x divide-white/[0.04]">
            {[
              { label: 'TOOLS LIVE', value: '02' },
              { label: 'AI PIPELINE', value: '2-STEP' },
              { label: 'LANGUAGES', value: '08' },
              { label: 'MODULES INCOMING', value: '01' },
            ].map(s => (
              <div key={s.label} className="flex-1 text-center py-5 px-4 hover:bg-white/[0.02] transition-colors duration-200">
                <div className="font-raj font-bold text-2xl text-blue-400 mb-1 tabular-nums">{s.value}</div>
                <div className="font-mono-j text-[9px] text-gray-700 tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}