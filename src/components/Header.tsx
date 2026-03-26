"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AboutModal from "./AboutModal"

const Header = () => {
  const [currentTime, setCurrentTime] = useState("")
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }
    
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-[999] w-full bg-white/70 backdrop-blur-md border-b border-black/5 h-7 flex items-center justify-between px-3 md:px-5 text-[12px] font-medium text-slate-800 font-sans relative">
        <div className="flex items-center gap-4">
          
          <Link href="/" className="hover:opacity-70 transition-opacity flex items-center cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-3.5 h-3.5" 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25"
              />
            </svg>
          </Link>

          <span className="font-bold tracking-tight text-slate-900 cursor-default">
            Finder
          </span>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors">
              Home
            </Link>
            <a 
              href="https://dast.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors"
            >
              Main Site
            </a>
            <button 
              onClick={() => setIsAboutOpen(true)} 
              className="cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors"
            >
              About
            </button>
          </nav>

        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold">{currentTime}</span>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hover:bg-black/5 p-1 rounded transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Control Center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-8 right-2 w-48 bg-white/80 backdrop-blur-2xl border border-black/10 shadow-2xl rounded-xl p-2 z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="px-3 py-2 text-[13px] font-medium text-slate-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            >
              Home
            </Link>
            <a 
              href="https://dast.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-[13px] font-medium text-slate-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            >
              Main Site
            </a>
            <div className="h-px bg-slate-200/50 my-1"></div>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsAboutOpen(true)
              }} 
              className="text-left px-3 py-2 text-[13px] font-medium text-slate-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            >
              About
            </button>
          </div>
        </div>
      )}

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  )
}

export default Header