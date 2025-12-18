'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface StaggerRevealGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  gap?: number
  className?: string
}

/**
 * StaggerRevealGrid Component
 * 
 * Creates a grid layout where items animate in with a staggered effect.
 * Each item fades in and slides up sequentially.
 * 
 * @param children - Grid items to animate
 * @param columns - Number of columns (default: 3)
 * @param gap - Gap between items in pixels (default: 24)
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <StaggerRevealGrid columns={3} gap={32}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerRevealGrid>
 * ```
 */
export default function StaggerRevealGrid({
  children,
  columns = 3,
  gap = 24,
  className = '',
}: StaggerRevealGridProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  }

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <motion.div
      className={`grid ${gridCols[columns]} ${className}`}
      style={{ gap: `${gap}px` }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  )
}

