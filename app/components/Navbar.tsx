'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="relative z-20 border-b border-white/[0.04] px-8 py-4 bg-[#050508]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Rajdhani', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-white hover:text-blue-400 transition-colors duration-200 uppercase">
          ⚒ ForgeLabs
        </Link>
        <div className="flex items-center gap-8">
          {[
            { label: 'MarketMind', href: '/tools/marketmind' },
            { label: 'Zero-Day', href: '/tools/zerodayexplainer' },
            { label: 'History', href: '/dashboard/history' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="font-mono-j text-[10px] text-gray-600 hover:text-white transition-colors duration-200 tracking-[0.15em] uppercase">
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="font-mono-j text-[10px] text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-[0.15em] uppercase">
            Sign Out
          </button>
        </div>
      </div>
    </nav>

  )
}