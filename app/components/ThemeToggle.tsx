'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-card shadow-sm0 dark:bg-card shadow-sm text-slate-900 dark:text-foreground hover:bg-card shadow-sm dark:hover:bg-white/10 transition-all duration-300 shadow-sm"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.1rem] w-[1.1rem] text-amber-500 animate-in zoom-in-50 duration-300" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] text-slate-600 animate-in zoom-in-50 duration-300" />
      )}
    </button>
  )
}