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

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition">⚒ ForgeLabs</a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">← Back to Dashboard</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">🧠 MarketMind</h1>
        <p className="text-gray-400 mb-8">AI-powered product research agent</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <input
            type="text"
            placeholder="Your SaaS idea (e.g. AI tool for dog walkers)"
            value={idea}
            onChange={e => setIdea(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Target audience (e.g. freelance dog walkers in the US)"
            value={audience}
            onChange={e => setAudience(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Monetization (e.g. subscription, freemium, one-time)"
            value={monetization}
            onChange={e => setMonetization(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !idea}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? 'Researching... this takes ~15 seconds' : 'Generate Research Report'}
          </button>
        </div>

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex gap-2 mb-6 flex-wrap">
              {['overview', 'competitors', 'moscow', 'launch'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {tab === 'moscow' ? 'MoSCoW Features' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
                <p className="text-gray-300 mb-6">{result.research.market_summary}</p>
                <h3 className="font-semibold mb-2 text-blue-400">Market Gap</h3>
                <p className="text-gray-300 mb-6">{result.research.market_gap}</p>
                <h3 className="font-semibold mb-2 text-blue-400">Target Personas</h3>
                <ul className="list-disc list-inside text-gray-300 mb-6">
                  {result.research.target_personas.map((p: string, i: number) => <li key={i}>{p}</li>)}
                </ul>
                <h3 className="font-semibold mb-2 text-red-400">Risks</h3>
                {result.research.risks.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${r.severity === 'High' ? 'bg-red-500/20 text-red-400' : r.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{r.severity}</span>
                    <span className="text-gray-300 text-sm">{r.risk}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'competitors' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
                {result.research.competitors.map((c: any, i: number) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 mb-4">
                    <h3 className="font-semibold text-blue-400 mb-1">{c.name}</h3>
                    <p className="text-gray-400 text-sm mb-1">💰 {c.pricing}</p>
                    <p className="text-gray-300 text-sm">⚠️ Weakness: {c.weakness}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'moscow' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">MoSCoW Feature Prioritisation</h2>
                {Object.entries(result.prd.moscow).map(([key, items]: [string, any]) => (
                  <div key={key} className="mb-6">
                    <h3 className="font-semibold mb-2 capitalize text-blue-400">
                      {key === 'must_have' ? '🔴 Must Have' : key === 'should_have' ? '🟡 Should Have' : key === 'could_have' ? '🟢 Could Have' : '⚪ Won\'t Have'}
                    </h3>
                    <ul className="list-disc list-inside text-gray-300">
                      {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                ))}
                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">Tech Complexity Score: <span className="font-bold text-white">{result.prd.tech_complexity_score}/10</span></p>
                </div>
              </div>
            )}

            {activeTab === 'launch' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">30-Day Launch Plan</h2>
                <p className="text-gray-300 mb-6">{result.prd.mvp_scope}</p>
                <h3 className="font-semibold mb-3 text-blue-400">Monetization Strategy</h3>
                <p className="text-gray-300 mb-6">{result.prd.monetization_strategy}</p>
                <h3 className="font-semibold mb-3 text-blue-400">Action Items</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  {result.prd.launch_plan_30_days.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}