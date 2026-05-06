"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

interface Bbox {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export default function AsciiCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const predictionsRef = useRef<Bbox[]>([]);
  const requestRef = useRef<number>(0);
  const detectRef = useRef<number>(0);
  
  const ASCII_WIDTH = 120; 

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model", err);
        setError("Failed to load object detection model. Ensure you have internet connection to download the model weights.");
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing camera", err);
          setError("Failed to access camera. Please allow camera permissions in your browser.");
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
      clearTimeout(detectRef.current);
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current || !hiddenCanvasRef.current || !displayCanvasRef.current) return;

    const video = videoRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
    const displayCtx = displayCanvas.getContext('2d');
    
    if (!hiddenCtx || !displayCtx) return;

    const renderFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (loading) setLoading(false);
        
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        
        if (containerRef.current) {
           const cw = containerRef.current.clientWidth;
           const ch = containerRef.current.clientHeight;
           
           const containerAspect = cw / ch;
           const videoAspect = vw / vh;
           
           let drawWidth = cw;
           let drawHeight = cw / videoAspect;
           
           if (drawHeight > ch) {
             drawHeight = ch;
             drawWidth = ch * videoAspect;
           }
           
           if (displayCanvas.width !== drawWidth || displayCanvas.height !== drawHeight) {
             displayCanvas.width = drawWidth;
             displayCanvas.height = drawHeight;
           }
        }
        
        const charAspectRatio = 2; 
        const width = ASCII_WIDTH;
        const height = Math.floor(ASCII_WIDTH * (vh / vw) / charAspectRatio);
        
        if (hiddenCanvas.width !== width) hiddenCanvas.width = width;
        if (hiddenCanvas.height !== height) hiddenCanvas.height = height;
        
        hiddenCtx.drawImage(video, 0, 0, width, height);
        
        const imageData = hiddenCtx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        displayCtx.fillStyle = '#000000';
        displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        
        const charWidth = displayCanvas.width / width;
        const charHeight = displayCanvas.height / height;
        
        // Slightly smaller font than the slot to avoid overlaps
        displayCtx.font = `bold ${charHeight * 0.9}px monospace`;
        displayCtx.textBaseline = 'top';
        displayCtx.textAlign = 'left';
        
        displayCtx.save();
        displayCtx.scale(-1, 1);
        displayCtx.translate(-displayCanvas.width, 0);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = pixels[offset];
            const g = pixels[offset + 1];
            const b = pixels[offset + 2];
            
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
            const char = ASCII_CHARS[charIndex];
            
            const colorVal = Math.floor((brightness / 255) * 155) + 100;
            displayCtx.fillStyle = `rgb(0, ${colorVal}, 0)`;
            
            displayCtx.fillText(char, x * charWidth, y * charHeight);
          }
        }
        
        displayCtx.restore();

        const preds = predictionsRef.current;
        if (preds && preds.length > 0) {
          displayCtx.lineWidth = 2;
          displayCtx.strokeStyle = '#22c55e';
          displayCtx.font = 'bold 16px monospace';
          
          preds.forEach(pred => {
            const [bx, by, bw, bh] = pred.bbox;
            
            const mappedX = (bx / vw) * displayCanvas.width;
            const mappedY = (by / vh) * displayCanvas.height;
            const mappedW = (bw / vw) * displayCanvas.width;
            const mappedH = (bh / vh) * displayCanvas.height;
            
            const flippedX = displayCanvas.width - mappedX - mappedW;
            
            displayCtx.strokeRect(flippedX, mappedY, mappedW, mappedH);
            
            const label = `${pred.class} ${Math.round(pred.score * 100)}%`;
            const textWidth = displayCtx.measureText(label).width;
            
            displayCtx.fillStyle = 'rgba(34, 197, 94, 0.2)';
            displayCtx.fillRect(flippedX, mappedY, mappedW, mappedH);
            
            displayCtx.fillStyle = '#22c55e';
            displayCtx.fillRect(flippedX, mappedY - 24, textWidth + 12, 24);
            
            displayCtx.fillStyle = '#000000';
            displayCtx.fillText(label, flippedX + 6, mappedY - 20);
          });
        }
      }
      
      requestRef.current = requestAnimationFrame(renderFrame);
    };

    const detectObjects = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const preds = await model.detect(video);
        predictionsRef.current = preds as Bbox[];
      }
      detectRef.current = window.setTimeout(detectObjects, 150); // ~7 FPS
    };

    video.addEventListener('loadeddata', () => {
      renderFrame();
      detectObjects();
    });

  }, [model, loading]);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center bg-black overflow-hidden rounded-b-xl">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-red-950/90 backdrop-blur-sm p-6 text-center">
          <div className="bg-black border border-red-500/50 p-6 rounded-lg max-w-md shadow-2xl">
            <h3 className="text-red-500 font-mono text-xl mb-2 font-bold uppercase tracking-widest">System Error</h3>
            <p className="text-red-400 font-mono text-sm leading-relaxed">{error}</p>
          </div>
        </div>
      )}
      
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            <div className="text-center">
               <p className="text-green-500 font-mono text-sm uppercase tracking-[0.2em] mb-1">
                 {!model ? "INITIALIZING NEURAL NETWORK" : "ACCESSING OPTICAL SENSOR"}
               </p>
               <p className="text-green-500/50 font-mono text-xs uppercase tracking-widest animate-pulse">
                 Please wait...
               </p>
            </div>
          </div>
        </div>
      )}
      
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={hiddenCanvasRef} className="hidden" />
      
      <canvas 
        ref={displayCanvasRef} 
        className="max-w-full max-h-full object-contain pointer-events-none" 
      />
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-green-500/30"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-green-500/30"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-green-500/30"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-green-500/30"></div>
    </div>
  );
}
