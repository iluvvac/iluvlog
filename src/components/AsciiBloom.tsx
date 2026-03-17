"use client";

import { useState, useEffect, useRef } from "react";

// Frame animasi pertumbuhan 3D (Seed -> Sprout -> Bloom -> Rotate)
const bloomFrames = [
  "       \n       \n   .   \n       \n       ", // Seed
  "       \n   o   \n  /|\\  \n       \n       ", // Sprout
  "   _   \n  ( )  \n  /|\\  \n       \n       ", // Bud
  "  _|_  \n / | \\ \n  /|\\  \n       \n       ", // Opening
  "  \\|/  \n --X-- \n  /|\\  \n       \n       ", // Bloom Front
  "   /   \n --X-- \n  /|\\  \n  /    \n       ", // 3D Rotation 1
  "   |   \n --X-- \n  /|\\  \n       \n       ", // 3D Rotation 2
  "   \\   \n --X-- \n  /|\\  \n    \\  \n       ", // 3D Rotation 3
  "  \\|/  \n --X-- \n  /|\\  \n       \n       "  // Full Bloom
];

export default function AsciiBloom() {
  const [index, setIndex] = useState(0);
  const requestRef = useRef<number>(null);
  const lastUpdate = useRef<number>(0);

  const animate = (time: number) => {
    if (time - lastUpdate.current > 150) { // Kontrol kecepatan (FPS)
      setIndex((prev) => (prev + 1) % bloomFrames.length);
      lastUpdate.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[220px] bg-white group">
      <div className="relative">
        {/* Glow effect ala DevelopedbyEd */}
        <div className="absolute inset-0 bg-purple-400/20 blur-3xl rounded-full scale-150 group-hover:bg-purple-400/40 transition-colors duration-700" />
        
        <pre className="relative z-10 text-purple-600 font-mono text-[14px] leading-none text-center select-none drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
          {bloomFrames[index]}
        </pre>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Phase: {index + 1}/9</span>
        <div className="w-32 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-300 ease-out" 
            style={{ width: `${((index + 1) / bloomFrames.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}