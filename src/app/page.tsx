'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useTranslations } from '@/i18n/provider'
import LanguageSelector from '@/components/LanguageSelector'

// Typing Effect Component - Memoized for performance
const TypingEffect = React.memo(function TypingEffect({ texts, className = '' }: { texts: string[], className?: string }) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentText = texts[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          // Store the pause timeout reference for cleanup
          pauseTimeoutRef.current = setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => {
      clearTimeout(timeout)
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [charIndex, isDeleting, textIndex, texts])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-boo-blue">|</span>
    </span>
  )
})

// Floating Shapes Component - Memoized (static content)
const FloatingShapes = React.memo(function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hexagon */}
      <div className="absolute top-20 left-[10%] w-16 h-16 opacity-20 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full text-boo-blue">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* Triangle */}
      <div className="absolute top-40 right-[15%] w-12 h-12 opacity-15 animate-float-delayed">
        <svg viewBox="0 0 100 100" className="w-full h-full text-boo-green">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* Circle with dot */}
      <div className="absolute bottom-40 left-[20%] w-20 h-20 opacity-10 animate-spin-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-boo-blue">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="10" r="5" fill="currentColor"/>
        </svg>
      </div>
      
      {/* Square rotated */}
      <div className="absolute top-60 left-[5%] w-10 h-10 opacity-20 animate-float-reverse">
        <div className="w-full h-full border-2 border-boo-blue/50 rotate-45"></div>
      </div>
      
      {/* Plus sign */}
      <div className="absolute bottom-60 right-[10%] w-8 h-8 opacity-15 animate-pulse-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-boo-green">
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="8"/>
          <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="8"/>
        </svg>
      </div>
      
      {/* Dots grid */}
      <div className="absolute top-1/2 right-[5%] opacity-10">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-boo-blue animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}/>
          ))}
        </div>
      </div>
      
      {/* Corner brackets */}
      <div className="absolute top-32 right-[25%] w-16 h-16 opacity-20 animate-float">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-boo-blue"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-boo-blue"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-boo-blue"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-boo-blue"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-boo-blue rounded-full animate-ping opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-boo-green rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
    </div>
  )
})

// Scan Line Effect - Memoized (static content)
const ScanLines = React.memo(function ScanLines() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
      <div className="w-full h-full" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
      }}></div>
    </div>
  )
})

// 3D Floating Console Component
function Floating3DConsole() {
  return (
    <div className="perspective-1000 absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:block">
      <div className="preserve-3d animate-float-3d w-72 h-48">
        {/* Server/Console body */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl"
          style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}>
          {/* Screen */}
          <div className="absolute inset-3 bg-boo-dark rounded-lg overflow-hidden crt-effect">
            <div className="absolute inset-0 bg-gradient-to-b from-boo-blue/10 to-transparent"></div>
            {/* Boosteroid Server Specs */}
            <div className="p-2 font-mono text-[7px] text-boo-green space-y-0.5">
              <div className="text-white/70 text-[6px] mb-1">BOOSTEROID SERVER</div>
              <div className="flex justify-between">
                <span className="text-white/40">CPU</span>
                <span className="text-red-400">AMD EPYC Zen 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">RAM</span>
                <span className="text-boo-blue">DDR5 28GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">GPU</span>
                <span className="text-boo-green">RX 7900 XT 20GB</span>
              </div>
              <div className="flex justify-between mt-1 pt-1 border-t border-white/10">
                <span className="text-white/40">RES</span>
                <span className="text-white">4K Ultra</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">LAT</span>
                <span className="text-boo-blue animate-pulse">~12ms</span>
              </div>
            </div>
          </div>
          {/* Status LEDs */}
          <div className="absolute bottom-2 left-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-boo-green animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <div className="w-2 h-2 rounded-full bg-boo-blue animate-pulse shadow-[0_0_8px_#00a3ff]" style={{ animationDelay: '0.5s' }}></div>
          </div>
          {/* AMD Badge */}
          <div className="absolute bottom-2 right-3 text-[6px] font-bold text-red-500/80">AMD</div>
        </div>
      </div>
    </div>
  )
}

// 3D Floating GPU Card
function Floating3DGPU() {
  return (
    <div className="perspective-1000 absolute -left-16 top-1/3 hidden xl:block">
      <div className="preserve-3d animate-float-3d w-48 h-32" style={{ animationDelay: '1s' }}>
        <div className="relative w-full h-full"
          style={{ transform: 'rotateY(20deg) rotateX(-5deg)' }}>
          {/* GPU Body */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-white/10">
            {/* Fans */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-gray-600 animate-spin-slow"></div>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-gray-600 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
            </div>
            {/* RGB Strip */}
            <div className="absolute bottom-3 left-3 right-3 h-1 rounded-full bg-gradient-to-r from-red-500 via-boo-blue to-red-500 animate-gradient bg-[length:200%_100%]"></div>
            {/* Label */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[7px] font-mono text-white/40 whitespace-nowrap">RADEON RX 7900 XT</div>
            {/* Memory Spec */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[5px] font-mono text-red-400/60 whitespace-nowrap">20GB GDDR6</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Retro Arcade Cabinet (3D)
function RetroArcade() {
  return (
    <div className="perspective-1000 relative inline-block">
      <div className="preserve-3d w-32 h-48 animate-float-3d" style={{ animationDelay: '0.5s' }}>
        <div style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }} className="relative w-full h-full">
          {/* Cabinet body */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-purple-950 rounded-t-lg border border-purple-500/30 neon-box text-purple-500">
            {/* Screen */}
            <div className="absolute top-2 left-2 right-2 h-20 bg-black rounded border border-purple-500/50 overflow-hidden crt-effect">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-boo-green font-mono text-xs neon-text">4K</span>
              </div>
            </div>
            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_#ff0000]"></div>
            {/* Joystick */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Neon Grid Floor Component
function NeonGridFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden opacity-30">
      <div className="retro-grid w-full h-full"></div>
      {/* Horizon glow */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-boo-blue/20 to-transparent"></div>
    </div>
  )
}

// 3D Controller Component
function Controller3D() {
  return (
    <div className="perspective-1000 inline-block">
      <div className="preserve-3d animate-float-3d">
        <div className="w-24 h-16 relative" style={{ transform: 'rotateX(20deg) rotateY(-10deg)' }}>
          {/* Controller body */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full border border-white/10">
            {/* Left stick */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>
            {/* Right stick */}
            <div className="absolute bottom-2 right-6 w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>
            {/* Buttons */}
            <div className="absolute top-2 right-2 grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 rounded-full bg-boo-green"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-boo-blue"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            </div>
            {/* Center light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-boo-blue animate-pulse shadow-[0_0_10px_#00a3ff]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Gaming Decorations - GPU, Controllers, Circuits - Memoized
const PixelDecorations = React.memo(function PixelDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* GPU Icon */}
      <div className="absolute top-20 right-[20%] opacity-15 animate-float">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-boo-blue">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 6V4M10 6V4M14 6V4M18 6V4" />
          <path d="M6 18v2M10 18v2M14 18v2M18 18v2" />
          <circle cx="7" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="17" cy="12" r="2" />
        </svg>
      </div>
      
      {/* Graphics Card */}
      <div className="absolute top-40 left-[15%] opacity-20 animate-float-delayed">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-boo-green">
          <rect x="1" y="4" width="22" height="14" rx="2" />
          <path d="M5 8h4v6H5z" />
          <path d="M11 8h3v3h-3zM11 13h3v3h-3z" />
          <path d="M16 8h3v8h-3z" />
          <path d="M4 18v2M8 18v2M12 18v2M16 18v2M20 18v2" />
        </svg>
      </div>
      
      {/* Controller */}
      <div className="absolute bottom-32 right-[25%] opacity-15 animate-pulse">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-purple-500">
          <path d="M6 11h4M8 9v4" />
          <circle cx="17" cy="10" r="1" />
          <circle cx="15" cy="12" r="1" />
          <path d="M2 13a2 2 0 012-2h16a2 2 0 012 2v2a6 6 0 01-6 6h-8a6 6 0 01-6-6v-2z" />
        </svg>
      </div>
      
      {/* CPU Chip */}
      <div className="absolute top-1/3 left-[10%] opacity-10 animate-pulse-slow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-boo-blue">
          <rect x="5" y="5" width="14" height="14" rx="1" />
          <rect x="8" y="8" width="8" height="8" rx="1" />
          <path d="M8 2v3M12 2v3M16 2v3M8 19v3M12 19v3M16 19v3" />
          <path d="M2 8h3M2 12h3M2 16h3M19 8h3M19 12h3M19 16h3" />
        </svg>
      </div>
      
      {/* Memory/RAM */}
      <div className="absolute top-1/2 right-[8%] opacity-15 animate-spin-slow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-boo-green">
          <rect x="3" y="8" width="18" height="8" rx="1" />
          <path d="M6 8V6M9 8V6M12 8V6M15 8V6M18 8V6" />
          <path d="M6 16v2M9 16v2M12 16v2M15 16v2M18 16v2" />
        </svg>
      </div>
      
      {/* Circuit Pattern */}
      <div className="absolute bottom-40 left-[5%] opacity-20 animate-float">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-cyan-400">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v7M12 15v7" />
          <path d="M2 12h7M15 12h7" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
})

// Browser Icons
const BrowserIcons = {
  Chrome: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-2 mx-auto">
      <title>Google Chrome</title>
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z"/>
    </svg>
  ),
  Firefox: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-2 mx-auto">
      <title>Firefox</title>
      <path d="M8.824 7.287c.008 0 .004 0 0 0zm-2.8-1.4c.006 0 .003 0 0 0zm16.754 2.161c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z"/>
    </svg>
  ),
  Edge: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-2 mx-auto">
      <title>Microsoft Edge</title>
      <path d="M21.86 17.86q.14 0 .25.12.1.13.1.25t-.11.33l-.32.46-.43.53-.44.5q-.21.25-.38.42l-.22.23q-.58.53-1.34 1.04-.76.51-1.6.91-.86.4-1.74.64t-1.67.24q-.9 0-1.69-.28-.8-.28-1.48-.78-.68-.5-1.22-1.17-.53-.66-.92-1.44-.38-.77-.58-1.6-.2-.83-.2-1.67 0-1 .32-1.96.33-.97.87-1.8.14.95.55 1.77.41.82 1.02 1.5.6.68 1.38 1.21.78.54 1.64.9.86.36 1.77.56.92.2 1.8.2 1.12 0 2.18-.24 1.06-.23 2.06-.72l.2-.1.2-.05zm-15.5-1.27q0 1.1.27 2.15.27 1.06.78 2.03.51.96 1.24 1.77.74.82 1.66 1.4-1.47-.2-2.8-.74-1.33-.55-2.48-1.37-1.15-.83-2.08-1.9-.92-1.07-1.58-2.33T.36 14.94Q0 13.54 0 12.06q0-.81.32-1.49.31-.68.83-1.23.53-.55 1.2-.96.66-.4 1.35-.66.74-.27 1.5-.39.78-.12 1.55-.12.7 0 1.42.1.72.12 1.4.35.68.23 1.32.57.63.35 1.16.83-.35 0-.7.07-.33.07-.65.23v-.02q-.63.28-1.2.74-.57.46-1.05 1.04-.48.58-.87 1.26-.38.67-.65 1.39-.27.71-.42 1.44-.15.72-.15 1.38zM11.96.06q1.7 0 3.33.39 1.63.38 3.07 1.15 1.43.77 2.62 1.93 1.18 1.16 1.98 2.7.49.94.76 1.96.28 1 .28 2.08 0 .89-.23 1.7-.24.8-.69 1.48-.45.68-1.1 1.22-.64.53-1.45.88-.54.24-1.11.36-.58.13-1.16.13-.42 0-.97-.03-.54-.03-1.1-.12-.55-.1-1.05-.28-.5-.19-.84-.5-.12-.09-.23-.24-.1-.16-.1-.33 0-.15.16-.35.16-.2.35-.5.2-.28.36-.68.16-.4.16-.95 0-1.06-.4-1.96-.4-.91-1.06-1.64-.66-.74-1.52-1.28-.86-.55-1.79-.89-.84-.3-1.72-.44-.87-.14-1.76-.14-1.55 0-3.06.45T.94 7.55q.71-1.74 1.81-3.13 1.1-1.38 2.52-2.35Q6.68 1.1 8.37.58q1.7-.52 3.58-.52Z"/>
    </svg>
  ),
  Opera: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-2 mx-auto">
      <title>Opera</title>
      <path d="M8.051 5.238c-1.328 1.566-2.186 3.883-2.246 6.48v.564c.061 2.598.918 4.912 2.246 6.479 1.721 2.236 4.279 3.654 7.139 3.654 1.756 0 3.4-.537 4.807-1.471C17.879 22.846 15.074 24 12 24c-.192 0-.383-.004-.57-.014C5.064 23.689 0 18.436 0 12 0 5.371 5.373 0 12 0h.045c3.055.012 5.84 1.166 7.953 3.055-1.408-.93-3.051-1.471-4.81-1.471-2.858 0-5.417 1.42-7.14 3.654h.003zM24 12c0 3.556-1.545 6.748-4.002 8.945-3.078 1.5-5.946.451-6.896-.205 3.023-.664 5.307-4.32 5.307-8.74 0-4.422-2.283-8.075-5.307-8.74.949-.654 3.818-1.703 6.896-.205C22.455 5.25 24 8.445 24 12z"/>
    </svg>
  ),
  Brave: (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-2 mx-auto">
      <title>Brave</title>
      <path d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z"/>
    </svg>
  ),
}

// Icons as React components
const Icons = {
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  maximize: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
}

// Features data - Based on actual script v3.7.2 capabilities
const features = [
  {
    title: 'Smart Device Profiling',
    description: <>Auto-detects <strong>CPU cores</strong>, <strong>RAM</strong>, network type, screen ratio to classify your system as <em>Low-End</em>, <em>Mid-Range</em> or <em>High-End</em>.</>,
    tag: 'AI-Powered',
  },
  {
    title: 'Smart Resolution Detector',
    description: <>Generates custom resolutions (<strong>1080p</strong>/<strong>2K</strong>/<strong>4K</strong>) perfectly aligned to your exact screen ratio: <em>16:9, 21:9, 32:9</em> and non-standard displays.</>,
    tag: 'Ultrawide',
  },
  {
    title: '5 Pro Presets',
    description: <><strong>Default</strong>, <strong>Cinematic</strong>, <strong>Competitive</strong>, <strong>Comfort</strong>, <strong>Perfect Quality</strong>. Presets are <em>OFF by default</em> — you choose.</>,
    tag: 'v3.7.2',
  },
  {
    title: 'Advanced Video Filters',
    description: <><strong>USM</strong>, <strong>CAS</strong> sharpening, clarity, denoising, anti-banding, vibrance, gamma. Organized in <em>Safe</em>, <em>Light</em>, <em>Balanced</em>, <em>Ultra</em> tiers.</>,
    tag: 'Pro Filters',
  },
  {
    title: 'Adaptive Quality',
    description: <>Auto-adjusts resolution and filters based on your <strong>hardware tier</strong> and real-time performance. <em>Seamless adaptation</em>.</>,
    tag: 'Auto-Tune',
  },
  {
    title: 'Smart Codec Selector',
    description: <>Probes MediaCapabilities to auto-select best codec: <strong>AV1</strong> &gt; <strong>HEVC</strong> &gt; H.264. <em>Hardware-accelerated</em> decoding.</>,
    tag: 'AV1 Ready',
  },
  {
    title: 'Ultrawide Mode',
    description: <>Full <strong>21:9</strong> and <strong>32:9</strong> support with object-fit:fill. Shortcut <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Ctrl+Alt+W</kbd></>,
    tag: '32:9 Support',
  },
  {
    title: 'Performance Mode',
    description: <><strong>One-click toggle</strong> to disable heavy filters (clarity, denoise, deband). <em>Perfect for competitive games</em> or weaker hardware.</>,
    tag: 'Quick Toggle',
  },
  {
    title: 'Stream Interceptor',
    description: <><em>Optional module</em> that intercepts config requests to force <strong>hardware decoding</strong> and push higher quality settings.</>,
    tag: 'Optional',
  },
  {
    title: 'SVG Filter Pipeline',
    description: <><strong>GPU-accelerated</strong> SVG filters for USM sharpening, contrast matrix, color correction. <em>Minimal CPU impact</em>.</>,
    tag: 'GPU Accel',
  },
  {
    title: 'Zero-Flicker Bootstrap',
    description: <>Applies video filters at startup <strong>without visible flash</strong>. Uses <code className="px-1 py-0.5 bg-white/10 rounded text-xs">requestIdleCallback</code> for <em>zero micro-freezes</em>.</>,
    tag: 'Slim & Fast',
  },
  {
    title: 'Dashboard Widget',
    description: <>Floating control panel on dashboard to <strong>configure resolution before launching</strong> a game. Quick access to all settings with <em>smooth animations</em>.</>,
    tag: 'v3.7.2',
  },
  {
    title: 'Multi-Monitor Support',
    description: <>Uses <code className="px-1 py-0.5 bg-white/10 rounded text-xs">getScreenDetails</code> API to detect multi-monitor setups and apply <strong>optimal resolution</strong> for each display. <em>Perfect for streamers</em>.</>,
    tag: 'New',
  },
]

// FAQ data - Based on actual v3.7.2 documentation
const faqs = [
  {
    question: 'Do I need a 4K monitor to use this?',
    answer: <><strong className="text-white">No!</strong> The Smart Resolution Detector generates custom resolutions (<strong className="text-boo-blue">1080p</strong>, <strong className="text-boo-blue">2K</strong>, <strong className="text-boo-blue">4K</strong>) aligned to your screen's exact aspect ratio. Boosteroid renders at higher resolution, then <em>downscales for sharper output</em> even on a 1080p display.</>,
  },
  {
    question: 'What are the 5 Presets available?',
    answer: <>① <strong className="text-white">Default</strong> <span className="text-white/40">(balanced)</span> ② <strong className="text-white">Cinematic</strong> <span className="text-white/40">(max filters)</span> ③ <strong className="text-white">Competitive</strong> <span className="text-white/40">(minimal processing)</span> ④ <strong className="text-white">Comfort</strong> <span className="text-white/40">(eye-care)</span> ⑤ <strong className="text-white">Perfect Quality</strong> <span className="text-white/40">(4K + max enhancement)</span></>,
  },
  {
    question: 'How does Smart Device Profiling work?',
    answer: <>The script auto-detects your <strong className="text-white">CPU cores</strong>, <strong className="text-white">RAM</strong>, network type, and screen ratio to classify your system as <span className="text-yellow-400">Low-End</span>, <span className="text-boo-blue">Mid-Range</span> or <span className="text-boo-green">High-End</span>. Settings are then adjusted <em>automatically</em>.</>,
  },
  {
    question: 'What video filters are available?',
    answer: <><strong className="text-white">USM &amp; CAS</strong> sharpening, clarity, denoise, anti-banding, vibrance, gamma/contrast. Organized in 4 tiers: <span className="text-green-400">Safe</span>, <span className="text-boo-blue">Light</span>, <span className="text-purple-400">Balanced</span>, and <span className="text-pink-400">Ultra</span>.</>,
  },
  {
    question: 'Is this safe to use? Will I get banned?',
    answer: <>The script runs <strong className="text-boo-green">100% client-side</strong>—it only enhances the video stream in your browser. It doesn't send data anywhere and doesn't modify Boosteroid's servers. <em className="text-white">Zero tracking, open-source on GitHub.</em></>,
  },
  {
    question: 'How do I enable Ultrawide mode?',
    answer: <>Press <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs font-mono">Ctrl+Alt+W</kbd> or enable from the dashboard. The Ultrawide module applies <code className="px-1 py-0.5 bg-white/10 rounded text-xs">object-fit:fill</code> to stretch the stream. Supports <strong className="text-white">21:9</strong> and <strong className="text-white">32:9</strong>.</>,
  },
  {
    question: 'What is the Stream Interceptor?',
    answer: <>An <em>optional module</em> that hooks Boosteroid's internal config requests to force <strong className="text-white">hardware decoding</strong>, enable hidden video stats, and push higher quality. <span className="text-white/40">Can be disabled if not needed.</span></>,
  },
  {
    question: 'How do I install Tampermonkey?',
    answer: <>Tampermonkey is a <strong className="text-boo-green">free</strong> browser extension available on <em>Chrome, Firefox, Edge, Opera, Brave and Safari</em>. Install from your browser's store, then click <strong className="text-boo-blue">"Install Script"</strong> to add Boosteroid Optimizer Plus with one click.</>,
  },
]

// Installation steps
const installSteps = [
  {
    step: 1,
    title: 'Install Tampermonkey',
    description: <>Get the <strong>free</strong> Tampermonkey browser extension from your browser's extension store. <em>Chrome, Firefox, Edge, Opera...</em></>,
    link: 'https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
    linkText: 'Get Tampermonkey',
  },
  {
    step: 2,
    title: 'Install the Script',
    description: <>Click the button below to install <strong>Boosteroid Optimizer Plus</strong> directly into Tampermonkey. <em>One click, done!</em></>,
    link: '#download',
    linkText: 'Install Script',
  },
  {
    step: 3,
    title: 'Launch Boosteroid',
    description: <>Go to <strong>Boosteroid</strong> and start any game. The optimizer <em>activates automatically</em>!</>,
    link: 'https://boosteroid.com/go/b/fA5oF',
    linkText: 'Open Boosteroid',
  },
]

// Header component - Gaming Floating Navbar with CRT retract effect
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [crtPhase, setCrtPhase] = useState<'normal' | 'compressing' | 'line' | 'fading' | 'hidden'>('normal')
  const { messages, locale, setLocale } = useTranslations()
  const t = messages.nav

  useEffect(() => {
    // Animate in on mount
    const timer = setTimeout(() => setVisible(true), 100)
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80
      
      // Si le menu mobile est ouvert, ne pas cacher la navbar
      if (mobileMenuOpen) {
        if (crtPhase !== 'normal') {
          setCrtPhase('normal')
        }
        return
      }
      
      if (isScrolled && crtPhase === 'normal') {
        // Phase 1: Compress to line
        setCrtPhase('compressing')
        setTimeout(() => {
          // Phase 2: Show line
          setCrtPhase('line')
          setTimeout(() => {
            // Phase 3: Fade line with jet effect
            setCrtPhase('fading')
            setTimeout(() => {
              // Phase 4: Fully hidden
              setCrtPhase('hidden')
            }, 400)
          }, 600)
        }, 400)
      } else if (!isScrolled && crtPhase !== 'normal') {
        // Return to normal
        setCrtPhase('normal')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [crtPhase, mobileMenuOpen])

  // Calculate styles based on phase
  const getWrapperStyles = () => {
    // Force normal styles when mobile menu is open
    if (mobileMenuOpen) {
      return {
        transform: 'scaleX(1) scaleY(1)',
        opacity: 1,
        filter: 'brightness(1)',
      }
    }
    
    switch (crtPhase) {
      case 'compressing':
        return {
          transform: 'scaleX(0.6) scaleY(0.15)',
          opacity: 1,
          filter: 'brightness(1.5)',
        }
      case 'line':
        return {
          transform: 'scaleX(0.5) scaleY(0.05)',
          opacity: 1,
          filter: 'brightness(2)',
        }
      case 'fading':
        return {
          transform: 'scaleX(0.1) scaleY(0.02)',
          opacity: 0.5,
          filter: 'brightness(3)',
        }
      case 'hidden':
        return {
          transform: 'scaleX(0) scaleY(0)',
          opacity: 0,
          filter: 'brightness(3)',
        }
      default:
        return {
          transform: 'scaleX(1) scaleY(1)',
          opacity: 1,
          filter: 'brightness(1)',
        }
    }
  }

  const wrapperStyles = getWrapperStyles()
  const isRetracted = crtPhase !== 'normal' && !mobileMenuOpen
  const showJetEffect = crtPhase === 'fading'

  return (
    <header 
      className={`
        fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      {/* CRT Retract Container */}
      <div className="navbar-crt-container relative">
        {/* CRT Wrapper with multi-phase animation */}
        <div 
          className="navbar-crt-wrapper w-full"
          style={{
            ...wrapperStyles,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, filter 0.3s ease',
            transformOrigin: 'center center',
            pointerEvents: isRetracted ? 'none' : 'auto',
          }}
        >
          {/* CRT Scanlines - visible during compression */}
          <div 
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none z-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              opacity: crtPhase === 'compressing' || crtPhase === 'line' ? 0.5 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
          
          {/* Gaming navbar container */}
          <nav 
            className="gaming-navbar gaming-shimmer navbar-content relative px-4 sm:px-6 lg:px-8 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl sm:rounded-3xl py-3"
            style={{
              opacity: (crtPhase === 'normal' || mobileMenuOpen) ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {/* Inner solid background */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#080c18] pointer-events-none z-0"></div>
            
            {/* Top highlight line */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-boo-blue/50 to-transparent pointer-events-none z-10"></div>
            
            {/* Bottom subtle line */}
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10"></div>
            
            <div className="relative z-10 flex items-center justify-between h-12">
              {/* Brand text - left side */}
              <a href="#" className="hidden md:flex items-center gap-1 text-white font-bold text-lg tracking-wide hover:text-boo-blue transition-colors duration-300">
                <span>Optimizer</span>
                <span className="text-boo-blue">Plus</span>
              </a>

              {/* Mobile: Brand + Actions */}
              <div className="md:hidden flex items-center justify-between w-full">
                <a href="#" className="flex items-center gap-1 text-white font-bold text-base tracking-wide">
                  <span>Optimizer</span>
                  <span className="text-boo-blue">Plus</span>
                </a>
                <div className="flex items-center gap-2">
                  {/* Language Globe - Mobile */}
                  <LanguageSelector currentLocale={locale} onLocaleChange={setLocale} compact />
                  
                  {/* Menu button */}
                  <button 
                    className="p-2 rounded-lg bg-boo-blue/10 border border-boo-blue/30 text-white/80 transition-all duration-300 hover:border-boo-blue/50 hover:bg-boo-blue/20 hover:text-white active:scale-95"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? Icons.x : Icons.menu}
                  </button>
                </div>
              </div>

              {/* Desktop nav - center */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { href: '#features', label: t.features },
                  { href: '#install', label: t.install },
                  { href: '#faq', label: t.faq },
                ].map((link) => (
                  <a 
                    key={link.href}
                    href={link.href} 
                    className="relative px-4 py-2 rounded-lg text-white/80 text-sm font-medium transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95 group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-boo-blue rounded-full group-hover:w-1/2 transition-all duration-300"></span>
                  </a>
                ))}
              </div>

              {/* Desktop: Right side actions */}
              <div className="hidden md:flex items-center gap-2">
                <a 
                  href="https://github.com/optimizerplus/optimizer-plus-v3.7.2" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-white/70 transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-95"
                  title="GitHub"
                >
                  {Icons.github}
                </a>

                <LanguageSelector currentLocale={locale} onLocaleChange={setLocale} />
                
                <a 
                  href="#download" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-boo-blue text-white text-sm font-semibold shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-all duration-300 hover:bg-boo-blue/90 hover:shadow-[0_0_25px_rgba(0,163,255,0.6)] hover:scale-105 active:scale-95"
                >
                  {Icons.download}
                  <span>Download</span>
                </a>
              </div>
            </div>

            <div 
              className={`
                md:hidden overflow-hidden relative z-10
                transition-all duration-300 ease-out
                ${mobileMenuOpen ? 'max-h-80 opacity-100 mt-3 pt-3 border-t border-white/10' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="flex flex-col gap-1 pb-2">
                {[
                  { href: '#features', label: t.features },
                  { href: '#install', label: t.install },
                  { href: '#faq', label: t.faq },
                ].map((link) => (
                  <a 
                    key={link.href}
                    href={link.href} 
                    className="px-4 py-3 rounded-lg text-white/80 font-medium transition-all duration-200 hover:text-white hover:bg-white/5 active:scale-[0.98]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="flex items-center gap-3 mt-2 pt-3 border-t border-white/10">
                  <a 
                    href="https://github.com/optimizerplus/optimizer-plus-v3.7.2" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white/70 bg-white/5 transition-all duration-200 hover:text-white hover:bg-white/10"
                  >
                    {Icons.github}
                    <span className="text-sm">GitHub</span>
                  </a>
                </div>
                
                <a 
                  href="#download" 
                  className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-boo-blue text-white font-semibold shadow-[0_0_15px_rgba(0,163,255,0.3)] transition-all duration-200 active:scale-[0.98]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {Icons.download}
                  <span>Download</span>
                </a>
              </div>
            </div>
          </nav>
          
          {/* CRT Line visible during compression phases */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            style={{
              opacity: crtPhase === 'line' || crtPhase === 'compressing' ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div 
              className="h-1 rounded-full"
              style={{
                width: crtPhase === 'compressing' ? '80%' : crtPhase === 'line' ? '60%' : '0%',
                background: 'linear-gradient(90deg, transparent 0%, #00a3ff 15%, #22c55e 35%, #ffffff 50%, #22c55e 65%, #00a3ff 85%, transparent 100%)',
                boxShadow: '0 0 15px #00a3ff, 0 0 30px #22c55e, 0 0 50px #00a3ff',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
        
        {/* CRT Jet effect - appears when line fades */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          style={{
            width: showJetEffect ? '30%' : '0%',
            height: '6px',
            background: showJetEffect 
              ? 'linear-gradient(90deg, transparent 0%, #00a3ff 20%, #ffffff 50%, #00a3ff 80%, transparent 100%)' 
              : 'transparent',
            borderRadius: '4px',
            opacity: showJetEffect ? 1 : 0,
            boxShadow: showJetEffect 
              ? '0 0 20px #00a3ff, 0 0 40px #22c55e, 0 0_60px #fff, 0 0 100px rgba(0,163,255,0.8)' 
              : 'none',
            transition: 'all 0.4s ease-out',
            filter: showJetEffect ? 'blur(1px)' : 'none',
          }}
        />
      </div>
    </header>
  )
}

// Hero section
function Hero() {
  const { messages } = useTranslations()
  const t = messages.hero
  const stats = messages.stats

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-animated-bg pt-24 overflow-hidden">
      {/* CRT Scanlines overlay */}
      <ScanLines />
      
      {/* Neon Grid Floor */}
      <NeonGridFloor />
      
      {/* Floating geometric shapes */}
      <FloatingShapes />
      
      {/* Pixel Art Decorations */}
      <PixelDecorations />
      
      {/* 3D Floating Elements */}
      <Floating3DConsole />
      <Floating3DGPU />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-blue-glow opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-boo-blue/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-boo-green/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Retro sun/horizon effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-t-full bg-gradient-to-t from-purple-900/20 via-pink-600/10 to-transparent opacity-30"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,163,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        {/* Main Logo - Professional display */}
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.png" 
            alt="Boosteroid Optimizer Plus" 
            className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 w-auto drop-shadow-[0_0_40px_rgba(0,163,255,0.6)] hover:drop-shadow-[0_0_60px_rgba(0,163,255,0.8)] transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* Badge with neon effect */}
        <div className="inline-flex items-center gap-2 bg-boo-dark/80 border border-boo-blue/30 rounded-full px-4 py-2 mb-6 animate-border-glow backdrop-blur-sm neon-box text-boo-blue">
          <span className="w-2 h-2 bg-boo-green rounded-full animate-ping" />
          <span className="text-sm text-white/80 font-mono">{t.badge}</span>
        </div>

        {/* Main title with glitch effect */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="opt-text-gradient animate-gradient bg-gradient-to-r from-boo-blue via-purple-500 to-boo-green neon-text text-boo-blue">{t.title}</span>
        </h1>

        {/* Subtitle */}
        <div className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-4 h-16 flex items-center justify-center">
          <span className="font-mono text-boo-blue">{t.subtitle}</span>
        </div>
        
        <p className="text-base text-white/50 max-w-2xl mx-auto mb-10">
          {t.description}
        </p>

        {/* CTA buttons with 3D hover effect */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#download" className="group perspective-1000">
            <div className="opt-btn-primary flex items-center gap-2 text-lg px-8 py-4 relative overflow-hidden card-3d neon-box text-boo-blue">
              <span className="absolute inset-0 bg-gradient-to-r from-boo-blue via-purple-600 to-boo-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {Icons.download}
                <span>{t.cta.install}</span>
              </span>
            </div>
          </a>
          <a href="#features" className="group opt-btn-secondary flex items-center gap-2 text-lg px-8 py-4 hover:border-boo-green transition-colors animate-glitch-skew">
            <span>{t.cta.features}</span>
            <span className="group-hover:translate-y-1 transition-transform">
              {Icons.chevronDown}
            </span>
          </a>
        </div>

        {/* 3D Controller decoration */}
        <div className="flex justify-center gap-8 mb-8 opacity-60">
          <Controller3D />
        </div>

        {/* Terminal-style Status Panel with CRT effect */}
        <div className="max-w-3xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 perspective-1000">
          <div className="card-3d scanline-overlay">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0c1017] rounded-t-lg border border-b-0 border-white/10">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer shadow-[0_0_8px_#ef4444]" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer shadow-[0_0_8px_#eab308]" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer shadow-[0_0_8px_#22c55e]" />
              </div>
              <span className="ml-2 text-xs font-mono text-white/50">
                <span className="text-boo-green neon-text">$</span> boosteroid-optimizer --status
              </span>
              <div className="ml-auto flex gap-2">
                <div className="w-4 h-4 border border-white/20 rounded-sm opacity-50"></div>
                <div className="w-4 h-4 border border-white/20 rounded-sm opacity-50"></div>
              </div>
            </div>
            
            {/* Terminal Body with CRT effect */}
            <div className="bg-[#080b10] border border-white/10 rounded-b-lg p-5 font-mono text-sm relative overflow-hidden crt-effect holographic-effect terminal-container">
              {/* Animated scan line */}
              <div className="terminal-scan-line"></div>
              
              {/* Data stream effect */}
              <div className="data-stream"></div>
              
              {/* Status Line - z-index to stay above scan line */}
              <div className="relative z-10 flex items-center gap-2 text-boo-green mb-4 neon-text">
                <span className="stat-indicator inline-block w-2 h-2 bg-boo-green rounded-full animate-ping shadow-[0_0_10px_#22c55e]"></span>
                <span className="animate-pulse">▸</span>
                <span>Optimizer Plus v3.7.2 active</span>
                <span className="terminal-cursor"></span>
                <span className="ml-auto text-white/20 text-xs">pid: 4832</span>
              </div>
              
              {/* Config Grid with enhanced 3D cards - z-index to stay above scan line */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 perspective-1000">
                <div className="terminal-stats-card glow-blue space-y-1 p-3 bg-white/[0.02] border border-white/10 hover:border-boo-blue/50 cursor-pointer group">
                  <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="stat-indicator w-1.5 h-1.5 bg-boo-blue rounded-full shadow-[0_0_5px_#00a3ff] group-hover:shadow-[0_0_15px_#00a3ff]"></span>
                    resolution
                  </div>
                  <div className="stat-value text-2xl sm:text-3xl font-bold text-white tabular-nums">3840<span className="text-white/40">×</span>2160</div>
                  <div className="text-xs text-boo-blue flex items-center gap-1 font-medium">
                    <span className="animate-bounce group-hover:animate-ping">↑</span> forced from 1080p
                  </div>
                </div>
                
                <div className="terminal-stats-card glow-green space-y-1 p-3 bg-white/[0.02] border border-white/10 hover:border-boo-green/50 cursor-pointer group">
                  <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="stat-indicator w-1.5 h-1.5 bg-boo-green rounded-full shadow-[0_0_5px_#22c55e] group-hover:shadow-[0_0_15px_#22c55e]"></span>
                    preset
                  </div>
                  <div className="stat-value text-2xl sm:text-3xl font-bold text-white">Perfect</div>
                  <div className="text-xs text-boo-green flex items-center gap-1 font-medium">
                    <span className="animate-pulse group-hover:animate-ping">●</span> quality mode
                  </div>
                </div>
                
                <div className="terminal-stats-card glow-purple space-y-1 p-3 bg-white/[0.02] border border-white/10 hover:border-purple-500/50 cursor-pointer group">
                  <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="stat-indicator w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_5px_#a855f7] group-hover:shadow-[0_0_15px_#a855f7]"></span>
                    device
                  </div>
                  <div className="stat-value text-2xl sm:text-3xl font-bold text-white">High</div>
                  <div className="text-xs text-purple-400 font-medium">end tier detected</div>
                </div>
                
                <div className="terminal-stats-card glow-pink space-y-1 p-3 bg-white/[0.02] border border-white/10 hover:border-pink-500/50 cursor-pointer group">
                  <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="stat-indicator w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_5px_#ec4899] group-hover:shadow-[0_0_15px_#ec4899]"></span>
                    filters
                  </div>
                  <div className="stat-value text-2xl sm:text-3xl font-bold text-white">CAS</div>
                  <div className="text-xs text-pink-400 font-medium">+ USM sharpening</div>
                </div>
              </div>
              
              {/* Bottom Status Bar - z-index to stay above scan line */}
              <div className="relative z-10 mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-4">
                  <span className="text-boo-blue/30 hover:text-boo-green transition-colors cursor-default pixel-border px-1">FREE</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/30 hover:text-boo-green transition-colors cursor-default">OPEN SOURCE</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/30 hover:text-boo-green transition-colors cursor-default">NO TRACKING</span>
                </div>
                <div className="text-white/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-boo-green rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                  client-side only
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with neon effect */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/30 uppercase tracking-widest font-mono">Scroll</span>
        <div className="animate-bounce text-boo-blue neon-text">
          {Icons.chevronDown}
        </div>
      </div>
    </section>
  )
}

// Features section
function Features() {
  const { messages } = useTranslations()
  const t = messages.features
  const items = t.items

  // Feature keys for mapping - Only user-visible features (8 total)
  const featureKeys = [
    'deviceProfiling', 'resolutionDetector', 'presets', 'videoFilters',
    'adaptiveQuality', 'codecSelector', 'lowLatency', 'dashboard'
  ] as const

  return (
    <section id="features" className="py-20 bg-boo-dark/30 relative overflow-hidden" aria-labelledby="features-heading">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 retro-grid opacity-20"></div>
      
      {/* Neon glow decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-boo-blue/5 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-boo-green/5 rounded-full blur-[100px] animate-pulse-slow"></div>
      
      {/* Pixel art corners */}
      <div className="absolute top-10 left-10 w-8 h-8 border-l-4 border-t-4 border-pink-500/40"></div>
      <div className="absolute top-10 right-10 w-8 h-8 border-r-4 border-t-4 border-cyan-400/40"></div>
      <div className="absolute bottom-10 left-10 w-8 h-8 border-l-4 border-b-4 border-cyan-400/40"></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 border-r-4 border-b-4 border-pink-500/40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header with arcade style */}
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 rgb-split" data-text={t.title}>
            <span className="opt-text-gradient neon-text text-boo-blue">{t.title}</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Features grid with 3D cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {featureKeys.map((key, i) => {
            const feature = items[key]
            return (
            <div 
              key={i} 
              className="group feature-card relative overflow-hidden card-3d preserve-3d"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Scanline effect on hover */}
              <div className="absolute inset-0 scanline-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Corner accent - Arcade style */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-boo-blue/50 to-transparent group-hover:h-12 group-hover:shadow-[0_0_10px_#00a3ff] transition-all duration-300"></div>
                <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-boo-blue/50 to-transparent group-hover:w-12 group-hover:shadow-[0_0_10px_#00a3ff] transition-all duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-px h-8 bg-gradient-to-t from-pink-500/50 to-transparent group-hover:h-12 group-hover:shadow-[0_0_10px_#ec4899] transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 h-px w-8 bg-gradient-to-r from-pink-500/50 to-transparent group-hover:w-12 group-hover:shadow-[0_0_10px_#ec4899] transition-all duration-300"></div>
              </div>
              
              {/* Feature number */}
              <div className="absolute top-3 right-3 font-mono text-[10px] text-white/20 tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white group-hover:text-boo-blue transition-colors tracking-wide">{feature.title}</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">{feature.description}</p>
              
              {/* Feature tag */}
              {feature.tag && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-boo-blue/10 text-boo-blue border border-boo-blue/20 group-hover:bg-boo-blue/20 group-hover:border-boo-blue/40 transition-all">
                  {feature.tag}
                </span>
              )}
              
              {/* Bottom line accent - neon style */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-boo-blue via-purple-500 to-pink-500 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(0,163,255,0.8)] transition-all duration-500"></div>
              
              {/* Pixel decoration */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-boo-blue/30 group-hover:bg-boo-blue transition-colors"></div>
              <div className="absolute top-2 left-4 w-1 h-1 bg-boo-blue/20 group-hover:bg-boo-blue/60 transition-colors delay-75"></div>
            </div>
          )})}
        </div>
        
        {/* Retro arcade decoration */}
        <div className="flex justify-center mt-12 gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-white/30">
            <span className="w-2 h-2 bg-pink-500/50 animate-pulse"></span>
            <span>PLAYER 1</span>
          </div>
          <div className="text-white/20">|</div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/30">
            <span className="w-2 h-2 bg-cyan-400/50 animate-pulse"></span>
            <span>INSERT COIN</span>
          </div>
          <div className="text-white/20">|</div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/30">
            <span className="w-2 h-2 bg-boo-green/50 animate-pulse"></span>
            <span>PLAYER 2</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Static data extracted outside component for performance
const DEMO_IMAGES = [
  '/img/Deathstranding.webp',
  '/img/wherewind.webp',
] as const

// Live Preset Demo Component - Based on actual v3.7.2 presets with Comparison Slider & Carousel
function LivePresetDemo() {
  const { messages } = useTranslations()
  const t = messages.demo
  
  const [currentPreset, setCurrentPreset] = useState('default')
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const presets = useMemo(() => [
    { id: 'default', name: t.presets.default, filter: 'contrast(1.05) saturate(1.05)', desc: t.presets.defaultDesc },
    { id: 'cinematic', name: t.presets.cinematic, filter: 'contrast(1.15) saturate(1.2) brightness(0.98)', desc: t.presets.cinematicDesc },
    { id: 'competitive', name: t.presets.competitive, filter: 'contrast(1.08) brightness(1.02)', desc: t.presets.competitiveDesc },
    { id: 'comfort', name: t.presets.comfort, filter: 'brightness(0.95) contrast(1.05) saturate(0.95) sepia(0.05)', desc: t.presets.comfortDesc },
    { id: 'perfect', name: t.presets.perfectQuality, filter: 'contrast(1.12) saturate(1.15) brightness(1.03)', desc: t.presets.perfectQualityDesc },
  ], [t.presets])

  const activePreset = useMemo(() => presets.find(p => p.id === currentPreset) || presets[0], [presets, currentPreset])

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX)
  }, [isDragging, handleMove])

  const handleEnd = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  return (
    <section className="py-20 bg-boo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12">
          {t.title} <span className="opt-text-gradient">{t.titleHighlight}</span>
        </h2>
        <div className="max-w-5xl mx-auto">
          {/* Preset Label - Outside the image */}
          <div className="flex justify-end mb-3">
            <div className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-right">
              <div className="text-sm font-mono text-boo-blue font-semibold">{activePreset.name}</div>
              <div className="text-xs text-white/50 mt-0.5">{activePreset.desc}</div>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black aspect-video group select-none"
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX) }}
            onTouchStart={(e) => { setIsDragging(true); if (e.touches[0]) handleMove(e.touches[0].clientX) }}
          >
            {/* Original Image (Before - left side) */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{ backgroundImage: `url('${DEMO_IMAGES[currentImage]}')` }}
            />
            
            {/* Filtered Image (After - right side, clipped) */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-[filter] duration-500"
              style={{ 
                backgroundImage: `url('${DEMO_IMAGES[currentImage]}')`,
                filter: activePreset.filter,
                clipPath: `inset(0 0 0 ${sliderPosition}%)`
              }}
            />
            
            {/* Comparison Slider Line - Enhanced Design */}
            <div 
              className="absolute top-0 bottom-0 z-20 cursor-ew-resize"
              style={{ left: `calc(${sliderPosition}% - 20px)`, width: '40px' }}
            >
              {/* Vertical Line with Gradient */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-boo-blue via-white to-boo-blue shadow-[0_0_15px_rgba(0,163,255,0.6)]"
              />
              
              {/* Top Triangle Indicator */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-boo-blue drop-shadow-lg" />
              </div>
              
              {/* Bottom Triangle Indicator */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-boo-blue drop-shadow-lg" />
              </div>
              
              {/* Center Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-boo-blue to-cyan-400 shadow-[0_0_20px_rgba(0,163,255,0.5)] flex items-center justify-center cursor-ew-resize border-2 border-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <div className="flex items-center gap-0.5">
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="text-white">
                    <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="text-white">
                    <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carousel Controls - Outside the image */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentImage((prev) => (prev === 0 ? DEMO_IMAGES.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div className="flex gap-2" role="tablist" aria-label="Image carousel">
              {DEMO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentImage === idx ? 'bg-boo-blue w-8' : 'bg-white/30 hover:bg-white/50'}`}
                  role="tab"
                  aria-selected={currentImage === idx}
                  aria-label={`Image ${idx + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentImage((prev) => (prev === DEMO_IMAGES.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          
          {/* Preset Buttons - Outside the image */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {presets.map(preset => (
              <button 
                key={preset.id}
                onClick={() => setCurrentPreset(preset.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentPreset === preset.id 
                    ? 'bg-boo-blue text-white shadow-[0_0_15px_rgba(0,163,255,0.5)]' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
          
          <p className="text-center text-white/40 mt-6 text-sm">
            * {t.hint}
          </p>
        </div>
      </div>
    </section>
  )
}

// Technical Specifications Section
function TechnicalSpecs() {
  const specs = [
    {
      category: 'Resolution & Display',
      items: [
        { label: 'Max Resolution', value: '3840 × 2160 (4K)' },
        { label: 'Ultrawide', value: '21:9 / 32:9 / Custom' },
        { label: 'Scaling', value: 'Smart Ratio Detection' },
        { label: 'Object-Fit', value: 'Fill / Contain modes' },
      ]
    },
    {
      category: 'Filter Pipeline',
      items: [
        { label: 'Sharpening', value: 'USM + CAS algorithms' },
        { label: 'Color', value: 'Vibrance / Saturation' },
        { label: 'Clarity', value: 'Denoise + Anti-band' },
        { label: 'Rendering', value: 'GPU-accelerated SVG' },
      ]
    },
    {
      category: 'Device Adaptation',
      items: [
        { label: 'Auto-Detect', value: 'CPU / RAM / Screen' },
        { label: 'Device Tiers', value: 'Low / Mid / High-End' },
        { label: 'Filter Load', value: '2 / 4 / 8 max active' },
        { label: 'Bootstrap', value: 'requestIdleCallback' },
      ]
    },
    {
      category: 'Presets & Modes',
      items: [
        { label: 'Presets', value: '5 built-in profiles' },
        { label: 'Filter Tiers', value: 'Safe / Light / Balanced / Ultra' },
        { label: 'Performance', value: 'One-click toggle' },
        { label: 'Ultrawide', value: 'Ctrl+Alt+W shortcut' },
      ]
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-boo-dark to-boo-dark/50 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(0,163,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-mono mb-4">
            <span className="w-8 h-px bg-purple-400"></span>
            TECHNICAL SPECS
            <span className="w-8 h-px bg-purple-400"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Under the <span className="opt-text-gradient">Hood</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Built with performance in mind. <strong className="text-white/90">Zero setInterval</strong>, requestIdleCallback-based, <em className="text-boo-blue/80">minimal CPU footprint</em>.
          </p>
        </div>

        {/* Specs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, i) => (
            <div 
              key={i}
              className="group relative bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/[0.04]"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
                <span className="text-sm sm:text-base font-bold text-white/90">{spec.category}</span>
              </div>
              
              {/* Spec items */}
              <div className="space-y-3">
                {spec.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-center text-sm">
                    <span className="text-white/40">{item.label}</span>
                    <span className="font-mono text-white/80 bg-white/5 px-2 py-0.5 rounded text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
              
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Compatibility bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-boo-green"></span>
            Chrome / Edge / Brave
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-boo-green"></span>
            Firefox
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-boo-green"></span>
            Opera / Vivaldi
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Safari (Userscripts app)
          </div>
        </div>
      </div>
    </section>
  )
}

// Installation section
function Installation() {
  const { messages } = useTranslations()
  const t = messages.install

  const installStepsData = [
    {
      step: t.steps.step1.number,
      title: t.steps.step1.title,
      description: t.steps.step1.description,
      link: 'https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
      linkText: 'Get Tampermonkey',
    },
    {
      step: t.steps.step2.number,
      title: t.steps.step2.title,
      description: t.steps.step2.description,
      link: '#download',
      linkText: 'Install Script',
    },
    {
      step: t.steps.step3.number,
      title: t.steps.step3.title,
      description: t.steps.step3.description,
      link: 'https://boosteroid.com/go/b/fA5oF',
      linkText: 'Open Boosteroid',
    },
  ]

  return (
    <section id="install" className="py-20 bg-boo-dark/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-boo-blue/10 rotate-45 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-boo-green/10 rotate-12 animate-float-delayed"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-boo-green text-sm font-mono mb-4">
            <span className="w-8 h-px bg-boo-green"></span>
            {t.title}
            <span className="w-8 h-px bg-boo-green"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="opt-text-gradient">{t.subtitle}</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
          {/* Connector lines - positioned absolutely between cards */}
          <div className="hidden md:flex absolute top-[4.5rem] left-0 right-0 justify-center items-center pointer-events-none" style={{ zIndex: 5 }}>
            {/* Line 1: between step 1 and 2 */}
            <div className="flex-1 flex justify-end pr-4">
              <div className="step-connector w-[calc(100%-6rem)] h-1 relative overflow-visible">
                {/* Background track */}
                <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                
                {/* Dotted track with sequential animation */}
                <div className="absolute inset-0 flex items-center justify-between px-1">
                  {[...Array(5)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className="w-1.5 h-1.5 rounded-full bg-boo-blue/30 animate-dot-sequential"
                      style={{ animationDelay: `${idx * 0.3}s` }}
                    />
                  ))}
                </div>
                
                {/* Continuous animated progress line */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="h-full animate-progress-sweep">
                    <div className="h-full w-32 bg-gradient-to-r from-transparent via-boo-blue to-transparent rounded-full shadow-[0_0_10px_#00a3ff]" />
                  </div>
                </div>
                
                {/* Traveling energy dot - continuous */}
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-boo-blue shadow-[0_0_8px_#00a3ff,0_0_16px_#00a3ff] animate-energy-continuous" />
                
                {/* Arrow pulsing */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-boo-blue/60 animate-pulse">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Spacer for middle card circle */}
            <div className="w-16"></div>
            
            {/* Line 2: between step 2 and 3 */}
            <div className="flex-1 flex justify-start pl-4">
              <div className="step-connector w-[calc(100%-6rem)] h-1 relative overflow-visible">
                {/* Background track */}
                <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                
                {/* Dotted track with sequential animation */}
                <div className="absolute inset-0 flex items-center justify-between px-1">
                  {[...Array(5)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className="w-1.5 h-1.5 rounded-full bg-boo-green/30 animate-dot-sequential"
                      style={{ animationDelay: `${idx * 0.3 + 1.5}s` }}
                    />
                  ))}
                </div>
                
                {/* Continuous animated progress line */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="h-full animate-progress-sweep" style={{ animationDelay: '1.5s' }}>
                    <div className="h-full w-32 bg-gradient-to-r from-transparent via-boo-green to-transparent rounded-full shadow-[0_0_10px_#22c55e]" />
                  </div>
                </div>
                
                {/* Traveling energy dot - continuous */}
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-boo-green shadow-[0_0_8px_#22c55e,0_0_16px_#22c55e] animate-energy-continuous" style={{ animationDelay: '1.5s' }} />
                
                {/* Arrow pulsing */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-boo-green/60 animate-pulse">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {installStepsData.map((step, i) => (
            <div key={i} className="relative group z-10">
              <div className="opt-glass-panel rounded-2xl p-6 text-center hover:border-boo-blue/40 transition-all duration-300 hover:transform hover:-translate-y-1">
                {/* Step number with glow */}
                <div className="w-12 h-12 rounded-full bg-boo-blue text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] transition-shadow duration-300 font-mono relative z-20">
                  {step.step}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/70 text-base leading-relaxed mb-4">{step.description}</p>
                <a 
                  href={step.link} 
                  target={step.link.startsWith('http') ? '_blank' : undefined}
                  rel={step.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1 text-boo-blue hover:text-boo-green transition-colors group/link"
                >
                  {step.linkText} 
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Browser compatibility */}
        <div className="text-center">
          <p className="text-sm text-white/40 mb-6 font-mono uppercase tracking-wider">{t.compatibleWith}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-white/60">
            {['Chrome', 'Firefox', 'Edge', 'Opera', 'Brave'].map((browser, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className="text-white/40 group-hover:text-boo-blue transition-colors duration-300 transform group-hover:scale-110">
                  {BrowserIcons[browser as keyof typeof BrowserIcons]}
                </div>
                <span className="text-sm mt-2 group-hover:text-white transition-colors duration-300">{browser}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Download section
function Download() {
  const { messages } = useTranslations()
  const t = messages.download

  return (
    <section id="download" className="py-20 bg-boo-dark relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 retro-grid opacity-15"></div>
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-blue-glow opacity-30" />
      
      {/* 3D Floating retro elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-pink-500/30 rounded-full animate-spin-slow perspective-1000" style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.2)' }}></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-cyan-400/30 rotate-45 animate-float" style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)' }}></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 border border-purple-500/20 animate-float-3d" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-20 w-12 h-12 border border-boo-green/20 rounded-lg animate-float-3d" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Neon horizontal lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(0,163,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="opt-glass-panel rounded-3xl p-8 sm:p-12 animate-border-glow relative overflow-hidden card-3d crt-effect">
          {/* CRT scanline overlay */}
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none"></div>
          
          {/* Corner decorations - Arcade style */}
          <div className="absolute top-0 left-0 w-20 h-20">
            <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-pink-500 to-transparent shadow-[0_0_10px_#ec4899]"></div>
            <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-pink-500 to-transparent shadow-[0_0_10px_#ec4899]"></div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]"></div>
            <div className="absolute top-4 right-4 w-px h-8 bg-gradient-to-b from-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-20 h-20">
            <div className="absolute bottom-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]"></div>
            <div className="absolute bottom-4 left-4 w-px h-8 bg-gradient-to-t from-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee]"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20">
            <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-pink-500 to-transparent shadow-[0_0_10px_#ec4899]"></div>
            <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-pink-500 to-transparent shadow-[0_0_10px_#ec4899]"></div>
          </div>
          
          <div className="inline-flex items-center gap-2 text-boo-green text-sm font-mono mb-6 neon-box px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-boo-green rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            <span className="glitch-text" data-text={t.badge}>{t.badge}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 rgb-split" data-text={`${t.title} ${t.titleHighlight}`}>
            {t.title} <span className="opt-text-gradient neon-text text-boo-blue">{t.titleHighlight}</span>
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.description} <strong className="text-white/90">{t.descriptionFree}</strong> {t.descriptionEnd} <em className="text-boo-blue">{t.feature4K}</em>, {t.featureVisuals}, <em className="text-boo-green">{t.featureLatency}</em>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://github.com/optimizerplus/optimizer-plus-v3.7.2/raw/main/Boosteroid-Optimizer-Plus.user.js" 
              className="group opt-btn-primary flex items-center gap-3 text-lg px-8 py-4 w-full sm:w-auto justify-center relative overflow-hidden perspective-1000"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-boo-green via-cyan-400 to-boo-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: 'inset 0 0 20px rgba(0, 255, 136, 0.3)' }}></span>
              <span className="relative flex items-center gap-3">
                <span className="group-hover:animate-bounce">{Icons.download}</span>
                <span>{t.installButton} (v3.7.2)</span>
              </span>
            </a>
            <a 
              href="https://github.com/optimizerplus/optimizer-plus-v3.7.2" 
              target="_blank"
              rel="noopener noreferrer"
              className="opt-btn-secondary flex items-center gap-3 text-lg px-8 py-4 w-full sm:w-auto justify-center hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
            >
              {Icons.github}
              <span>{t.githubButton}</span>
            </a>
            <a 
              href="https://boosteroid.com/go/b/fA5oF" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 text-lg px-8 py-4 w-full sm:w-auto justify-center rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(138,22,134,0.6)]"
              style={{ background: 'linear-gradient(135deg, #8a1686 0%, #b41aaf 50%, #d41fd2 100%)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center gap-2">
                <span>{t.joinButton}</span>
              </span>
            </a>
          </div>

          <p className="text-sm text-white/40 mt-6 font-mono">
            {t.requiresTampermonkey} 
            <a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo" target="_blank" rel="noopener noreferrer" className="text-boo-blue hover:text-pink-500 transition-colors ml-1 hover:neon-text">
              {t.getItHere} →
            </a>
          </p>
          
          {/* PC Only Notice */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-boo-blue flex-shrink-0">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="text-white/60 text-sm">{t.pcOnly}</span>
          </div>
          
          {/* Retro arcade footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-center items-center gap-6 text-xs font-mono text-white/20">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-pink-500/50"></span> 1UP</span>
            <span className="animate-pulse">PRESS START</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400/50"></span> 2UP</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// FAQ section with punch card design
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { messages } = useTranslations()
  const t = messages.faq
  
  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-boo-dark/30 to-boo-dark/60 relative overflow-hidden" aria-labelledby="faq-heading">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-boo-blue/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-boo-blue text-sm font-mono mb-4">
            <span className="w-8 h-px bg-boo-blue"></span>
            {t.title}
            <span className="w-8 h-px bg-boo-blue"></span>
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="opt-text-gradient">{t.subtitle}</span>
          </h2>
        </div>

        {/* Punch card container */}
        <div className="relative">
          {/* Vertical perforated line through punch holes */}
          <div className="punch-line"></div>
          
          {/* FAQ items */}
          <div className="space-y-0">
            {faqKeys.map((key, i) => {
              const faq = t.items[key]
              return (
              <div 
                key={i} 
                className={`faq-punch-card relative pl-16 pr-4 ${openIndex === i ? 'faq-open' : ''}`}
              >
                {/* Large punch hole - stamp card perforation style */}
                <div className={`punch-hole
                  absolute left-2 top-4 
                  ${openIndex === i ? 'faq-open' : ''}
                `}>
                  <span>{i + 1}</span>
                </div>
                
                {/* Question button */}
                <button
                  className="w-full text-left py-5 flex justify-between items-center gap-4 group"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className={`text-lg sm:text-xl font-bold tracking-wide transition-colors duration-300 ${openIndex === i ? 'text-boo-blue' : 'text-white group-hover:text-boo-blue/80'}`}>
                    {faq.question}
                  </span>
                  <div className={`faq-chevron-punch
                    ${openIndex === i ? 'bg-boo-blue/20 border-boo-blue rotate-180' : 'group-hover:border-white/40'}
                  `}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {/* Answer with hourglass animation */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-500 ease-out
                    ${openIndex === i ? 'faq-answer-hourglass' : ''}
                  `}
                  style={{ 
                    maxHeight: openIndex === i ? '300px' : '0',
                  }}
                >
                  <div className="pb-5 pr-4 leading-relaxed border-b border-white/5">
                    <p className="text-base sm:text-lg text-white/75 leading-loose">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>


      </div>
    </section>
  )
}

// Footer
function Footer() {
  const { messages } = useTranslations()
  const t = messages.footer

  return (
    <footer className="relative py-16 bg-gradient-to-b from-boo-dark via-[#0a0e1a] to-[#060912] border-t border-white/10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,163,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        {/* Glow effects */}
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-boo-blue/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left gap-8">
          {/* Brand section with logo */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <img 
              src="/logo.png" 
              alt="Boosteroid Optimizer Plus" 
              className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto drop-shadow-[0_0_40px_rgba(0,163,255,0.6)] hover:drop-shadow-[0_0_60px_rgba(0,163,255,0.8)] transition-all duration-500"
            />
          </div>

          {/* Quick links - centered on mobile */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <a 
              href="#features" 
              className="text-white/60 hover:text-boo-blue transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a 
              href="#install" 
              className="text-white/60 hover:text-boo-blue transition-colors text-sm font-medium"
            >
              Install
            </a>
            <a 
              href="#faq" 
              className="text-white/60 hover:text-boo-blue transition-colors text-sm font-medium"
            >
              FAQ
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <a 
              href="https://github.com/optimizerplus/optimizer-plus-v3.7.2" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium group"
              aria-label="GitHub repository"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* CTA button */}
          <a 
            href="https://boosteroid.com/go/b/fA5oF" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative px-5 py-2.5 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            style={{ background: 'linear-gradient(135deg, #8a1686 0%, #b41aaf 50%, #d41fd2 100%)' }}
            aria-label="Join Boosteroid"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Join Boosteroid
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Divider with retro style */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-[#0a0e1a] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-boo-blue/50 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p className="flex items-center gap-2">
            <span>© 2025 Boosteroid Optimizer Plus</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline"><a href="https://github.com/Derfogd" target="_blank" rel="noopener noreferrer" className="text-boo-blue hover:text-white transition-colors">Derfog</a></span>
          </p>
          <p className="sm:hidden text-center">
            <a href="https://github.com/Derfogd" target="_blank" rel="noopener noreferrer" className="text-boo-blue hover:text-white transition-colors">Derfog</a>
          </p>
          
          {/* Back to top button */}
          <a 
            href="#" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-boo-blue/10 border border-boo-blue/30 text-white/70 hover:text-white hover:bg-boo-blue/20 hover:border-boo-blue/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,163,255,0.3)]"
            aria-label="Back to top"
          >
            <svg 
              className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm font-medium">Top</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

// Main page component
export default function Home() {
  return (
    <main id="main-content">
      <Header />
      <Hero />
      <Features />
      <LivePresetDemo />
      <Installation />
      <Download />
      <FAQ />
      <Footer />
    </main>
  )
}
