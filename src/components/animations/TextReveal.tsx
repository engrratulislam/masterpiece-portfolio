'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface TextRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * TextReveal Component
 * 
 * Reveals text with a clip-path animation effect.
 * Creates a smooth reveal from bottom to top.
 * 
 * @param children - Text content to reveal
 * @param delay - Delay before animation starts
 * @param duration - Duration of the animation
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <TextReveal delay={0.3}>
 *   <h1>Welcome</h1>
 * </TextReveal>
 * ```
 */
export default function TextReveal({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
}: TextRevealProps) {
  const variants: Variants = {
    hidden: {
      clipPath: 'inset(0 0 100% 0)',
      y: 20,
    },
    visible: {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

