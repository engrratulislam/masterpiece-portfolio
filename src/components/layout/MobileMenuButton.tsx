'use client'

import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import MobileSidebar from './MobileSidebar'
import { usePathname } from 'next/navigation'

export default function MobileMenuButton() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Don't render on ANY admin pages - AFTER all hooks
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 lg:hidden p-3 rounded-lg glass-modern hover:scale-105 transition-all text-text-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

