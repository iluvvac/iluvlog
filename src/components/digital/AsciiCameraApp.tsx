"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

const RENDER_STYLES = [
  { id: 'ascii', name: 'ASCII', type: 'text', data: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$", icon: 'A' },
  { id: 'binary', name: 'BIN', type: 'text', data: " 01", icon: '1' },
  { id: 'dots', name: 'DOTS', type: 'shape', data: 'circle', icon: '●' },
  { id: 'blocks', name: 'CUBE', type: 'shape', data: 'square', icon: '■' },
  { id: 'lines', name: 'WAVE', type: 'shape', data: 'line', icon: '▬' },
];

const COLORS = [
  { name: 'Original', value: '#ffffff' },
  { name: 'Matrix', value: '#22c55e' },
  { name: 'Terminal', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyber', value: '#ef4444' },
  { name: 'Neon', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' }
];

const EFFECTS = [
  { id: 'none', label: 'None', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> },
  { id: 'bloom', label: 'Bloom', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /> },
  { id: 'chromatic', label: 'Chroma', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /> },
  { id: 'ghost-white', label: 'White', customIcon: <div className="w-4 h-4 bg-white rounded-sm shadow-sm" /> },
  { id: 'ghost-black', label: 'Black', customIcon: <div className="w-4 h-4 bg-zinc-900 border border-white/50 rounded-sm" /> },
];

const DENSITIES = [
  { label: '0.5x', value: 24 },
  { label: '1x', value: 16 },
  { label: '2x', value: 10 },
  { label: '3x', value: 6 },
];

export default function AsciiCameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [model, setModel] = useState<bodyPix.BodyPix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Customization state
  const [renderStyle, setRenderStyle] = useState<string>('ascii');
  const [asciiColor, setAsciiColor] = useState('#22c55e');
  const [asciiSize, setAsciiSize] = useState(10);
  const [effect, setEffect] = useState('none');
  
  // UI Menu state
  const [activeMenu, setActiveMenu] = useState<'none' | 'style' | 'effect' | 'color' | 'size'>('none');
  
  const settingsRef = useRef({
    renderStyle, asciiColor, asciiSize, effect
  });

  useEffect(() => {
    settingsRef.current = { renderStyle, asciiColor, asciiSize, effect };
  }, [renderStyle, asciiColor, asciiSize, effect]);
  
  const segmentationRef = useRef<bodyPix.SemanticPersonSegmentation | null>(null);
  const requestRef = useRef<number>(0);
  const segmentRef = useRef<number>(0);

  // Initialize TensorFlow & Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const net = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.50,
          quantBytes: 2
        });
        setModel(net);
      } catch (err) {
        console.error("Failed to load model", err);
        setError("Failed to load body segmentation model.");
      }
    };
    loadModel();
  }, []);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing camera", err);
          setError("Failed to access camera. Please check permissions.");
        }
      } else {
        setError("Camera API not supported in this browser.");
      }
    };
    
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(requestRef.current);
      clearTimeout(segmentRef.current);
    };
  }, []);

  // Main Render Loop
  useEffect(() => {
    if (!model || !videoRef.current || !hiddenCanvasRef.current || !displayCanvasRef.current) return;

    const video = videoRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    const displayCtx = displayCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!displayCtx) return;

    const renderFrame = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (loading) setLoading(false);
        
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cw = containerRef.current?.clientWidth || vw;
        const ch = containerRef.current?.clientHeight || vh;
        
        const videoAspect = vw / vh;
        
        let drawWidth = cw;
        let drawHeight = cw / videoAspect;
        
        if (drawHeight < ch) {
          drawHeight = ch;
          drawWidth = ch * videoAspect;
        }
        
        if (displayCanvas.width !== cw || displayCanvas.height !== ch) {
          displayCanvas.width = cw;
          displayCanvas.height = ch;
        }
        
        const xOffset = (cw - drawWidth) / 2;
        const yOffset = (ch - drawHeight) / 2;
        
        displayCtx.save();
        displayCtx.translate(cw, 0);
        displayCtx.scale(-1, 1);
        displayCtx.drawImage(video, xOffset, yOffset, drawWidth, drawHeight);
        displayCtx.restore();

        const segmentation = segmentationRef.current;
        if (segmentation) {
          const { renderStyle, asciiColor, asciiSize, effect } = settingsRef.current;
          const currentStyle = RENDER_STYLES.find(s => s.id === renderStyle) || RENDER_STYLES[0];
          
          const sampleWidth = Math.floor(cw / asciiSize);
          const sampleHeight = Math.floor(ch / asciiSize);
          
          hiddenCanvas.width = sampleWidth;
          hiddenCanvas.height = sampleHeight;
          const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
          
          if (hiddenCtx) {
            hiddenCtx.save();
            hiddenCtx.translate(sampleWidth, 0);
            hiddenCtx.scale(-1, 1);
            
            const sDrawW = sampleWidth * (drawWidth / cw);
            const sDrawH = sampleHeight * (drawHeight / ch);
            const sxOff = (sampleWidth - sDrawW) / 2;
            const syOff = (sampleHeight - sDrawH) / 2;
            
            hiddenCtx.drawImage(video, sxOff, syOff, sDrawW, sDrawH);
            hiddenCtx.restore();
            
            const imageData = hiddenCtx.getImageData(0, 0, sampleWidth, sampleHeight);
            const pixels = imageData.data;
            const maskData = segmentation.data;
            const maskWidth = segmentation.width;
            
            displayCtx.font = `bold ${asciiSize}px monospace`;
            displayCtx.textBaseline = 'top';
            displayCtx.textAlign = 'left';
            
            for (let row = 0; row < sampleHeight; row++) {
              for (let col = 0; col < sampleWidth; col++) {
                
                const displayX = col * asciiSize;
                const displayY = row * asciiSize;
                const videoX = Math.floor(((cw - xOffset - displayX) / drawWidth) * vw);
                const videoY = Math.floor(((displayY - yOffset) / drawHeight) * vh);
                
                if (videoX >= 0 && videoX < vw && videoY >= 0 && videoY < vh) {
                  const maskOffset = videoY * maskWidth + videoX;
                  const isPerson = maskData[maskOffset] === 1;
                  
                  if (isPerson) {
                    if (effect === 'ghost-white') {
                      displayCtx.fillStyle = '#ffffff';
                      displayCtx.fillRect(displayX, displayY, asciiSize, asciiSize);
                    } else if (effect === 'ghost-black') {
                      displayCtx.fillStyle = '#000000';
                      displayCtx.fillRect(displayX, displayY, asciiSize, asciiSize);
                    } else {
                      displayCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                      displayCtx.fillRect(displayX, displayY, asciiSize, asciiSize);
                    }
                    
                    const pxOffset = (row * sampleWidth + col) * 4;
                    const r = pixels[pxOffset];
                    const g = pixels[pxOffset + 1];
                    const b = pixels[pxOffset + 2];
                    
                    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                    let alpha = Math.max(0.4, brightness / 255);
                    const normalizedBrightness = brightness / 255;
                    
                    if (effect === 'ghost-white' || effect === 'ghost-black') {
                      alpha = 1.0;
                    }
                    
                    displayCtx.fillStyle = asciiColor;
                    if (effect === 'bloom') {
                      displayCtx.shadowColor = asciiColor;
                      displayCtx.shadowBlur = 10;
                    } else {
                      displayCtx.shadowBlur = 0;
                    }
                    
                    const renderShape = (xOffset: number, colorOverride?: string) => {
                      if (colorOverride) displayCtx.fillStyle = colorOverride;
                      displayCtx.globalAlpha = alpha;
                      
                      if (currentStyle.type === 'text') {
                        const charSet = currentStyle.data;
                        const charIndex = Math.floor(normalizedBrightness * (charSet.length - 1));
                        displayCtx.fillText(charSet[charIndex], displayX + xOffset, displayY);
                      } else if (currentStyle.type === 'shape') {
                        const size = normalizedBrightness * asciiSize;
                        const centerOffset = (asciiSize - size) / 2;
                        
                        if (currentStyle.data === 'circle') {
                          displayCtx.beginPath();
                          displayCtx.arc(displayX + xOffset + asciiSize/2, displayY + asciiSize/2, size/2, 0, Math.PI * 2);
                          displayCtx.fill();
                        } else if (currentStyle.data === 'square') {
                          displayCtx.fillRect(displayX + xOffset + centerOffset, displayY + centerOffset, size, size);
                        } else if (currentStyle.data === 'line') {
                          displayCtx.fillRect(displayX + xOffset, displayY + centerOffset, asciiSize, size);
                        }
                      }
                    };

                    if (effect === 'chromatic') {
                      renderShape(-3, '#ff0000');
                      renderShape(0, '#00ff00');
                      renderShape(3, '#0044ff');
                    } else {
                      renderShape(0);
                    }
                    
                    displayCtx.shadowBlur = 0;
                  }
                }
              }
            }
            displayCtx.globalAlpha = 1.0;
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(renderFrame);
    };

    const runSegmentation = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const seg = await model.segmentPerson(video, {
          internalResolution: 'medium',
          segmentationThreshold: 0.7,
          maxDetections: 1
        });
        segmentationRef.current = seg;
      }
      segmentRef.current = window.setTimeout(runSegmentation, 100);
    };

    video.addEventListener('loadeddata', () => {
      renderFrame();
      runSegmentation();
    });

  }, [model, loading]);

  const handleCapture = () => {
    if (displayCanvasRef.current) {
      const dataUrl = displayCanvasRef.current.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleDownload = () => {
    if (capturedImage) {
      const a = document.createElement('a');
      a.href = capturedImage;
      a.download = `ascii-capture-${Date.now()}.jpg`;
      a.click();
    }
  };

  const toggleMenu = (menu: 'style' | 'effect' | 'color' | 'size') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden font-sans rounded-b-xl select-none relative">
      
      {/* Main Camera Viewport (Full Bleed) */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full bg-zinc-900 overflow-hidden z-0"
        onClick={() => setActiveMenu('none')} // Dismiss menus when tapping viewport
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-red-950/90 p-6 text-center">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        )}
        
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/70 text-xs tracking-widest uppercase font-medium">
              {!model ? "Initializing AI..." : "Starting Camera..."}
            </p>
          </div>
        )}
        
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={hiddenCanvasRef} className="hidden" />
        <canvas ref={displayCanvasRef} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />

        {capturedImage && (
          <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
            <div className="relative w-full max-w-2xl max-h-[70vh] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/20 flex justify-center bg-black">
              <img src={capturedImage} alt="Captured" className="w-auto h-full max-h-[70vh] object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Area - App Drawer Style */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col justify-end pt-32 pb-6 sm:pb-8 z-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        
        {capturedImage ? (
          <div className="flex justify-center gap-4 sm:gap-6 w-full px-4">
            <button 
              onClick={() => setCapturedImage(null)}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold tracking-wide transition-colors shadow-lg"
            >
              Discard
            </button>
            <button 
              onClick={handleDownload}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-semibold tracking-wide transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Save Photo
            </button>
          </div>
        ) : (
          <div className="flex flex-col relative w-full">
            
            {/* Pop-up Menus Area (Absolute positioned to prevent layout shift) */}
            <div 
              className={`absolute bottom-full left-0 w-full flex justify-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-50 pointer-events-none ${
                activeMenu !== 'none' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className={`mb-6 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-300 pointer-events-auto max-w-[90vw] ${
                activeMenu !== 'none' ? 'h-24 px-4 sm:px-6' : 'h-0 px-0 border-transparent'
              }`}>
                
                {/* 1. COLORS MENU */}
                {activeMenu === 'color' && (
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-center h-full">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setAsciiColor(c.value)}
                        className={`flex flex-col items-center gap-1.5 snap-center shrink-0 transition-all ${
                          asciiColor === c.value ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80 scale-90'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full border-2 ${asciiColor === c.value ? 'border-white shadow-[0_0_15px_currentColor]' : 'border-transparent'}`}
                          style={{ backgroundColor: c.value, color: c.value }}
                        />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. STYLE MENU */}
                {activeMenu === 'style' && (
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-center h-full">
                    {RENDER_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setRenderStyle(s.id)}
                        className={`flex flex-col items-center gap-1.5 snap-center shrink-0 transition-all w-16 ${
                          renderStyle === s.id ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80 scale-90'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-zinc-800/80 border transition-colors ${renderStyle === s.id ? 'border-white text-white shadow-lg bg-zinc-700' : 'border-white/5 text-white/50'}`}>
                          {s.icon}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase">{s.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. EFFECTS MENU */}
                {activeMenu === 'effect' && (
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-center h-full">
                    {EFFECTS.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setEffect(e.id)}
                        className={`flex flex-col items-center gap-1.5 snap-center shrink-0 transition-all w-16 ${
                          effect === e.id ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80 scale-90'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-800/80 border transition-colors ${effect === e.id ? 'border-white text-white shadow-lg bg-zinc-700' : 'border-white/5 text-white/50'}`}>
                          {e.customIcon || (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{e.icon}</svg>
                          )}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase">{e.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. SIZE / DENSITY MENU */}
                {activeMenu === 'size' && (
                  <div className="flex gap-4 justify-center items-center h-full">
                    <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-inner min-w-[200px] justify-between">
                      {DENSITIES.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => setAsciiSize(d.value)}
                          className={`flex-1 h-10 px-4 rounded-xl text-xs font-bold transition-all ${
                            asciiSize === d.value ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Primary Controls (Always visible) */}
            <div className="flex items-center justify-between px-6 sm:px-12 mt-2">
              
              {/* Left Toggles */}
              <div className="flex gap-4 sm:gap-6 flex-1 justify-start">
                <button 
                  onClick={() => toggleMenu('style')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeMenu === 'style' 
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                      : 'bg-zinc-800/80 text-white border border-white/5 hover:bg-zinc-700/80 hover:border-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    activeMenu === 'style' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>Style</span>
                </button>
                
                <button 
                  onClick={() => toggleMenu('effect')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeMenu === 'effect' 
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                      : 'bg-zinc-800/80 text-white border border-white/5 hover:bg-zinc-700/80 hover:border-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    activeMenu === 'effect' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>FX</span>
                </button>
              </div>

              {/* Center Shutter */}
              <div className="flex-1 flex justify-center">
                <button 
                  onClick={handleCapture}
                  disabled={loading || !!error}
                  className="w-[76px] h-[76px] rounded-full border-[3px] border-white/80 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group hover:border-white shrink-0"
                >
                  <div className="w-[62px] h-[62px] rounded-full bg-white group-hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                </button>
              </div>

              {/* Right Toggles */}
              <div className="flex gap-4 sm:gap-6 flex-1 justify-end">
                <button 
                  onClick={() => toggleMenu('color')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden relative ${
                    activeMenu === 'color' 
                      ? 'shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 border-2 border-white' 
                      : 'border border-white/5 hover:border-white/20'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    {activeMenu === 'color' && <div className="absolute inset-0 bg-white/20"></div>}
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    activeMenu === 'color' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>Color</span>
                </button>
                
                <button 
                  onClick={() => toggleMenu('size')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeMenu === 'size' 
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                      : 'bg-zinc-800/80 text-white border border-white/5 hover:bg-zinc-700/80 hover:border-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7m3-3v6" />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    activeMenu === 'size' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>Size</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
