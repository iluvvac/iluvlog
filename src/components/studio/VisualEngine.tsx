'use client'

import React from 'react'

interface VisualEngineProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  imageSrc: string | null
  text: string
  size: number
  colors: number
  bgColor: string
  colorMode: 'original' | 'solid' | 'duotone'
  colorOne: string
  colorTwo: string
  effects: any
  bgType: 'solid' | 'none' | 'preset'
  selectedPreset: string
}

export const generateSVGString = async (props: VisualEngineProps): Promise<string> => {
  const { canvasRef, text, size, colors, bgColor, colorMode, colorOne, colorTwo, effects, bgType, selectedPreset } = props
  
  if (!canvasRef.current) return ''
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const targetWidth = canvas.width
  const targetHeight = canvas.height
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight).data
  
  const stepY = size * 1.5
  const stepX = size * 0.9
  const charText = text || 'X'
  let charIndex = 0

  let svgContent = `<svg width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}" xmlns="http://www.w3.org/2000/svg">`
  
  // 1. Background Logic
  if (bgType === 'solid') {
    svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>`
  } else if (bgType === 'preset') {
    // Di sini Anda bisa menambahkan path/image untuk preset (Passport, Notebook, dll)
    svgContent += `<rect width="100%" height="100%" fill="#f4f4f0"/>` // Contoh Notebook base
  }

  // 2. Filter Definitions (Internal SVG)
  svgContent += `<defs>`
  if (effects.noise.active) {
    svgContent += `
      <filter id="svgNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${effects.noise.value / 100}"/>
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>`
  }
  svgContent += `</defs>`

  // 3. Typography Layer
  svgContent += `<g font-family="monospace" font-size="${size * 1.5}" font-weight="bold">`
  
  for (let y = 0; y < targetHeight; y += stepY) {
    for (let x = 0; x < targetWidth; x += stepX) {
      const offset = (Math.floor(y) * targetWidth + Math.floor(x)) * 4
      if (imgData[offset + 3] < 128) continue

      const char = charText[charIndex % charText.length]
      charIndex++
      
      const r = imgData[offset], g = imgData[offset+1], b = imgData[offset+2]
      const color = colorMode === 'solid' ? colorOne : `rgb(${r},${g},${b})`

      svgContent += `<text x="${x}" y="${y + size}" fill="${color}">${char}</text>`
    }
  }
  svgContent += `</g>`

  // 4. Overlays (Glass Effect inside SVG)
  if (effects.glass.active) {
    svgContent += `<rect width="100%" height="40%" fill="white" fill-opacity="${effects.glass.value / 100}" />`
  }
  
  if (effects.noise.active) {
    svgContent += `<rect width="100%" height="100%" filter="url(#svgNoise)" pointer-events="none"/>`
  }

  svgContent += `</svg>`
  return svgContent
}