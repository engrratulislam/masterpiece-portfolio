'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ParallaxTextProps {
  children: React.ReactNode
  speed?: number
  className?: string
  splitBy?: 'words' | 'chars' | 'lines'
  stagger?: number
}

export default function ParallaxText({
  children,
  speed = 0.5,
  className = '',
  splitBy = 'words',
  stagger = 0.05,
}: ParallaxTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    const text = element.textContent || ''
    let splitText: string[] = []

    if (splitBy === 'words') {
      splitText = text.split(' ')
    } else if (splitBy === 'chars') {
      splitText = text.split('')
    } else {
      splitText = text.split('\n')
    }

    // Clear and rebuild with spans
    element.innerHTML = ''
    splitText.forEach((part, index) => {
      const span = document.createElement('span')
      span.textContent = part
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      if (splitBy === 'words') {
        span.style.marginRight = '0.25em'
      }
      element.appendChild(span)
    })

    const spans = element.querySelectorAll('span')

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      stagger: stagger,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
      },
    })

    // Parallax effect
    gsap.to(element, {
      y: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [speed, splitBy, stagger])

  return (
    <div ref={textRef} className={`parallax-text ${className}`}>
      {children}
    </div>
  )
}
