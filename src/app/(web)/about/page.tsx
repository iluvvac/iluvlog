"use client"

import { useState } from "react"
import Link from "next/link"
import Layout from "@/components/Layout"
import Header from "@/components/Header"

export default function About() {
  const [activeTab, setActiveTab] = useState("ringkasan")

  return (
    <Layout>
      <div className="min-h-screen bg-[#E5E5E5] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col font-sans text-slate-900 relative overflow-hidden">
        
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 w-full">
          <Header />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 z-10">
          
          <div className="bg-[#f5f5f7]/90 backdrop-blur-2xl w-full max-w-[540px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            
            <div className="h-10 flex items-center px-4 shrink-0">
              <div className="flex gap-2">
                <Link href="/" className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-[#ff473e] flex items-center justify-center group">
                  <span className="opacity-0 group-hover:opacity-100 text-[#4c0000] text-[8px] font-black leading-none">×</span>
                </Link>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
              </div>
            </div>

            <div className="flex justify-center pb-4">
              <div className="flex bg-[#e3e3e6] p-0.5 rounded-lg shadow-inner">
                <button 
                  onClick={() => setActiveTab("ringkasan")}
                  className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "ringkasan" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Ringkasan
                </button>
                <button 
                  onClick={() => setActiveTab("hobi")}
                  className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "hobi" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Gaya Hidup
                </button>
                <button 
                  onClick={() => setActiveTab("gear")}
                  className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "gear" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Perangkat
                </button>
              </div>
            </div>

            <div className="px-8 pb-8 pt-2 h-[320px] overflow-hidden flex flex-col justify-center">
              
              {activeTab === "ringkasan" && (
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start animate-in fade-in duration-300">
                  <div className="relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                      alt="Dasteen OS" 
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  
                  <div className="flex flex-col text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Dasteen</h1>
                    <p className="text-[12px] text-slate-500 font-medium mb-4">Sistem Versi 2.0 (Lulusan Ilmu Komputer)</p>
                    
                    <div className="flex flex-col gap-2.5 text-[12px]">
                      <div className="flex gap-4 items-start">
                        <span className="text-slate-500 w-24 text-right font-medium shrink-0">Fokus Inti</span>
                        <span className="text-slate-800 font-medium">Web Development & Desain UI/UX</span>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="text-slate-500 w-24 text-right font-medium shrink-0">Riset Terkini</span>
                        <span className="text-slate-800 font-medium">Kecerdasan Buatan (AI/ML)</span>
                      </div>
                      <div className="flex gap-4 items-start">
                        <span className="text-slate-500 w-24 text-right font-medium shrink-0">Pembaruan</span>
                        <span className="text-slate-800 font-medium">Belajar bahasa Jerman untuk studi Master (HCI/Digital Engineering)</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="px-4 py-1.5 bg-slate-200/80 hover:bg-slate-300 border border-slate-300/50 rounded-md text-[12px] font-medium text-slate-700 transition-colors shadow-sm">
                        Laporan Sistem...
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hobi" && (
                <div className="animate-in fade-in duration-300 h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900 flex items-center gap-2 mb-1.5"><span className="text-lg">📸</span> Visual</h3>
                      <p className="text-[12px] text-slate-600 leading-relaxed">Fotografi jalanan dan perjalanan menggunakan format film analog. Sangat menyukai eksperimen lensa manual.</p>
                    </div>
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900 flex items-center gap-2 mb-1.5"><span className="text-lg">💪</span> Kinerja Fisik</h3>
                      <p className="text-[12px] text-slate-600 leading-relaxed">Kalistenik rutin untuk kebugaran dasar. Sering melakukan penjelajahan alam seperti pendakian ke Kawah Ratu.</p>
                    </div>
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900 flex items-center gap-2 mb-1.5"><span className="text-lg">🎮</span> Render Grafis</h3>
                      <p className="text-[12px] text-slate-600 leading-relaxed">Menghabiskan waktu santai dengan bermain video game konsol.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gear" && (
                <div className="animate-in fade-in duration-300 h-full flex flex-col justify-center">
                  <div className="space-y-4">
                    
                    <div className="flex items-start gap-4 p-3 bg-white/50 border border-slate-200/50 rounded-lg">
                      <div className="text-2xl pt-1">📷</div>
                      <div>
                        <h3 className="text-[12px] font-bold text-slate-900 mb-0.5">Modul Optik (Kamera & Lensa)</h3>
                        <p className="text-[12px] text-slate-600">Sistem kamera film dengan dukungan lensa tukar pasang. Senjata utama: Lensa Helios 44-4 untuk karakter *swirly bokeh*.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-white/50 border border-slate-200/50 rounded-lg">
                      <div className="text-2xl pt-1">💻</div>
                      <div>
                        <h3 className="text-[12px] font-bold text-slate-900 mb-0.5">Ruang Kerja Digital</h3>
                        <p className="text-[12px] text-slate-600">Pembuatan prototipe menggunakan Figma. Pengembangan produk menggunakan ekosistem Next.js, React, dan Tailwind CSS.</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  )
}