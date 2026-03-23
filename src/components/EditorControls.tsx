import React, { ChangeEvent, useState } from 'react'
import { generateSVGString } from '@/lib/svgGenerator'

const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const ImageIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const VectorIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>

export default function EditorControls({ state, setters, canvasRef }: any) {
  const [actionState, setActionState] = useState<'none' | 'download' | 'copy'>('none')

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 }
  }

  const rgbToHex = (r: number, g: number, b: number) => "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setters.setImageSrc(src)
      
      const img = new Image()
      img.onload = () => {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        const ctx = tempCanvas.getContext('2d')
        if(ctx) {
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, img.width, img.height).data
          let maxLum = 0, minLum = 255
          let bright = '#ffffff', dark = '#2563eb'
          for(let i = 0; i < imgData.length; i += 40) {
            const r = imgData[i], g = imgData[i+1], b = imgData[i+2], a = imgData[i+3]
            if (a < 128) continue
            const lum = 0.299 * r + 0.587 * g + 0.114 * b
            if (lum > maxLum && lum < 250) { maxLum = lum; bright = rgbToHex(r,g,b) }
            if (lum < minLum && lum > 10) { minLum = lum; dark = rgbToHex(r,g,b) }
          }
          setters.setColorOne(bright)
          setters.setColorTwo(dark)
        }
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const triggerDownload = async (type: 'png' | 'svg') => {
    if (!canvasRef.current) return
    if (type === 'png') {
      const link = document.createElement('a')
      link.download = 'ascii-text.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
      setters.showToast('Downloaded as PNG')
    } else {
      const svg = await generateSVGString(canvasRef.current, state)
      if (!svg) return
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ascii-text-vector.svg'
      link.click()
      URL.revokeObjectURL(url)
      setters.showToast('Downloaded as SVG')
    }
    setActionState('none')
  }

  const triggerCopy = async (type: 'png' | 'svg') => {
    if (!canvasRef.current) return
    if (type === 'png') {
      canvasRef.current.toBlob(async (blob: Blob | null) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          setters.showToast('PNG copied to clipboard')
        }
      })
    } else {
      const svg = await generateSVGString(canvasRef.current, state)
      if (!svg) return
      await navigator.clipboard.writeText(svg)
      setters.showToast('SVG copied to clipboard')
    }
    setActionState('none')
  }

  const toggleEffect = (key: string) => {
    setters.setEffects((prev: any) => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }))
  }

  const updateEffectValue = (key: string, val: number) => {
    setters.setEffects((prev: any) => ({ ...prev, [key]: { ...prev[key], value: val } }))
  }

  return (
    <div className="w-full md:w-80 flex-1 md:flex-none md:h-auto bg-[#1e1e1e]/80 p-4 md:p-5 flex flex-col gap-6 overflow-y-auto border-t md:border-t-0 md:border-r border-white/5 custom-scrollbar shrink-0 order-2 md:order-1">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Source Image</label>
        <div className="relative">
          <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-white/10 rounded-lg p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors text-blue-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {state.imageSrc ? "Replace Image" : "Upload Image"}
          </div>
        </div>
      </div>

      <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pattern Text</label>
          <input type="text" value={state.text} onChange={(e) => setters.setText(e.target.value)} className="bg-[#1c1c1e] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-mono" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Scale</label>
            <span className="text-[10px] font-mono text-neutral-500">{state.size}px</span>
          </div>
          <input type="range" min="4" max="24" value={state.size} onChange={(e) => setters.setSize(Number(e.target.value))} className="accent-blue-500" />
        </div>
      </div>

      <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Color Mode</label>
          <div className="flex bg-[#1c1c1e] rounded-lg p-1 border border-white/5">
            {(['original', 'solid', 'duotone'] as const).map(mode => (
              <button key={mode} onClick={() => setters.setColorMode(mode)} className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${state.colorMode === mode ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>

        {state.colorMode === 'original' ? (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Color Detail</label>
              <span className="text-[10px] font-mono text-neutral-500">{state.colors === 2 ? '0' : state.colors}</span>
            </div>
            <input type="range" min="2" max="16" value={state.colors} onChange={(e) => setters.setColors(Number(e.target.value))} className="accent-blue-500" />
          </div>
        ) : (
          <div className="flex gap-3 pt-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[9px] text-neutral-500 uppercase">Primary</label>
              <div className="h-8 rounded-lg overflow-hidden border border-white/10 relative">
                <input type="color" value={state.colorOne} onChange={(e) => setters.setColorOne(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
              </div>
            </div>
            {state.colorMode === 'duotone' && (
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[9px] text-neutral-500 uppercase">Secondary</label>
                <div className="h-8 rounded-lg overflow-hidden border border-white/10 relative">
                  <input type="color" value={state.colorTwo} onChange={(e) => setters.setColorTwo(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-3 shadow-sm">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Background Layer</label>
        <div className="flex bg-[#1c1c1e] rounded-lg p-1 border border-white/5 mb-2">
          {(['solid', 'none'] as const).map(mode => ( //'preset mode is still in developing, will be added back in future update'
            <button key={mode} onClick={() => setters.setBgMode(mode)} className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${state.bgMode === mode ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}>
              {mode}
            </button>
          ))}
        </div>
        
        {state.bgMode === 'solid' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">Solid Color</span>
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 relative">
              <input type="color" value={state.bgColor} onChange={(e) => setters.setBgColor(e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" />
            </div>
          </div>
        )}

        {state.bgMode === 'preset' && (
          <select value={state.activePreset} onChange={(e) => setters.setActivePreset(e.target.value)} className="bg-[#1c1c1e] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500 block w-full p-2 outline-none">
            <option value="passport-passbook">Passport/Passbook</option>
            <option value="retro-newspaper">Vintage Newspaper</option>
            <option value="OMR-exam-sheet">OMR Exam Sheet</option>
            <option value="rolls-film">35mm Film Roll</option>
          </select>
        )}

        <div className="h-px bg-white/5 my-2"></div>
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Visual Effects</label>
        
        {(Object.keys(state.effects)).map((effectKey) => {
          const effect = state.effects[effectKey]
          return (
            <div key={effectKey} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300 capitalize">{effectKey}</span>
                <button onClick={() => toggleEffect(effectKey)} className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${effect.active ? 'bg-blue-600' : 'bg-[#1c1c1e] border border-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${effect.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {effect.active && (
                 <input type="range" min="1" max={effectKey === 'scanlines' || effectKey === 'vignette' ? "100" : effectKey === 'gleam' || effectKey === 'radiance' ? "40" : "20"} value={effect.value} onChange={(e) => updateEffectValue(effectKey, Number(e.target.value))} className="accent-blue-500 w-full mb-1" />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        {actionState === 'none' ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActionState('download')} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow-sm">
              <DownloadIcon /> Save
            </button>
            <button onClick={() => setActionState('copy')} className="bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-white/5 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow-sm">
              <CopyIcon /> Copy
            </button>
          </div>
        ) : (
          <div className="flex bg-[#2c2c2e] p-1 rounded-xl border border-white/5 relative">
            <button onClick={() => setActionState('none')} className="absolute -top-2 -right-2 w-5 h-5 bg-neutral-700 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-neutral-600">✕</button>
            <div className="flex-1 flex flex-col gap-1 p-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 text-center">
                {actionState === 'download' ? 'Download As' : 'Copy To Clipboard'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => actionState === 'download' ? triggerDownload('png') : triggerCopy('png')} className="bg-[#1c1c1e] hover:bg-[#3a3a3c] text-blue-400 font-medium py-2 rounded-lg transition-colors text-xs flex flex-col items-center gap-1 border border-white/5">
                  <ImageIcon /> PNG
                </button>
                <button onClick={() => actionState === 'download' ? triggerDownload('svg') : triggerCopy('svg')} className="bg-[#1c1c1e] hover:bg-[#3a3a3c] text-purple-400 font-medium py-2 rounded-lg transition-colors text-xs flex flex-col items-center gap-1 border border-white/5">
                  <VectorIcon /> SVG
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="text-[9px] text-neutral-500 text-center leading-tight mt-1 px-2">
          If you export or copy as SVG, some effects might not be applied. I am still finding a solution.
        </p>
      </div>
    </div>
  )
}