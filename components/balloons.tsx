"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Balloon {
  id: number
  x: number
  color: string
  delay: number
  size: number
}

export function Balloons() {
  const [balloons, setBalloons] = useState<Balloon[]>([])

  useEffect(() => {
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
    const newBalloons: Balloon[] = []

    for (let i = 0; i < 10; i++) {
      newBalloons.push({
        id: i,
        x: 5 + Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1,
        size: 40 + Math.random() * 20,
      })
    }

    setBalloons(newBalloons)

    const timer = setTimeout(() => setBalloons([]), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: `${b.x}%`, bottom: -100 }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: "-120vh", opacity: 0 }}
          transition={{
            duration: 4,
            delay: b.delay,
            ease: "easeOut",
          }}
        >
          <svg width={b.size} height={b.size * 1.3} viewBox="0 0 40 52">
            <ellipse cx="20" cy="18" rx="18" ry="18" fill={b.color} />
            <path d="M20 36 Q20 42 18 52" stroke={b.color} strokeWidth="1" fill="none" opacity="0.7" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
