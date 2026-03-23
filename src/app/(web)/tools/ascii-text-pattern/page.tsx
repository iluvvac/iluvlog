'use client'

import React, { useState, useRef } from 'react'
import Header from '@/components/Header'
import EditorControls from '@/components/EditorControls'
import PreviewCanvas from '@/components/PreviewCanvas'
import Notification from '@/components/Notification'
import { PresetType } from '@/lib/backgroundPresets' 

export type BackgroundMode = 'solid' | 'none' | 'preset'

export default function TypeGridStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [text, setText] = useState<string>('@iluvvalks')
  const [size, setSize] = useState<number>(10)
  const [colors, setColors] = useState<number>(2)
  const [bgColor, setBgColor] = useState<string>('#0f0f11')
  const [bgMode, setBgMode] = useState<BackgroundMode>('solid')
  const [activePreset, setActivePreset] = useState<PresetType>('retro-newspaper')
  
  const [colorMode, setColorMode] = useState<'original' | 'solid' | 'duotone'>('original')
  const [colorOne, setColorOne] = useState<string>('#ffffff')
  const [colorTwo, setColorTwo] = useState<string>('#2563eb')
  
  const [effects, setEffects] = useState({
    gleam: { active: false, value: 12 },
    radiance: { active: false, value: 15 },
    // glass: { active: false, value: 15 },
    // noise: { active: false, value: 15 },
    chromatic: { active: false, value: 2 },
    scanlines: { active: false, value: 15 },
    vignette: { active: false, value: 80 }
  })

  const [notification, setNotification] = useState<{show: boolean, msg: string} | null>(null)

  const showToast = (msg: string) => {
    setNotification({ show: true, msg })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 md:p-8 font-sans text-slate-200">
      <div className="w-full max-w-7xl h-screen md:h-[90vh] bg-[#1c1c1e] rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
        <Header />
        {notification && <Notification message={notification.msg} />}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <EditorControls 
            state={{ text, size, colors, bgColor, bgMode, activePreset, colorMode, colorOne, colorTwo, effects, imageSrc }}
            setters={{ setText, setSize, setColors, setBgColor, setBgMode, setActivePreset, setColorMode, setColorOne, setColorTwo, setEffects, setImageSrc, showToast }}
            canvasRef={canvasRef}
          />
          <PreviewCanvas 
            canvasRef={canvasRef}
            state={{ imageSrc, text, size, colors, bgColor, bgMode, activePreset, colorMode, colorOne, colorTwo, effects }}
          />
        </div>
      </div>
    </div>
  )
}