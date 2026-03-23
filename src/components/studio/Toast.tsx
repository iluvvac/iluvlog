'use client'
import React, { useEffect } from 'react'

export const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-10 right-10 z-50 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#1e1e1e]/80 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px]">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-inner">
          <svg className="text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold">Success</h4>
          <p className="text-neutral-400 text-xs">{message}</p>
        </div>
      </div>
    </div>
  )
}