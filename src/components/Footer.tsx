import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  // Mengambil tanggal hari ini untuk tampilan "Time" yang statis namun akurat saat build
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white font-mono selection:bg-blue-500 selection:text-white">
      {/* 1. Editor Tab Section */}
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center -mt-[1px]">
          <div className="bg-white border-t border-x border-slate-200 px-4 py-2 text-[10px] font-bold text-blue-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            footer.json
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6 space-y-4">
            <div className="text-sm font-black text-slate-900 uppercase tracking-tighter">
              dasteen<span className="text-blue-600">.</span>in
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              // Personal notes on technology, design, and the curiosities in between.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">~/root</h4>
            <nav className="flex flex-col gap-2 text-[11px] font-bold">
              <a href="https://dast.in" className="text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
                <span className="text-blue-500">➜</span> Main Site
              </a>
            </nav>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">~/socials</h4>
            <div className="flex flex-col gap-2 text-[11px] font-bold">
              <a href="https://linkedin.com/in/dastindarmawan" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                <span className="text-slate-300 mr-2">ln:</span>linkedin
              </a>
              <a href="https://www.instagram.com/dastindrmwn/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                <span className="text-slate-300 mr-2">ig:</span>instagram
              </a>
              <a href="mailto:hello@dast.in" className="text-slate-600 hover:text-blue-600 transition-colors">
                <span className="text-slate-300 mr-2">mail:</span>hello@dast.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Terminal Status Bar (Revisi sesuai permintaan) */}
      <div className="bg-slate-950 text-white px-5 py-1.5 flex justify-between items-center text-[10px] font-bold">
        {/* Kolom Kiri: Status Replacement */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>BUILD_SUCCESS</span>
          </div>
          <a 
            href="https://outstatic.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 hover:text-blue-400 transition-all hidden sm:block"
          >
            Powered by Outstatic
          </a>
        </div>
        
        {/* Kolom Kanan: Time & Copyright */}
        <div className="flex items-center gap-4">
          <div className="opacity-60">
             &copy; 2026 Dasteen
          </div>
          <div className="bg-blue-600 px-3 py-0.5 select-none hidden md:block">
            {currentDate}
          </div>
          <span className="opacity-40">UTF-8</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer