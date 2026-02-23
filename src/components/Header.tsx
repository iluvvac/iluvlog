"use client";

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border border-slate-200 rounded-t-lg overflow-hidden font-mono select-none">
      <nav className="bg-[#f3f3f3] flex items-center justify-between h-10 border-b border-slate-200 px-4">
      
        <div className="flex items-center h-full">
          <div className="flex items-center gap-2 mr-4 md:hidden">
            <span className="text-blue-500 text-sm font-bold">M↓</span>
          </div>

          <div className="hidden md:flex items-center h-full">
            <Link
              href="/"
              className="flex items-center h-full px-4 gap-2 bg-white border-r border-slate-200 text-[11px] font-bold text-slate-700 border-t-2 border-t-blue-500"
            >
              <span className="text-blue-500 text-[10px]">TS</span> index.tsx
            </Link>
            <Link
              href="/#posts"
              className="flex items-center h-full px-4 gap-2 border-r border-slate-200 text-[11px] font-medium text-slate-500 hover:bg-slate-100/50"
            >
              <span className="text-amber-500 text-[10px]">{"{}"}</span>{" "}
              posts.json
            </Link>
            <Link
              href="/#projects"
              className="flex items-center h-full px-4 gap-2 border-r border-slate-200 text-[11px] font-medium text-slate-500 hover:bg-slate-100/50"
            >
              <span className="text-emerald-500 text-[10px]">LN</span>{" "}
              experiments.log
            </Link>
          </div>
        </div>

        {/* Sisi Kanan: Action Buttons */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Main Site Link (Desktop Only) */}
          <a
            href="https://dast.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-[10px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
          >
            <span className="text-purple-500 italic">↗</span> main_site.sh
          </a>

          {/* Contact Button (Selalu Terlihat) */}
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
          >
            contact.cmd
          </Link>

          {/* Tombol Hamburger (Mobile Only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1 p-1 ml-1"
            aria-label="Toggle Menu"
          >
            <div
              className={`h-0.5 w-5 bg-slate-600 transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <div
              className={`h-0.5 w-5 bg-slate-600 transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <div
              className={`h-0.5 w-5 bg-slate-600 transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Menu Dropdown Seluler */}
      <div
        className={`md:hidden bg-white border-b border-slate-200 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col p-2 gap-1 bg-[#fafafa]">
          <div className="text-[9px] font-bold text-slate-400 px-3 py-1 uppercase tracking-widest">
            Explorer
          </div>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-[11px] hover:bg-slate-200/50 rounded text-slate-700"
          >
            <span className="text-blue-500 font-bold">TS</span> index.tsx
          </Link>

          <Link
            href="/#posts"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-[11px] hover:bg-slate-200/50 rounded text-slate-700"
          >
            <span className="text-amber-500 font-bold">{"{}"}</span> posts.json
          </Link>

          <Link
            href="/#projects"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-[11px] hover:bg-slate-200/50 rounded text-slate-700"
          >
            <span className="text-emerald-500 font-bold">LN</span>{" "}
            experiments.log
          </Link>

          <div className="h-px bg-slate-200 my-1 mx-3" />

          {/* Tambahan Link Eksternal di Mobile Menu */}
          <a
            href="https://dast.in"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 text-[11px] text-slate-500 hover:bg-slate-200/50 rounded"
          >
            <span className="text-purple-500">↗</span> main_site.sh
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
