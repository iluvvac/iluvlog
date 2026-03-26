"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const tools = [
    {
      name: "Sony a6400",
      desc: "My main hybrid shooter for street photography and daily documentation.",
      img: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Sony Zeiss 16-70mm",
      desc: "The versatile workhorse lens that stays on my camera 80% of the time.",
      img: "https://images.unsplash.com/photo-1617005082833-1eb5856b3b5b?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Helios 44-2",
      desc: "Vintage Russian glass for that signature swirly bokeh and analog feel.",
      img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "MacBook Air M2",
      desc: "My digital workspace for coding, designing UI, and editing photos.",
      img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Insta360 X3",
      desc: "For capturing unique perspectives and immersive behind-the-scenes moments.",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=200&auto=format&fit=crop"
    }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .mac-scrollbar::-webkit-scrollbar {
          width: 14px;
        }
        .mac-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .mac-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          border: 4px solid transparent;
          background-clip: padding-box;
        }
        .mac-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }
      `}} />

      <div className="relative bg-[#f5f5f7]/95 backdrop-blur-2xl w-full max-w-[500px] h-[400px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/60 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="h-10 flex items-center px-4 shrink-0">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-[#ff473e] flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[#4c0000] text-[8px] font-black leading-none">x</span>
            </button>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] cursor-pointer hover:bg-[#ffc64a] flex items-center justify-center group">
              <span className="opacity-0 group-hover:opacity-100 text-[#8a6100] text-[14px] font-black leading-none mt-[-6px]">-</span>
            </button>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] cursor-pointer hover:bg-[#28c940] flex items-center justify-center group">
               <span className="opacity-0 group-hover:opacity-100 text-[#0a4a0f] text-[14px] font-black leading-none mt-[-6px]">-</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center pb-4 shrink-0">
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg shadow-inner">
            <button 
              onClick={() => setActiveTab("summary")}
              className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "summary" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
            >
              About
            </button>
            {/* <button 
              onClick={() => setActiveTab("tools")}
              className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "tools" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
            >
              Tools
            </button> */}
            <button 
              onClick={() => setActiveTab("contact")}
              className={`px-5 py-1 text-[12px] font-medium rounded-md transition-all ${activeTab === "contact" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
            >
              Contact
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-2 overflow-y-auto mac-scrollbar flex-1 relative">
                   
          {activeTab === "summary" && (
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start animate-in fade-in duration-300">
              <div className="relative shrink-0">
                <img 
                  src="../favicon/Favicon-blog-dasteen.ico" 
                  alt="Dasteen" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                />
              </div>
              
              <div className="flex flex-col text-center md:text-left">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dasteen</h1>
                <p className="text-[13px] text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Jakarta, Indonesia
                </p>
                
                <p className="text-[13px] text-slate-700 leading-relaxed mb-3">
                I use this space to share whatever is going on in my head. Mostly, I just like making fun tools for editing and photography.
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed pb-4">
                  {/* When I'm not in front of my MacBook, you'll probably find me exploring the city with my camera, experimenting with vintage lenses, or trying to capture cool moments on film. */}
                </p>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="animate-in fade-in duration-300 pb-4">
              <div className="w-full  border border-slate-200/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
                {tools.map((tool, index) => (
                  <div key={index} className="flex gap-4 p-3 border-b border-slate-200/60 last:border-0 hover:bg-white/60 transition-colors items-center group cursor-default">
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 shadow-sm bg-slate-100">
                      <img src={tool.img} alt={tool.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-slate-900 leading-tight truncate mb-0.5">{tool.name}</h3>
                      <p className="text-[12px] text-slate-500 leading-snug line-clamp-2">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="animate-in fade-in duration-300 flex flex-col items-center pt-2 pb-6 min-h-full">
              <img 
                src="../favicon/Favicon-blog-dasteen.ico" 
                alt="Profile" 
                className="w-16 h-16 rounded-full border border-slate-200 shadow-sm mb-3 shrink-0"
              />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Let's Connect</h2>
              <p className="text-[13px] text-slate-500 text-center mb-6">
                Open for collaborations or just a casual chat.
              </p>

              <div className="w-full max-w-[320px] bg-white/40 border border-slate-200/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
                
                <a 
                  href="mailto:hello@dast.in" 
                  className="flex items-center justify-between p-3 border-b border-slate-200/60 hover:bg-white/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <span className="text-[13px] font-medium text-slate-800">hello@dast.in</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-slate-500 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
                </a>

                <a 
                  href="https://instagram.com/iluvvalks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 hover:bg-white/60 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-pink-500 flex items-center justify-center text-white shadow-sm shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </div>
                    <span className="text-[13px] font-medium text-slate-800">@iluvvalks</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-slate-500 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>,
    document.body
  );
}