'use client'

import React, { useState, useRef, useEffect, ChangeEvent } from 'react'
import Header from '@/components/Header'

const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const ImageIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const VectorIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>

export default function TypeGridStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  
  const [text, setText] = useState<string>('@iluvvalks')
  const [size, setSize] = useState<number>(10)
  const [colors, setColors] = useState<number>(2)
  const [bgColor, setBgColor] = useState<string>('#0f0f11')
  
  const [colorMode, setColorMode] = useState<'original' | 'solid' | 'duotone'>('original')
  const [colorOne, setColorOne] = useState<string>('#ffffff')
  const [colorTwo, setColorTwo] = useState<string>('#2563eb')
  
  const [effects, setEffects] = useState({
    gleam: { active: false, value: 12 },
    radiance: { active: false, value: 15 },
    chromatic: { active: false, value: 2 },
    scanlines: { active: false, value: 15 },
    vignette: { active: false, value: 80 }
  })
  
  const [actionState, setActionState] = useState<'none' | 'download' | 'copy'>('none')

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  const extractColors = (imgData: Uint8ClampedArray) => {
    let maxLum = 0, minLum = 255
    let bright = '#ffffff', dark = '#2563eb'
    
    for(let i = 0; i < imgData.length; i += 40) {
      const r = imgData[i], g = imgData[i+1], b = imgData[i+2], a = imgData[i+3]
      if (a < 128) continue
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      if (lum > maxLum && lum < 250) { maxLum = lum; bright = rgbToHex(r,g,b) }
      if (lum < minLum && lum > 10) { minLum = lum; dark = rgbToHex(r,g,b) }
    }
    setColorOne(bright)
    setColorTwo(dark)
  }

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const targetWidth = 1000 
      const scale = targetWidth / img.width
      const targetHeight = img.height * scale

      canvas.width = targetWidth
      canvas.height = targetHeight

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = targetWidth
      tempCanvas.height = targetHeight
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
      if (!tempCtx) return
      
      tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
      const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data
      
      if (canvas.getAttribute('data-loaded-src') !== imageSrc) {
        extractColors(imgData)
        canvas.setAttribute('data-loaded-src', imageSrc)
      }

      const factor = 255 / (colors - 1)

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const customText = text || 'X'
      let charIndex = 0

      ctx.font = `bold ${size * 1.5}px -apple-system, BlinkMacSystemFont, "SF Pro Text", monospace`
      ctx.textBaseline = 'top'

      const stepY = size * 1.5
      const stepX = size * 0.9
      const c1 = hexToRgb(colorOne)
      const c2 = hexToRgb(colorTwo)

      for (let y = 0; y < targetHeight; y += stepY) {
        for (let x = 0; x < targetWidth; x += stepX) {
          const pixelX = Math.floor(x)
          const pixelY = Math.floor(y)
          const offset = (pixelY * targetWidth + pixelX) * 4
          
          const r = imgData[offset]
          const g = imgData[offset + 1]
          const b = imgData[offset + 2]
          const a = imgData[offset + 3]

          if (a < 128 || (r > 240 && g > 240 && b > 240)) continue

          let fillColor = ''

          if (colorMode === 'original') {
            const pr = Math.round(Math.round(r / factor) * factor)
            const pg = Math.round(Math.round(g / factor) * factor)
            const pb = Math.round(Math.round(b / factor) * factor)
            fillColor = `rgb(${pr}, ${pg}, ${pb})`
          } else if (colorMode === 'solid') {
            fillColor = colorOne
          } else if (colorMode === 'duotone') {
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            const dr = Math.round(c1.r + (c2.r - c1.r) * lum)
            const dg = Math.round(c1.g + (c2.g - c1.g) * lum)
            const db = Math.round(c1.b + (c2.b - c1.b) * lum)
            fillColor = `rgb(${dr}, ${dg}, ${db})`
          }

          const char = customText[charIndex % customText.length]
          charIndex++

          if (effects.chromatic.active) {
            ctx.shadowBlur = 0
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
            ctx.fillText(char, x - effects.chromatic.value, y)
            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)'
            ctx.fillText(char, x + effects.chromatic.value, y)
          }

          if (effects.gleam.active) {
            ctx.shadowColor = fillColor
            ctx.shadowBlur = effects.gleam.value
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
          } else {
            ctx.shadowBlur = 0
          }

          ctx.fillStyle = fillColor
          ctx.fillText(char, x, y)
        }
      }

      ctx.shadowBlur = 0

      if (effects.radiance.active) {
        const glowCanvas = document.createElement('canvas')
        glowCanvas.width = targetWidth
        glowCanvas.height = targetHeight
        const glowCtx = glowCanvas.getContext('2d')
        if (glowCtx) {
          glowCtx.drawImage(canvas, 0, 0)
          ctx.globalCompositeOperation = 'screen'
          ctx.filter = `blur(${effects.radiance.value / 2}px)`
          ctx.drawImage(glowCanvas, 0, 0)
          ctx.filter = 'none'
          ctx.globalCompositeOperation = 'source-over'
        }
      }

      if (effects.scanlines.active) {
        ctx.fillStyle = `rgba(0, 0, 0, ${effects.scanlines.value / 100})`
        for (let i = 0; i < targetHeight; i += 4) {
          ctx.fillRect(0, i, targetWidth, 1)
        }
      }

      if (effects.vignette.active) {
        const gradient = ctx.createRadialGradient(
          targetWidth / 2, targetHeight / 2, targetWidth * 0.3,
          targetWidth / 2, targetHeight / 2, targetWidth * 0.8
        )
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(1, `rgba(0,0,0,${effects.vignette.value / 100})`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, targetWidth, targetHeight)
      }

    }
    img.src = imageSrc
  }, [imageSrc, text, size, colors, bgColor, colorMode, colorOne, colorTwo, effects])

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const toggleEffect = (key: keyof typeof effects) => {
    setEffects(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }))
  }

  const updateEffectValue = (key: keyof typeof effects, val: number) => {
    setEffects(prev => ({ ...prev, [key]: { ...prev[key], value: val } }))
  }

  const generateSVGString = () => {
    if (!canvasRef.current || !imageSrc) return ''
    const canvas = canvasRef.current
    const targetWidth = canvas.width
    const targetHeight = canvas.height
    
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = targetWidth
    tempCanvas.height = targetHeight
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return ''

    const img = new Image()
    img.src = imageSrc
    tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
    const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data
    
    const factor = 255 / (colors - 1)
    const customText = text || 'X'
    let charIndex = 0
    const c1 = hexToRgb(colorOne)
    const c2 = hexToRgb(colorTwo)

    let svg = `<svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">`
    svg += `<rect width="100%" height="100%" fill="${bgColor}"/>`
    svg += `<g font-family="monospace" font-size="${size * 1.5}" font-weight="bold" dominant-baseline="text-before-edge">`

    const stepY = size * 1.5
    const stepX = size * 0.9

    for (let y = 0; y < targetHeight; y += stepY) {
      for (let x = 0; x < targetWidth; x += stepX) {
        const pixelX = Math.floor(x)
        const pixelY = Math.floor(y)
        const offset = (pixelY * targetWidth + pixelX) * 4
        
        const r = imgData[offset]
        const g = imgData[offset + 1]
        const b = imgData[offset + 2]
        const a = imgData[offset + 3]

        if (a < 128 || (r > 240 && g > 240 && b > 240)) continue

        let fillColor = ''
        if (colorMode === 'original') {
          const pr = Math.round(Math.round(r / factor) * factor)
          const pg = Math.round(Math.round(g / factor) * factor)
          const pb = Math.round(Math.round(b / factor) * factor)
          fillColor = `rgb(${pr}, ${pg}, ${pb})`
        } else if (colorMode === 'solid') {
          fillColor = colorOne
        } else if (colorMode === 'duotone') {
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          const dr = Math.round(c1.r + (c2.r - c1.r) * lum)
          const dg = Math.round(c1.g + (c2.g - c1.g) * lum)
          const db = Math.round(c1.b + (c2.b - c1.b) * lum)
          fillColor = `rgb(${dr}, ${dg}, ${db})`
        }

        const char = customText[charIndex % customText.length]
        charIndex++
        if (char === ' ') continue
        const safeChar = char === '<' ? '&lt;' : char === '>' ? '&gt;' : char === '&' ? '&amp;' : char
        svg += `<text x="${x}" y="${y}" fill="${fillColor}">${safeChar}</text>`
      }
    }
    svg += `</g></svg>`
    return svg
  }

  const triggerDownload = (type: 'png' | 'svg') => {
    if (!canvasRef.current) return
    if (type === 'png') {
      const link = document.createElement('a')
      link.download = 'typegrid-art.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    } else {
      const svg = generateSVGString()
      if (!svg) return
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'typegrid-vector.svg'
      link.click()
      URL.revokeObjectURL(url)
    }
    setActionState('none')
  }

  const triggerCopy = async (type: 'png' | 'svg') => {
    if (!canvasRef.current) return
    if (type === 'png') {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          alert('PNG copied to clipboard')
        }
      })
    } else {
      const svg = generateSVGString()
      if (!svg) return
      await navigator.clipboard.writeText(svg)
      alert('SVG code copied to clipboard')
    }
    setActionState('none')
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-0 md:p-8 font-sans text-slate-200">
      <div className="w-full max-w-7xl h-screen md:h-[90vh] bg-[#1c1c1e] md:bg-[#1c1c1e]/90 md:backdrop-blur-xl rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 md:border border-white/10 relative">
        
        <div className="dark">
            <Header />
        </div>

        <div className="h-12 bg-[#2c2c2e]/50 flex items-center px-4 border-b border-white/5 select-none shrink-0 relative z-10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10"></div>
          </div>
          <div className="mx-auto text-neutral-300 text-[13px] font-semibold tracking-wide">TypeGrid Studio</div>
          <div className="w-12"></div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-0">
          
          <div className="w-full md:w-80 flex-1 md:flex-none md:h-auto bg-[#1e1e1e]/80 p-4 md:p-5 flex flex-col gap-6 overflow-y-auto border-t md:border-t-0 md:border-r border-white/5 custom-scrollbar shrink-0 order-2 md:order-1">
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Source Image</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-white/10 rounded-lg p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors text-blue-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {imageSrc ? "Replace Image" : "Upload Image"}
                </div>
              </div>
            </div>

            <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pattern Text</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="bg-[#1c1c1e] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Scale</label>
                  <span className="text-[10px] font-mono text-neutral-500">{size}px</span>
                </div>
                <input type="range" min="4" max="24" value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-blue-500" />
              </div>
            </div>

            <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Color Mode</label>
                <div className="flex bg-[#1c1c1e] rounded-lg p-1 border border-white/5">
                  {(['original', 'solid', 'duotone'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setColorMode(mode)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${colorMode === mode ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {colorMode === 'original' ? (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Color Detail</label>
                    <span className="text-[10px] font-mono text-neutral-500">{colors === 2 ? '0' : colors}</span>
                  </div>
                  <input type="range" min="2" max="16" value={colors} onChange={(e) => setColors(Number(e.target.value))} className="accent-blue-500" />
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[9px] text-neutral-500 uppercase">Primary</label>
                    <div className="h-8 rounded-lg overflow-hidden border border-white/10 relative">
                      <input type="color" value={colorOne} onChange={(e) => setColorOne(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
                    </div>
                  </div>
                  {colorMode === 'duotone' && (
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[9px] text-neutral-500 uppercase">Secondary</label>
                      <div className="h-8 rounded-lg overflow-hidden border border-white/10 relative">
                        <input type="color" value={colorTwo} onChange={(e) => setColorTwo(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5 flex flex-col gap-3 shadow-sm">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Visual Effects</label>
              
              {(Object.keys(effects) as Array<keyof typeof effects>).map((effectKey) => {
                const effect = effects[effectKey]
                return (
                  <div key={effectKey} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-300 capitalize">{effectKey}</span>
                      <button 
                        onClick={() => toggleEffect(effectKey)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${effect.active ? 'bg-blue-600' : 'bg-[#1c1c1e] border border-white/10'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${effect.active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    {effect.active && (
                       <input 
                        type="range" 
                        min="1" 
                        max={effectKey === 'scanlines' || effectKey === 'vignette' ? "100" : effectKey === 'gleam' || effectKey === 'radiance' ? "40" : "10"} 
                        value={effect.value} 
                        onChange={(e) => updateEffectValue(effectKey, Number(e.target.value))} 
                        className="accent-blue-500 w-full mb-1" 
                      />
                    )}
                  </div>
                )
              })}
              
              <div className="h-px bg-white/5 my-2"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Background</span>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 relative">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" />
                </div>
              </div>
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
            </div>

          </div>

          <div className="w-full md:flex-1 flex-1 md:h-auto flex items-center justify-center p-4 md:p-8 overflow-hidden relative order-1 md:order-2" style={{ backgroundColor: bgColor }}>
            {!imageSrc && (
              <div className="absolute flex flex-col items-center gap-4 text-neutral-500 pointer-events-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div className="text-sm font-medium tracking-wide">Waiting for source image</div>
              </div>
            )}
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm transition-opacity duration-500" style={{ opacity: imageSrc ? 1 : 0 }}></canvas>
          </div>
        </div>
        
      </div>
    </div>
  )
}