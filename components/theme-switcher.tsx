"use client"

import { SunIcon, MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure the component is mounted before rendering
  // to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 rounded-md ${
          theme === 'light' 
            ? 'bg-secondary text-secondary-foreground' 
            : 'text-foreground/60 hover:text-foreground/80'
        }`}
        onClick={() => setTheme('light')}
        aria-label="Light mode"
      >
        <SunIcon className="h-5 w-5" />
      </button>
      
      <button
        className={`p-2 rounded-md ${
          theme === 'dark' 
            ? 'bg-secondary text-secondary-foreground' 
            : 'text-foreground/60 hover:text-foreground/80'
        }`}
        onClick={() => setTheme('dark')}
        aria-label="Dark mode"
      >
        <MoonIcon className="h-5 w-5" />
      </button>
      
      <button
        className={`p-2 rounded-md relative overflow-hidden ${
          theme === 'cyberpunk' 
            ? 'border border-[#ff2a6d]' 
            : 'text-foreground/60 hover:text-foreground/80'
        }`}
        onClick={() => setTheme('cyberpunk')}
        aria-label="Cyberpunk mode"
      >
        {theme === 'cyberpunk' && (
          <span className="absolute inset-0 bg-[#1a1a2e] opacity-70"></span>
        )}
        
        {theme === 'cyberpunk' && (
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff2a6d] to-transparent animate-[neonBorderShine_3s_infinite]"></span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#05d9e8] to-transparent animate-[neonBorderShine_3s_infinite]"></span>
            <span className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#7b61ff] to-transparent animate-[neonBorderShine_3s_infinite]"></span>
            <span className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#05d9e8] to-transparent animate-[neonBorderShine_3s_infinite]"></span>
          </span>
        )}
        
        <div className={`relative z-10 ${theme === 'cyberpunk' ? 'text-[#ff2a6d]' : ''}`} 
             data-text="CP" 
             data-glow={theme === 'cyberpunk' ? 'true' : 'false'}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="bevel"
            className={`h-5 w-5 ${
              theme === 'cyberpunk' 
                ? 'filter drop-shadow-[0_0_2px_#ff2a6d]' 
                : ''
            }`}
          >
            {/* Cyberpunk logo - simplified circuit/matrix pattern */}
            <path d="M4 4h16" />
            <path d="M4 9h16" />
            <path d="M4 14h16" />
            <path d="M4 20h16" />
            <path d="M9 4v16" />
            <path d="M15 4v16" />
            <path d="M4 4l5 5" />
            <path d="M15 15l5 5" />
          </svg>
        </div>
      </button>
    </div>
  )
} 