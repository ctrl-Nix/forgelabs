'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [mounted, setMounted] = useState(false)
  const [typed, setTyped] = useState('')

  const fullText = 'Modular AI Product Engineering Suite'

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(interval)
    }, 42)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 600

    const particles: {
      x: number; y: number
      vx: number; vy: number
      baseX: number; baseY: number
      size: number
      opacity: number
      baseOpacity: number
      orbitAngle: number
      orbitSpeed: number
    }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const op = Math.random() * 0.45 + 0.08
      particles.push({
        x, y, baseX: x, baseY: y,
        vx: 0, vy: 0,
        size: Math.random() * 1.4 + 0.25,
        opacity: op, baseOpacity: op,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.018,
      })
    }

    let animId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current

      particles.forEach(p => {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        const pullRadius = 340
        const minDist = 22

        if (dist < pullRadius && dist > minDist) {
          const nf = Math.pow(1 - dist / pullRadius, 1.8) * 0.5
          p.vx += (dx / dist) * nf * 1.75
          p.vy += (dy / dist) * nf * 1.75
          p.orbitAngle += p.orbitSpeed
          const tx = -dy / dist, ty = dx / dist
          const swirl = Math.pow(1 - dist / pullRadius, 2) * 0.14
          p.vx += tx * swirl
          p.vy += ty * swirl
          p.opacity = Math.min(0.95, p.baseOpacity + (1 - dist / pullRadius) * 0.55)
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.04
        }

        if (dist <= minDist) {
          p.vx -= (dx / dist) * 0.7
          p.vy -= (dy / dist) * 0.7
        }

        p.vx += (p.baseX - p.x) * 0.0038
        p.vy += (p.baseY - p.y) * 0.0038
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210, 220, 238, ${p.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < i + 5; j++) {
          if (j >= particles.length) break
          const p1 = particles[i], p2 = particles[j]
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (d < 72) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(180, 200, 225, ${0.065 * (1 - d / 72)})`
            ctx.lineWidth = 0.35
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    transition: `opacity 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const slideUp = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(90px)',
    transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const isTypingDone = typed.length >= fullText.length

  return (
    <main className="relative min-h-screen bg-[#050507] text-white overflow-hidden flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
      `}</style>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(3,3,6,0.94) 100%)' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.012) 40%, rgba(255,255,255,0.012) 60%, transparent)',
          animation: 'scanline 12s linear infinite',
          animationDelay: '3s',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto select-none w-full">

        {/* Badge */}
        <div style={fadeUp(0.1)} className="mb-10">
          <div className="inline-flex items-center gap-2.5 border border-white/[0.07] bg-white/[0.025] rounded-full px-4 py-1.5 text-[9px] text-white/28 tracking-[0.3em] uppercase font-medium">
            <span className="w-1 h-1 bg-emerald-400/60 rounded-full"
              style={{ boxShadow: '0 0 5px rgba(52,211,153,0.5)' }} />
            System Online · v1.0
          </div>
        </div>

        {/* FORGE LABS — overflow visible so cursor isn't clipped */}
        <div style={{ ...slideUp(0.2), paddingBottom: '0.15em' }}>
          <h1
            className="font-black tracking-[-0.05em] leading-[0.85] mb-0"
            style={{
              fontSize: 'clamp(3.8rem, 11vw, 9rem)',
              lineHeight: 1,
            }}
          >
            <span className="text-white/88">FORGE</span>
            <span style={{
              background: 'linear-gradient(135deg, #d1d5db 0%, #6b7280 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '0.18em',
            }}>LABS</span>
          </h1>

          {/* Blinking line — sits on its own row, flush left under the S */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.18em' }}>
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '0.55em',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '1.5px',
                animation: 'blink 1.1s step-end infinite',
                fontSize: 'clamp(3.8rem, 11vw, 9rem)',
              }}
            />
          </div>
        </div>

        {/* Typewriter subtitle */}
        <div style={{ ...fadeUp(0.42), minHeight: '1.8rem' }} className="mt-5 mb-1 flex items-center justify-center gap-3">
          <div className="h-px w-8" style={{ background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <p className="text-white/28 text-[10px] tracking-[0.32em] uppercase font-light font-mono">
            {typed}
            {!isTypingDone && (
              <span style={{ animation: 'blink 0.65s step-end infinite' }}>▌</span>
            )}
          </p>
          <div className="h-px w-8" style={{ background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
        </div>

        {/* Separator */}
        <div style={fadeUp(0.58)} className="mt-8 mb-8 flex justify-center">
          <div className="h-px w-24"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
        </div>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap" style={fadeUp(0.68)}>
          <Link href="/login"
            className="group px-8 py-3 bg-white text-[#050507] font-bold rounded-sm text-[10px] tracking-[0.22em] uppercase"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span className="flex items-center gap-2">
              Launch App
              <span className="group-hover:translate-x-0.5 inline-block"
                style={{ transition: 'transform 0.2s ease' }}>→</span>
            </span>
          </Link>
          <Link href="/dashboard"
            className="px-8 py-3 border border-white/10 text-white/32 font-bold rounded-sm text-[10px] tracking-[0.22em] uppercase"
            style={{ transition: 'all 0.2s ease', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-16 justify-center mt-16" style={fadeUp(0.84)}>
          {[
            { value: '2', label: 'AI Tools' },
            { value: '2-Step', label: 'Pipeline' },
            { value: '∞', label: 'Scale' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {i > 0 && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-px h-4 bg-white/8" />
              )}
              <div className="text-lg font-black text-white/55 mb-1 tabular-nums tracking-tight">{stat.value}</div>
              <div className="text-[8px] text-white/16 uppercase tracking-[0.35em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, transparent)' }} />
        <div className="flex justify-between items-center px-8 py-4" style={fadeUp(1.0)}>
          <span className="text-[8px] text-white/12 tracking-[0.3em] uppercase">Forge Labs</span>
          <span className="text-[8px] text-white/10 tracking-[0.25em] uppercase">Research · Build · Ship · Repeat</span>
          <span className="text-[8px] text-white/12 tracking-[0.3em] uppercase">© 2025</span>
        </div>
      </div>
    </main>
  )
}