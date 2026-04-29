'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200 dark:border-white/10 px-8 py-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-raj { font-family: 'Inter', sans-serif; }
        .font-mono-j { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="font-raj font-bold text-lg tracking-[0.15em] text-slate-900 dark:text-foreground hover:text-blue-400 transition-colors duration-200 uppercase">
          ⚒ ForgeLabs
        </Link>
        <div className="flex items-center gap-6">
            <ThemeToggle />
          {[
            { label: 'ForgeInsight', href: '/tools/forgeinsight' },
            { label: 'Zero-Day', href: '/tools/zerodayexplainer' },
            { label: 'History', href: '/dashboard/history' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="font-mono-j text-xs text-slate-500 dark:text-gray-600 hover:text-slate-900 dark:text-foreground transition-colors duration-200 tracking-[0.15em] uppercase">
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="font-mono-j text-xs text-slate-500 dark:text-gray-600 hover:text-red-400 transition-colors duration-200 tracking-[0.15em] uppercase">
            Sign Out
          </button>
        </div>
      </div>
    </nav>

  )
}