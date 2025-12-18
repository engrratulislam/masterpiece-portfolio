'use client'

import { useRef, useEffect, type ReactNode } from 'react'

interface SimpleParallaxProps {
  children: ReactNode
  speed?: number // -1 to 1, where 0 is no movement
  className?: string
}

/**
 * SimpleParallax Component
 * 
 * A lightweight parallax component that works with Lenis smooth scroll.
 * Uses direct scroll event listeners for maximum compatibility.
 * 
 * @param children - Content to apply parallax effect to
 * @param speed - Parallax speed multiplier (-1 to 1, default: 0.5)
 * @param className - Additional CSS classes
 */
export function SimpleParallax({
  children,
  speed = 0.5,
  className = '',
}: SimpleParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const movement = (scrollPercent - 0.5) * 100 * speed
      
      element.style.transform = `translate3d(0, ${movement}px, 0)`
    }

    // Initial call
    handleScroll()

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Also listen to resize
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}

export default SimpleParallax

