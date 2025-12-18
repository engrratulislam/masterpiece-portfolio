'use client'

import { motion, type Variants } from 'framer-motion'

interface TextSplitRevealProps {
  text: string
  className?: string
  type?: 'words' | 'chars'
  delay?: number
  duration?: number
}

/**
 * TextSplitReveal Component
 * 
 * Animates text by splitting it into words or characters and revealing them one by one.
 * Creates a staggered reveal effect with 3D rotation.
 * 
 * @param text - The text to animate
 * @param className - Additional CSS classes
 * @param type - Split by 'words' or 'chars' (default: 'words')
 * @param delay - Delay before animation starts (default: 0)
 * @param duration - Duration of each item's animation (default: 0.5)
 * 
 * @example
 * ```tsx
 * <TextSplitReveal 
 *   text="Hello World" 
 *   type="chars"
 *   delay={0.2}
 * />
 * ```
 */
export default function TextSplitReveal({
  text,
  className = '',
  type = 'words',
  delay = 0,
  duration = 0.5,
}: TextSplitRevealProps) {
  const items = type === 'words' ? text.split(' ') : text.split('')

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'words' ? 0.1 : 0.03,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={itemVariants}
          style={{
            transformOrigin: 'bottom',
            marginRight: type === 'words' ? '0.25em' : '0',
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.span>
  )
}

