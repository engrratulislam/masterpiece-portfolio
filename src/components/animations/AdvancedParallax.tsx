'use client'

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { motion, useScroll, useTransform, type MotionValue, useMotionValue, useSpring } from 'framer-motion'

export interface ParallaxElement {
  children: ReactNode
  speed?: number // Vertical movement speed (-1 to 1, where 0 is no movement)
  scale?: [number, number] // Scale range [start, end]
  opacity?: [number, number] // Opacity range [start, end]
  rotate?: [number, number] // Rotation range in degrees [start, end]
  x?: [number, number] // Horizontal movement in pixels [start, end]
  y?: [number, number] // Vertical movement in pixels [start, end]
  className?: string
  zIndex?: number
  delay?: number // Delay factor for staggered animations
}

interface AdvancedParallaxProps {
  elements: ParallaxElement[]
  className?: string
  containerHeight?: string
  triggerOffset?: ['start end' | 'end start', 'start end' | 'end start'] // Scroll trigger offset
}

/**
 * AdvancedParallax Component
 * 
 * Creates sophisticated parallax effects similar to Dave Gamache's parallax demo.
 * Supports multiple elements with independent scaling, fading, rotation, and translation.
 * 
 * @param elements - Array of parallax elements with their animation properties
 * @param className - Additional CSS classes for the container
 * @param containerHeight - Height of the parallax container (default: 'auto')
 * @param triggerOffset - Scroll trigger offset (default: ['start end', 'end start'])
 * 
 * @example
 * ```tsx
 * <AdvancedParallax
 *   elements={[
 *     {
 *       children: <img src="/bg.jpg" />,
 *       speed: 0.5,
 *       scale: [1, 1.2],
 *       opacity: [1, 0.5],
 *       className: 'absolute inset-0',
 *       zIndex: 0
 *     },
 *     {
 *       children: <h1>Title</h1>,
 *       speed: -0.3,
 *       y: [0, -100],
 *       opacity: [0, 1],
 *       className: 'text-center',
 *       zIndex: 10
 *     }
 *   ]}
 * />
 * ```
 */
export default function AdvancedParallax({
  elements,
  className = '',
  containerHeight = 'auto',
  triggerOffset = ['start end', 'end start'],
}: AdvancedParallaxProps) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: triggerOffset,
  })

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: containerHeight }}
    >
      {elements.map((element, index) => {
        // Create transforms based on element properties
        const transforms: Record<string, MotionValue<any>> = {}

        // Vertical movement (speed-based)
        if (element.speed !== undefined) {
          transforms.y = useTransform(
            scrollYProgress,
            [0, 1],
            [`${element.speed * -100}%`, `${element.speed * 100}%`]
          )
        }

        // Custom Y movement (overrides speed if both are provided)
        if (element.y) {
          transforms.y = useTransform(scrollYProgress, [0, 1], element.y)
        }

        // Horizontal movement
        if (element.x) {
          transforms.x = useTransform(scrollYProgress, [0, 1], element.x)
        }

        // Scale
        if (element.scale) {
          transforms.scale = useTransform(scrollYProgress, [0, 1], element.scale)
        }

        // Opacity
        if (element.opacity) {
          transforms.opacity = useTransform(scrollYProgress, [0, 1], element.opacity)
        }

        // Rotation
        if (element.rotate) {
          transforms.rotate = useTransform(scrollYProgress, [0, 1], element.rotate)
        }

        const style: CSSProperties = {
          zIndex: element.zIndex ?? index,
        }

        return (
          <motion.div
            key={index}
            className={element.className || ''}
            style={{ ...style, ...transforms }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: element.delay || index * 0.1,
              ease: 'easeOut'
            }}
          >
            {element.children}
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * ParallaxElement Component
 * 
 * A simpler wrapper for creating individual parallax elements.
 * Use this when you need just one element with parallax effect.
 */
interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  scale?: [number, number]
  opacity?: [number, number]
  rotate?: [number, number]
  x?: [number, number]
  y?: [number, number]
  className?: string
  triggerOffset?: ['start end' | 'end start', 'start end' | 'end start']
}

export function ParallaxElement({
  children,
  speed = 0.5,
  scale,
  opacity,
  rotate,
  x,
  y,
  className = '',
  triggerOffset = ['start end', 'end start'],
}: ParallaxElementProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: triggerOffset,
  })

  const transforms: Record<string, MotionValue<any>> = {}

  // Vertical movement
  if (y) {
    transforms.y = useTransform(scrollYProgress, [0, 1], y)
  } else if (speed !== undefined) {
    transforms.y = useTransform(
      scrollYProgress,
      [0, 1],
      [`${speed * -50}%`, `${speed * 50}%`]
    )
  }

  // Horizontal movement
  if (x) {
    transforms.x = useTransform(scrollYProgress, [0, 1], x)
  }

  // Scale
  if (scale) {
    transforms.scale = useTransform(scrollYProgress, [0, 1], scale)
  }

  // Opacity
  if (opacity) {
    transforms.opacity = useTransform(scrollYProgress, [0, 1], opacity)
  }

  // Rotation
  if (rotate) {
    transforms.rotate = useTransform(scrollYProgress, [0, 1], rotate)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={transforms}>
        {children}
      </motion.div>
    </div>
  )
}

