'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

interface MagneticHoverProps {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * MagneticHover Component
 * 
 * Creates a magnetic effect where the element is attracted to the mouse cursor.
 * Uses spring physics for smooth, natural movement.
 * 
 * @param children - The content to wrap with magnetic effect
 * @param strength - How strong the magnetic pull is (default: 20)
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <MagneticHover strength={15}>
 *   <button>Hover me!</button>
 * </MagneticHover>
 * ```
 */
export default function MagneticHover({
  children,
  strength = 20,
  className = '',
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX / strength)
    y.set(distanceY / strength)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

