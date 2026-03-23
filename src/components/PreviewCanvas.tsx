import React, { useEffect } from 'react'
import { drawBackgroundPreset } from '@/lib/backgroundPresets'

export default function PreviewCanvas({ canvasRef, state }: any) {
  useEffect(() => {
    if (!state.imageSrc || !canvasRef.current) return
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

      if (state.bgMode === 'solid') {
        ctx.fillStyle = state.bgColor
        ctx.fillRect(0, 0, targetWidth, targetHeight)
      } else if (state.bgMode === 'none') {
        ctx.clearRect(0, 0, targetWidth, targetHeight)
      } else if (state.bgMode === 'preset') {
        drawBackgroundPreset(ctx, state.activePreset, targetWidth, targetHeight)
      }

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = targetWidth
      tempCanvas.height = targetHeight
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
      if (!tempCtx) return
      
      tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
      const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data

      const factor = 255 / (state.colors - 1)
      const customText = state.text || 'X'
      let charIndex = 0

      ctx.font = `bold ${state.size * 1.5}px "Courier New", Courier, monospace`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      const stepY = state.size * 1.5
      const stepX = state.size * 0.9

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 }
      }

      const c1 = hexToRgb(state.colorOne)
      const c2 = hexToRgb(state.colorTwo)

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

          if (state.colorMode === 'original') {
            const pr = Math.round(Math.round(r / factor) * factor)
            const pg = Math.round(Math.round(g / factor) * factor)
            const pb = Math.round(Math.round(b / factor) * factor)
            fillColor = `rgb(${pr}, ${pg}, ${pb})`
          } else if (state.colorMode === 'solid') {
            fillColor = state.colorOne
          } else if (state.colorMode === 'duotone') {
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            const dr = Math.round(c1.r + (c2.r - c1.r) * lum)
            const dg = Math.round(c1.g + (c2.g - c1.g) * lum)
            const db = Math.round(c1.b + (c2.b - c1.b) * lum)
            fillColor = `rgb(${dr}, ${dg}, ${db})`
          }

          const char = customText[charIndex % customText.length]
          charIndex++

          const cx = x + stepX / 2
          const cy = y + stepY / 2

          if (state.effects.chromatic.active) {
            ctx.shadowBlur = 0
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
            ctx.fillText(char, cx - state.effects.chromatic.value, cy)
            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)'
            ctx.fillText(char, cx + state.effects.chromatic.value, cy)
          }

          if (state.effects.gleam.active) {
            ctx.shadowColor = fillColor
            ctx.shadowBlur = state.effects.gleam.value
          } else {
            ctx.shadowBlur = 0
          }

          ctx.fillStyle = fillColor
          ctx.fillText(char, cx, cy)
        }
      }

      ctx.shadowBlur = 0

      if (state.effects.radiance.active) {
        const glowCanvas = document.createElement('canvas')
        glowCanvas.width = targetWidth
        glowCanvas.height = targetHeight
        const glowCtx = glowCanvas.getContext('2d')
        if (glowCtx) {
          glowCtx.drawImage(canvas, 0, 0)
          ctx.globalCompositeOperation = 'screen'
          ctx.filter = `blur(${state.effects.radiance.value / 2}px)`
          ctx.drawImage(glowCanvas, 0, 0)
          ctx.filter = 'none'
          ctx.globalCompositeOperation = 'source-over'
        }
      }

      if (state.effects.glass.active) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(targetWidth, 0)
        ctx.lineTo(targetWidth, targetHeight * 0.4)
        ctx.quadraticCurveTo(targetWidth * 0.5, targetHeight * 0.6, 0, targetHeight * 0.3)
        ctx.closePath()
        const grad = ctx.createLinearGradient(0, 0, 0, targetHeight * 0.5)
        grad.addColorStop(0, `rgba(255,255,255,${state.effects.glass.value / 100})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      }

      if (state.effects.noise.active) {
        const noiseData = ctx.createImageData(targetWidth, targetHeight)
        const buffer32 = new Uint32Array(noiseData.data.buffer)
        const noiseOpacity = Math.floor((state.effects.noise.value / 100) * 255)
        for (let i = 0; i < buffer32.length; i++) {
          if (Math.random() < 0.5) {
            buffer32[i] = (noiseOpacity << 24) | (255 << 16) | (255 << 8) | 255
          }
        }
        const noiseCanvas = document.createElement('canvas')
        noiseCanvas.width = targetWidth
        noiseCanvas.height = targetHeight
        noiseCanvas.getContext('2d')?.putImageData(noiseData, 0, 0)
        ctx.globalCompositeOperation = 'overlay'
        ctx.drawImage(noiseCanvas, 0, 0)
        ctx.globalCompositeOperation = 'source-over'
      }

      if (state.effects.scanlines.active) {
        ctx.fillStyle = `rgba(0, 0, 0, ${state.effects.scanlines.value / 100})`
        for (let i = 0; i < targetHeight; i += 4) {
          ctx.fillRect(0, i, targetWidth, 1)
        }
      }

      if (state.effects.vignette.active) {
        const gradient = ctx.createRadialGradient(
          targetWidth / 2, targetHeight / 2, targetWidth * 0.3,
          targetWidth / 2, targetHeight / 2, targetWidth * 0.8
        )
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(1, `rgba(0,0,0,${state.effects.vignette.value / 100})`)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, targetWidth, targetHeight)
      }

    }
    img.src = state.imageSrc
  }, [state, canvasRef])

  const wrapperBg = state.bgMode === 'solid' ? state.bgColor : state.bgMode === 'preset' ? '#121212' : 'transparent';
  const checkerBoard = state.bgMode === 'none' ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAO0lEQVQYV2NkYGAwYkADjDgkGTGI4lUAk8RwGbrimCawSsZRCe6P4TJMxTB12BSjS8LkI7gEw9QBAF0hDBXn+c4zAAAAAElFTkSuQmCC")' : 'none';

  return (
    <div className="w-full md:flex-1 flex-1 md:h-auto flex items-center justify-center p-4 md:p-8 overflow-hidden relative order-1 md:order-2" 
         style={{ backgroundColor: wrapperBg, backgroundImage: checkerBoard }}>
      {!state.imageSrc && (
        <div className="absolute flex flex-col items-center gap-4 text-neutral-500 pointer-events-none">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div className="text-sm font-medium tracking-wide">Waiting for source image</div>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm transition-opacity duration-500" style={{ opacity: state.imageSrc ? 1 : 0 }}></canvas>
    </div>
  )
}