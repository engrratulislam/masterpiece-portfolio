'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GSAPScrollTriggerProps {
  children: ReactNode
  animation?: 'fade' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'custom'
  customAnimation?: gsap.TweenVars
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
  className?: string
}

/**
 * GSAPScrollTrigger Component
 * 
 * Wraps content with GSAP ScrollTrigger animations.
 * Provides preset animations or allows custom GSAP animations.
 * 
 * @param children - Content to animate
 * @param animation - Preset animation type
 * @param customAnimation - Custom GSAP animation object
 * @param start - When animation starts (default: 'top 80%')
 * @param end - When animation ends (default: 'bottom 20%')
 * @param scrub - Link animation to scroll position
 * @param markers - Show debug markers (development only)
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <GSAPScrollTrigger animation="slideUp">
 *   <div>Content</div>
 * </GSAPScrollTrigger>
 * 
 * <GSAPScrollTrigger
 *   customAnimation={{ x: 100, rotation: 360 }}
 *   scrub={true}
 * >
 *   <div>Custom animation</div>
 * </GSAPScrollTrigger>
 * ```
 */
export default function GSAPScrollTrigger({
  children,
  animation = 'fade',
  customAnimation,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = false,
  markers = false,
  className = '',
}: GSAPScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const animations: Record<string, gsap.TweenVars> = {
      fade: { opacity: 0, duration: 1 },
      slideUp: { y: 100, opacity: 0, duration: 1 },
      slideLeft: { x: 100, opacity: 0, duration: 1 },
      slideRight: { x: -100, opacity: 0, duration: 1 },
      scale: { scale: 0.8, opacity: 0, duration: 1 },
      rotate: { rotation: 45, opacity: 0, duration: 1 },
    }

    const animationConfig = customAnimation || animations[animation] || animations.fade

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        ...animationConfig,
        scrollTrigger: {
          trigger: ref.current,
          start,
          end,
          scrub,
          markers: markers && process.env.NODE_ENV === 'development',
        },
      })
    })

    return () => ctx.revert()
  }, [animation, customAnimation, start, end, scrub, markers])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

