"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-black/5 h-7 flex items-center justify-between px-3 md:px-5 text-[12px] font-medium text-slate-800 font-sans">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-base leading-none font-black hover:opacity-70 transition-opacity">
          
        </Link>
        <Link href="/" className="font-bold tracking-tight text-slate-900 cursor-pointer">
          Finder
        </Link>
        <Link href="/" className="hidden sm:inline cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors">
          Home
        </Link>
        <a 
          href="https://dast.in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden sm:inline cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors"
        >
          Main Site
        </a>
        <Link href="/about" className="hidden sm:inline cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors">
          About
        </Link>
      </div>
      <div className="flex items-center gap-4 text-[11px] font-semibold">
        <span>{currentTime}</span>
      </div>
    </header>
  );
};

export default Header;