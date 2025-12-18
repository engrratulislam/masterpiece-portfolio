'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * ScrollProgress Component
 * 
 * Displays a progress bar at the top of the page that fills as the user scrolls.
 * Uses Framer Motion's useScroll and useSpring for smooth animations.
 * 
 * @example
 * ```tsx
 * import ScrollProgress from '@/components/animations/ScrollProgress'
 * 
 * export default function Layout() {
 *   return (
 *     <>
 *       <ScrollProgress />
 *       <main>{children}</main>
 *     </>
 *   )
 * }
 * ```
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  
  // Add spring physics for smoother animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

