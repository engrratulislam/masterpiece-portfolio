'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * PageTransition Component
 * 
 * Provides smooth page transition animations.
 * Fades in content when the page loads.
 * 
 * @param children - Page content
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <PageTransition>
 *   <div>Page content</div>
 * </PageTransition>
 * ```
 */
export default function PageTransition({
  children,
  className = '',
}: PageTransitionProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

