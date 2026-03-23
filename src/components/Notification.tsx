export default function Notification({ message }: { message: string }) {
    return (
      <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="bg-[#242424]/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-3 w-[340px] flex gap-3 text-white font-sans">
          <div className="w-10 h-10 shrink-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-0.5">
              <span className="text-[11px] font-medium text-white/50 tracking-wide uppercase">BLOG DAST.IN</span>
              <span className="text-[10px] text-white/40">Now</span>
            </div>
            <h4 className="text-sm font-semibold leading-tight mb-0.5">System Alert</h4>
            <p className="text-xs text-white/70 leading-snug">{message}</p>
          </div>
        </div>
      </div>
    )
  }