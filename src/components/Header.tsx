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
        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center">
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