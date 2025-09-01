"use client"

import React, { useEffect, useState } from 'react'

interface Star {
  id: string
  x: number
  y: number
  size: number
  rotation: number
  delay: number
  duration: number
  trajectory: number
}

export default function StarAnimation() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const starCount = Math.floor(Math.random() * 5) + 2
      const newStars: Star[] = []

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: `${Date.now()}-${i}`,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 20 + 10,
          rotation: Math.random() * 360,
          delay: Math.random() * 200,
          duration: Math.random() * 400 + 600,
          trajectory: (Math.random() - 0.5) * 100,
        })
      }

      setStars(prev => [...prev, ...newStars])

      setTimeout(() => {
        setStars(prev => prev.filter(star => !newStars.find(ns => ns.id === star.id)))
      }, 1200)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-bounce opacity-0"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            transform: `rotate(${star.rotation}deg)`,
            animationDelay: `${star.delay}ms`,
            animationDuration: `${star.duration}ms`,
            '--trajectory': `${star.trajectory}px`,
          } as React.CSSProperties & { '--trajectory': string }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-yellow-400 drop-shadow-lg animate-pulse"
            style={{
              animation: `star-float ${star.duration}ms ease-out ${star.delay}ms forwards`,
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}

      <style jsx global>{`
        @keyframes star-float {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(-20px) translateX(calc(var(--trajectory) * 0.2)) rotate(90deg) scale(1.1);
            opacity: 1;
          }
          40% {
            transform: translateY(-40px) translateX(calc(var(--trajectory) * 0.4)) rotate(180deg) scale(0.9);
            opacity: 0.9;
          }
          60% {
            transform: translateY(-60px) translateX(calc(var(--trajectory) * 0.6)) rotate(270deg) scale(1.2);
            opacity: 0.8;
          }
          80% {
            transform: translateY(-80px) translateX(calc(var(--trajectory) * 0.8)) rotate(360deg) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(var(--trajectory)) rotate(450deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}