'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

interface CurvedTextProps {
  text: string
  radius?: number
  fontSize?: number
  className?: string
  rotate?: boolean
}

/**
 * CurvedText Component
 * 
 * Displays text along a curved SVG path.
 * Optionally rotates continuously for decorative effect.
 * 
 * @param text - The text to display
 * @param radius - Radius of the curve (default: 100)
 * @param fontSize - Font size in pixels (default: 16)
 * @param className - Additional CSS classes
 * @param rotate - Whether to continuously rotate (default: false)
 * 
 * @example
 * ```tsx
 * <CurvedText
 *   text="Scroll Down • Scroll Down • "
 *   radius={80}
 *   rotate={true}
 * />
 * ```
 */
export default function CurvedText({
  text,
  radius = 100,
  fontSize = 16,
  className = '',
  rotate = false,
}: CurvedTextProps) {
  const id = useId()
  const size = radius * 2
  const circumference = 2 * Math.PI * radius
  const pathId = `curved-text-${id}`

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={rotate ? { rotate: 360 } : {}}
      transition={
        rotate
          ? {
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <path
            id={pathId}
            d={`M ${radius},${radius} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            fill="none"
          />
        </defs>
        <text
          fontSize={fontSize}
          fill="currentColor"
          fontWeight="500"
          letterSpacing="2"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textAnchor="start"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  )
}

