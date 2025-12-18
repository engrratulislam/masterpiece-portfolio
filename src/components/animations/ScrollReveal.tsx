'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
}

/**
 * ScrollReveal Component
 * 
 * Reveals content with a slide and fade animation when it enters the viewport.
 * 
 * @param children - Content to reveal
 * @param direction - Direction of the slide animation
 * @param delay - Delay before animation starts
 * @param duration - Duration of the animation
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <ScrollReveal direction="up" delay={0.2}>
 *   <div>Content</div>
 * </ScrollReveal>
 * ```
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
}: ScrollRevealProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

