import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ForgeLabs
        </h1>
        <p className="text-gray-400 text-xl mb-2">
          Modular AI Product Engineering Suite
        </p>
        <p className="text-gray-600 text-sm mb-10">
          Research. Build. Ship. Repeat.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition">
            Get Started
          </Link>
          <Link href="/dashboard" className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-medium transition">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}