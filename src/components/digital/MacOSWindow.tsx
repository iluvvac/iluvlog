import React, { ReactNode } from 'react';

interface MacOSWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function MacOSWindow({ children, className = '' }: MacOSWindowProps) {
  return (
    <div className={`flex flex-col sm:rounded-xl overflow-hidden shadow-2xl bg-zinc-950/80 backdrop-blur-xl border-white/10 relative ${className}`}>
      {/* Title Bar */}
      <div className="h-12 bg-white/5 flex items-center px-4 relative border-b border-white/5 shrink-0 z-50">
        {/* Traffic Lights */}
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black/20 hover:brightness-110 cursor-pointer transition-all"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/20 hover:brightness-110 cursor-pointer transition-all"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black/20 hover:brightness-110 cursor-pointer transition-all"></div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
