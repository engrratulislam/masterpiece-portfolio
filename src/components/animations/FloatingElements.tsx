'use client'

import { motion } from 'framer-motion'
import { Code2, Rocket, Zap, Palette, Sparkles, type LucideIcon } from 'lucide-react'

interface FloatingElement {
  Icon: LucideIcon
  size: number
  x: string
  y: string
  duration: number
  delay: number
  color: string
}

/**
 * FloatingElements Component
 *
 * Displays floating animated icons in the background.
 * Elements float, rotate, and fade continuously for visual interest.
 * Uses Lucide icons for better rendering and consistency.
 *
 * @example
 * ```tsx
 * <FloatingElements />
 * ```
 */
export default function FloatingElements() {
  const elements: FloatingElement[] = [
    { Icon: Palette, size: 60, x: '10%', y: '20%', duration: 20, delay: 0, color: 'text-pink-500/30' },
    { Icon: Code2, size: 50, x: '80%', y: '30%', duration: 25, delay: 2, color: 'text-primary-500/30' },
    { Icon: Rocket, size: 70, x: '15%', y: '70%', duration: 22, delay: 4, color: 'text-purple-500/30' },
    { Icon: Zap, size: 55, x: '85%', y: '60%', duration: 18, delay: 1, color: 'text-yellow-500/30' },
    { Icon: Sparkles, size: 45, x: '50%', y: '50%', duration: 24, delay: 3, color: 'text-cyan-500/30' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, index) => {
        const { Icon, size, x, y, duration, delay, color } = element
        return (
          <motion.div
            key={index}
            className={`absolute ${color}`}
            style={{
              left: x,
              top: y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              scale: [0, 1, 1, 0],
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        )
      })}
    </div>
  )
}

