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
    <nav className="border-b border-white/10 bg-[#0a0a0f] px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition">
          ⚒ ForgeLabs
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/tools/marketmind" className="text-gray-400 hover:text-white text-sm transition">
            MarketMind
          </Link>
          <Link href="/tools/zerodayexplainer" className="text-gray-400 hover:text-white text-sm transition">
            Zero-Day
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-red-400 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}