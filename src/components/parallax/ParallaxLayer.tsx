'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down'
  scale?: boolean
  rotate?: boolean
  opacity?: boolean
}

export default function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
  direction = 'up',
  scale = false,
  rotate = false,
  opacity = false,
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const yMovement = direction === 'up' ? -100 * speed : 100 * speed

    const animation: any = {
      y: yMovement,
    }

    if (scale) {
      animation.scale = 1 + speed * 0.2
    }

    if (rotate) {
      animation.rotation = speed * 10
    }

    if (opacity) {
      animation.opacity = Math.max(0, 1 - speed)
    }

    gsap.to(layer, {
      ...animation,
      ease: 'none',
      scrollTrigger: {
        trigger: layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed, direction, scale, rotate, opacity])

  return (
    <div ref={layerRef} className={`parallax-layer ${className}`}>
      {children}
    </div>
  )
}
