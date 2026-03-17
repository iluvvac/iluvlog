"use client"

import { useState } from "react"
import Link from "next/link"
import Layout from "@/components/Layout"
import Header from "@/components/Header"

export default function InProgress() {
  const [clicks, setClicks] = useState(0)
  const [confetti, setConfetti] = useState<{ id: number, left: string, duration: string, emoji: string }[]>([])

  const emojis = ["🎉", "🚀", "💻", "🔥", "✨"]

  const handleSpam = () => {
    setClicks((prev) => prev + 1)
    
    const newConfetti = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 2 + 1}s`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }))
    
    setConfetti((prev) => [...prev, ...newConfetti])

    setTimeout(() => {
      setConfetti((prev) => prev.filter((c) => !newConfetti.find((n) => n.id === c.id)))
    }, 3000)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#E5E5E5] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col font-sans text-slate-900 relative overflow-hidden">
        
        {/* Animasi Konfeti */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute top-[-50px] text-3xl pointer-events-none z-50"
            style={{
              left: c.left,
              animation: `fall ${c.duration} linear forwards`,
            }}
          >
            {c.emoji}
          </div>
        ))}

        <style jsx>{`
          @keyframes fall {
            to {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>

        {/* Global Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 w-full">
          <Header />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 z-10">
          
          {/* macOS Dialog Window (Lebih ringkas dan terpusat) */}
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-300 overflow-hidden flex flex-col">
            
            {/* Window Header */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
              </div>
            </div>

            {/* Konten Widget */}
            <div className="p-5 md:p-6 flex flex-col items-center">
              
              {/* Gambar GIF (Rasio layar lebar dengan sudut membulat) */}
              <div className="w-full relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200 shadow-sm mb-6">
                <img 
                  src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamZraXVqNDhwdjA1eWdudmxjMjlkaTE1Yjh5bW5lenQ4cnFzN2kwdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gK9CHa87GKKtpcU2B1/giphy.gif" 
                  alt="Menunggu kode" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                   <span className="text-white font-medium text-sm drop-shadow-md">Meow....</span>
                </div>
              </div>

              {/* Teks Judul */}
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6 text-center">
                Belum saya buat h3h3
              </h1>
              
              {/* Tombol Aksi */}
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={handleSpam}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-3.5 px-6 rounded-lg shadow-sm transition-transform active:scale-95 w-full flex items-center justify-between uppercase tracking-wider"
                >
                  <span>Make meowl happy</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs">{clicks}</span>
                </button>

                <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-bold py-3.5 px-6 rounded-lg transition-colors w-full text-center uppercase tracking-wider">
                  Return to Desktop
                </Link>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  )
}