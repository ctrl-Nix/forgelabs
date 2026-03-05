'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 20)
    const drops: number[] = Array(cols).fill(1)
    const chars = '01アイウエオカキクケコABCDEFGHIJKLMN'

    let animId: number
    const draw = () => {
      ctx.fillStyle = 'rgba(5,5,8,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(59,130,246,0.15)'
      ctx.font = '12px JetBrains Mono, monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y * 20)
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Account created! Signing you in...')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="relative min-h-screen bg-[#050508] text-white flex items-center justify-center overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #050508 inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>

      {/* Matrix rain canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

      {/* Center glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6 fade-up">
        {/* Back link */}
        <Link href="/" className="font-mono-j text-[10px] text-gray-600 hover:text-white transition-colors tracking-[0.2em] uppercase flex items-center gap-2 mb-8">
          ← Back to Home
        </Link>

        <div className="rounded-xl overflow-hidden"
          style={{
            border: '1px solid rgba(59,130,246,0.2)',
            background: 'rgba(5,5,8,0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(59,130,246,0.08), 0 0 80px rgba(59,130,246,0.04), inset 0 1px 0 rgba(59,130,246,0.1)',
          }}>

          {/* Top glow line */}
          <div className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)' }} />

          {/* Corner accents */}
          <div className="relative p-8">
            <div className="absolute top-4 left-4 w-3 h-3"
              style={{ borderTop: '1px solid rgba(59,130,246,0.5)', borderLeft: '1px solid rgba(59,130,246,0.5)' }} />
            <div className="absolute bottom-4 right-4 w-3 h-3"
              style={{ borderBottom: '1px solid rgba(59,130,246,0.5)', borderRight: '1px solid rgba(59,130,246,0.5)' }} />

            {/* Header */}
            <div className="text-center mb-8">
              <p className="font-mono-j text-[10px] text-blue-500/50 tracking-[0.4em] uppercase mb-3">
                // SYSTEM ACCESS
              </p>
              <h1 className="font-raj font-bold text-4xl tracking-tight mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="font-mono-j text-xs text-gray-600 tracking-wide">
                {isSignUp ? 'Join ForgeLabs' : 'Sign in to your workspace'}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="font-mono-j text-[9px] text-gray-600 tracking-[0.25em] uppercase mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-all duration-200 font-mono-j"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
              <div>
                <label className="font-mono-j text-[9px] text-gray-600 tracking-[0.25em] uppercase mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-all duration-200 font-mono-j"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Error/Success message */}
            {message && (
              <div className="mb-4 px-4 py-3 rounded-md font-mono-j text-xs tracking-wide"
                style={{
                  background: message.includes('error') || message.includes('Invalid')
                    ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                  border: message.includes('error') || message.includes('Invalid')
                    ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(16,185,129,0.2)',
                  color: message.includes('error') || message.includes('Invalid') ? '#ef4444' : '#10b981',
                }}>
                {message}
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full py-3.5 font-raj font-bold text-lg tracking-widest uppercase transition-all duration-200 rounded-md mb-6"
              style={{
                background: loading || !email || !password
                  ? 'rgba(59,130,246,0.2)'
                  : 'rgba(59,130,246,1)',
                color: loading || !email || !password ? 'rgba(255,255,255,0.3)' : 'white',
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                boxShadow: !loading && email && password ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
              }}>
              {loading ? '...' : isSignUp ? 'Create Account' : 'Enter'}
            </button>

            {/* Toggle */}
            <p className="text-center font-mono-j text-xs text-gray-600 tracking-wide">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
                className="text-blue-400 hover:text-blue-300 transition-colors">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}