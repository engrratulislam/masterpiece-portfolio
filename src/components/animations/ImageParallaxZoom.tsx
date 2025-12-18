'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface ImageParallaxZoomProps {
  src: string
  alt: string
  className?: string
  zoomIntensity?: number
  parallaxIntensity?: number
}

/**
 * ImageParallaxZoom Component
 * 
 * Creates a parallax zoom effect on images as the user scrolls.
 * The image scales and moves based on scroll position.
 * 
 * @param src - Image source URL
 * @param alt - Image alt text
 * @param className - Additional CSS classes
 * @param zoomIntensity - How much the image zooms (default: 1.2)
 * @param parallaxIntensity - How much the image moves (default: 50)
 * 
 * @example
 * ```tsx
 * <ImageParallaxZoom
 *   src="/project-image.jpg"
 *   alt="Project screenshot"
 *   zoomIntensity={1.3}
 *   parallaxIntensity={100}
 * />
 * ```
 */
export default function ImageParallaxZoom({
  src,
  alt,
  className = '',
  zoomIntensity = 1.2,
  parallaxIntensity = 50,
}: ImageParallaxZoomProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, zoomIntensity, 1])
  const y = useTransform(scrollYProgress, [0, 1], [0, parallaxIntensity])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ scale, y, opacity }}
        className="relative w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
    </div>
  )
}

