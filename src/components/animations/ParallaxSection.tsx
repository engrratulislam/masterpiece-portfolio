'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
}

/**
 * ParallaxSection Component
 * 
 * Creates a simple parallax scrolling effect for a section.
 * The section moves at a different speed than the scroll.
 * 
 * @param children - Content to apply parallax effect to
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <ParallaxSection speed={0.3}>
 *   <div>Content moves slower than scroll</div>
 * </ParallaxSection>
 * ```
 */
export default function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
}: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

