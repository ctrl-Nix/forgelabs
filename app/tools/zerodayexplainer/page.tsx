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

  const severityColor = (s: string) => {
    if (s === 'Critical') return 'bg-red-500/20 text-red-400'
    if (s === 'High') return 'bg-orange-500/20 text-orange-400'
    if (s === 'Medium') return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-green-500/20 text-green-400'
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🐛 Zero-Day Explainer</h1>
        <p className="text-gray-400 mb-8">Paste broken code. Get root cause, fix, and prevention tips.</p>

        {/* Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:border-blue-500"
          >
            {['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'CSS'].map(l => (
              <option key={l} value={l} className="bg-[#0a0a0f]">{l}</option>
            ))}
          </select>

          <textarea
            placeholder="Paste your broken code here..."
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
          />

          <textarea
            placeholder="Error message (optional but recommended)..."
            value={error}
            onChange={e => setError(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !code}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? 'Analyzing...' : 'Explain This Bug'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${severityColor(result.severity)}`}>
                Severity: {result.severity}
              </span>
              <span className="text-sm px-3 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400">
                Confidence: {result.confidence}
              </span>
            </div>

            {/* Root Cause */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3 text-red-400">🔍 Root Cause</h2>
              <p className="text-gray-300">{result.root_cause}</p>
            </div>

            {/* Explanation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3 text-yellow-400">📖 Explanation</h2>
              <p className="text-gray-300">{result.explanation}</p>
            </div>

            {/* Fixed Code */}
            <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-green-400">✅ Fixed Code</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(result.corrected_code)}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
              <pre className="text-gray-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {result.corrected_code}
              </pre>
            </div>

            {/* Prevention */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3 text-blue-400">🛡️ Prevention Tip</h2>
              <p className="text-gray-300">{result.prevention_tip}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}