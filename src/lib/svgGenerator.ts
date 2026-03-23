import { getSvgBackgroundPreset } from '@/lib/backgroundPresets'

export const generateSVGString = async (canvas: HTMLCanvasElement, state: any): Promise<string> => {
    return new Promise((resolve) => {
      const targetWidth = canvas.width
      const targetHeight = canvas.height
      
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = targetWidth
      tempCanvas.height = targetHeight
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return resolve('')

      const img = new Image()
      img.onload = () => {
        tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
        const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data
        
        const factor = 255 / (state.colors - 1)
        const customText = state.text || 'X'
        let charIndex = 0

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 }
        }
        const c1 = hexToRgb(state.colorOne)
        const c2 = hexToRgb(state.colorTwo)
        
        let mainTextTags = ''
        let glowTags = ''
        let radianceTags = ''
        let chromaticRedTags = ''
        let chromaticCyanTags = ''

        const stepY = state.size * 1.5
        const stepX = state.size * 0.9

        for (let y = 0; y < targetHeight; y += stepY) {
          const yPos = Number(y.toFixed(1))
          let lineMain = `<text y="${yPos}">`
          let lineGlow = `<text y="${yPos}">`
          let lineRad = `<text y="${yPos}">`
          let lineRed = `<text y="${yPos}">`
          let lineCyan = `<text y="${yPos}">`
          let hasContent = false

          for (let x = 0; x < targetWidth; x += stepX) {
            const pixelX = Math.floor(x)
            const pixelY = Math.floor(y)
            const offset = (pixelY * targetWidth + pixelX) * 4
            
            const r = imgData[offset]
            const g = imgData[offset + 1]
            const b = imgData[offset + 2]
            const a = imgData[offset + 3]

            if (a < 128 || (r > 240 && g > 240 && b > 240)) continue
            
            hasContent = true
            const xPos = Number((x + stepX / 2).toFixed(1))

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
            const safeChar = char === '<' ? '&lt;' : char === '>' ? '&gt;' : char === '&' ? '&amp;' : char
            
            lineMain += `<tspan x="${xPos}" fill="${fillColor}">${safeChar}</tspan>`
            
            if (state.effects.gleam.active) lineGlow += `<tspan x="${xPos}" fill="${fillColor}">${safeChar}</tspan>`
            if (state.effects.radiance.active) lineRad += `<tspan x="${xPos}" fill="#ffffff">${safeChar}</tspan>`
            if (state.effects.chromatic.active) {
              lineRed += `<tspan x="${Number((xPos - state.effects.chromatic.value).toFixed(1))}">${safeChar}</tspan>`
              lineCyan += `<tspan x="${Number((xPos + state.effects.chromatic.value).toFixed(1))}">${safeChar}</tspan>`
            }
          }
          
          lineMain += `</text>\n`
          lineGlow += `</text>\n`
          lineRad += `</text>\n`
          lineRed += `</text>\n`
          lineCyan += `</text>\n`

          if (hasContent) {
            mainTextTags += lineMain
            if (state.effects.gleam.active) glowTags += lineGlow
            if (state.effects.radiance.active) radianceTags += lineRad
            if (state.effects.chromatic.active) {
              chromaticRedTags += lineRed
              chromaticCyanTags += lineCyan
            }
          }
        }

        let svg = `<svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">\n`
        
        svg += `<defs>\n`
        if (state.effects.noise.active) {
            svg += `<filter id="noise-filter">\n<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>\n</filter>\n`
        }
        if (state.effects.scanlines.active) {
            svg += `<pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">\n<rect width="4" height="1" fill="rgba(0,0,0,${state.effects.scanlines.value / 100})" />\n</pattern>\n`
        }
        if (state.effects.vignette.active) {
            svg += `<radialGradient id="vignette">\n<stop offset="30%" stop-color="transparent" />\n<stop offset="100%" stop-color="rgba(0,0,0,${state.effects.vignette.value / 100})" />\n</radialGradient>\n`
        }
        
        let presetBg = { defs: '', body: '' }
        if (state.bgMode === 'preset') {
          presetBg = getSvgBackgroundPreset(state.activePreset, targetWidth, targetHeight)
          svg += presetBg.defs
        }

        svg += `</defs>\n`

        if (state.bgMode === 'solid') {
            svg += `<rect id="Canvas-Background" width="100%" height="100%" fill="${state.bgColor}"/>\n`
        } else if (state.bgMode === 'preset') {
            svg += `<g id="Preset-Background">\n${presetBg.body}</g>\n`
        }
        
        svg += `<g id="Typography-Engine" font-family="Courier New, monospace" font-size="${state.size * 1.5}" font-weight="bold" text-anchor="start" dominant-baseline="text-before-edge">\n`
        
        if (state.effects.chromatic.active) {
          svg += `<g id="Figma-Layer-Chromatic-Red" fill="#ff0000" opacity="0.6" style="mix-blend-mode: screen;">\n${chromaticRedTags}</g>\n`
          svg += `<g id="Figma-Layer-Chromatic-Cyan" fill="#00ffff" opacity="0.6" style="mix-blend-mode: screen;">\n${chromaticCyanTags}</g>\n`
        }

        if (state.effects.gleam.active) svg += `<g id="Figma-Layer-Gleam" opacity="0.5">\n${glowTags}</g>\n`
        if (state.effects.radiance.active) svg += `<g id="Figma-Layer-Radiance" opacity="0.6" style="mix-blend-mode: screen;">\n${radianceTags}</g>\n`

        svg += `<g id="Figma-Main-Text">\n${mainTextTags}</g>\n`
        svg += `</g>\n`

        if (state.effects.glass.active) {
            svg += `<path id="Figma-Layer-Glass-Effect" d="M0,0 L${targetWidth},0 L${targetWidth},${targetHeight * 0.4} Q${targetWidth * 0.5},${targetHeight * 0.6} 0,${targetHeight * 0.3} Z" fill="rgba(255,255,255,${state.effects.glass.value / 100})" opacity="0.5" pointer-events="none" />\n`
        }

        if (state.effects.noise.active) svg += `<rect id="Noise-Overlay" width="100%" height="100%" filter="url(#noise-filter)" opacity="${state.effects.noise.value / 100}" style="mix-blend-mode: overlay;" pointer-events="none" />\n`
        if (state.effects.scanlines.active) svg += `<rect id="Scanlines-Overlay" width="100%" height="100%" fill="url(#scanlines)" pointer-events="none" />\n`
        if (state.effects.vignette.active) svg += `<rect id="Vignette-Overlay" width="100%" height="100%" fill="url(#vignette)" pointer-events="none" />\n`

        svg += `</svg>`
        resolve(svg)
      }
      img.src = state.imageSrc
    })
}