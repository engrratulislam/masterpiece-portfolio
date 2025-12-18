'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayer {
  children: ReactNode
  speed: number
  className?: string
}

interface MultiLayerParallaxProps {
  layers: ParallaxLayer[]
  className?: string
}

/**
 * MultiLayerParallax Component
 * 
 * Creates a multi-layer parallax scrolling effect where different layers
 * move at different speeds to create depth.
 * 
 * @param layers - Array of layers with their content and speed
 * @param className - Additional CSS classes for the container
 * 
 * @example
 * ```tsx
 * <MultiLayerParallax
 *   layers={[
 *     { children: <Scene3D />, speed: 0.5, className: 'z-0' },
 *     { children: <Overlay />, speed: 0.3, className: 'z-10' },
 *     { children: <Content />, speed: 0.1, className: 'z-20' },
 *   ]}
 * />
 * ```
 */
export default function MultiLayerParallax({
  layers,
  className = '',
}: MultiLayerParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  return (
    <div ref={ref} className={`relative ${className}`}>
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          ['0%', `${layer.speed * 100}%`]
        )

        return (
          <motion.div
            key={index}
            className={`absolute inset-0 ${layer.className || ''}`}
            style={{ y }}
          >
            {layer.children}
          </motion.div>
        )
      })}
    </div>
  )
}

