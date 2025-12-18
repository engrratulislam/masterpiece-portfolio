'use client'

import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react'

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  fade?: boolean
  scale?: boolean
  scaleRange?: [number, number]
  opacityRange?: [number, number]
}

export default function Parallax({
  children,
  speed = 0.5,
  className = '',
  fade = false,
  scale = false,
  scaleRange = [1, 1.2],
  opacityRange = [1, 0],
}: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const updateParallax = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
      )

      const yOffset = (scrollProgress - 0.5) * 100 * speed

      let transform = `translate3d(0, ${yOffset}px, 0)`

      if (scale) {
        const scaleValue =
          scaleRange[0] + (scaleRange[1] - scaleRange[0]) * scrollProgress
        transform += ` scale(${scaleValue})`
      }

      element.style.transform = transform

      if (fade) {
        const opacity =
          opacityRange[0] + (opacityRange[1] - opacityRange[0]) * scrollProgress
        element.style.opacity = opacity.toString()
      }
    }

    const animate = () => {
      updateParallax()
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('resize', updateParallax, { passive: true })

    return () => {
      window.removeEventListener('resize', updateParallax)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [speed, fade, scale, scaleRange, opacityRange])

  const style: CSSProperties = {
    willChange: 'transform',
  }

  if (fade) {
    style.willChange = 'transform, opacity'
  }

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  )
}

