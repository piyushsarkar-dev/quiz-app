"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"]
    const newParticles: Particle[] = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      })
    }

    setParticles(newParticles)

    const timer = setTimeout(() => setParticles([]), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
          }}
          initial={{ top: -20, rotate: 0, opacity: 1 }}
          animate={{
            top: "110%",
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
