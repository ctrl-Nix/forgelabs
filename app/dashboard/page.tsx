'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const tools = [
  {
    id: 'marketmind',
    name: 'MarketMind',
    description: 'AI-powered product research agent. Input a SaaS idea, get a full PRD with competitor analysis and MoSCoW prioritisation.',
    category: 'Product',
    status: 'live',
    href: '/tools/marketmind',
    icon: '🧠',
  },
  {
    id: 'zerodayexplainer',
    name: 'Zero-Day Explainer',
    description: 'Paste broken code and an error message. Get root cause analysis, fixed code, and prevention tips.',
    category: 'Engineering',
    status: 'live',
    href: '/tools/zerodayexplainer',
    icon: '🐛',
  },
  {
    id: 'engageos',
    name: 'EngageOS',
    description: 'AI-powered user engagement and retention suite. Coming soon.',
    category: 'Growth',
    status: 'waitlist',
    href: '/waitlist',
    icon: '🚀',
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setChecking(false)
    })
  }, [])

  if (checking) return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold">⚒ ForgeLabs</span>
          <div className="flex items-center gap-6">
            <Link href="/tools/marketmind" className="text-gray-400 hover:text-white text-sm transition">MarketMind</Link>
            <Link href="/tools/zerodayexplainer" className="text-gray-400 hover:text-white text-sm transition">Zero-Day</Link>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} className="text-sm text-gray-400 hover:text-red-400 transition">Sign Out</button>
          </div>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome to ForgeLabs</h1>
          <p className="text-gray-400">Your modular AI engineering suite</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map(tool => (
            <Link href={tool.href} key={tool.id}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-white/10 transition cursor-pointer h-full">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">{tool.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tool.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {tool.status === 'live' ? 'Live' : 'Waitlist'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                <span className="text-xs text-gray-600 border border-gray-700 px-2 py-1 rounded-full">{tool.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}