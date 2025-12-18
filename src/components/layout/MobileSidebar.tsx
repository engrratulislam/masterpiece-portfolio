'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
]

const socialLinks = [
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/engr-ratulislam/', label: 'LinkedIn' },
  { Icon: Github, href: 'https://github.com/engrratulislam', label: 'GitHub' },
  { Icon: Mail, href: 'mailto:ratul.innovations@gmail.com', label: 'Email' },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('hero')

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-dark-800/95 backdrop-blur-md border-r border-white/10 z-50 lg:hidden flex flex-col justify-between py-12 px-6"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div>
              <Link href="/" className="block text-center" onClick={onClose}>
                <motion.h1
                  className="text-2xl font-bold font-display bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  Engr. Ratul
                </motion.h1>
              </Link>
            </div>

            {/* Navigation - Centered */}
            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const sectionId = item.href.replace('#', '')
                const isActive = activeSection === sectionId

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className={`block py-3 px-4 text-base font-medium transition-all relative group rounded-lg ${
                        isActive
                          ? 'text-white bg-primary-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r"
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scaleY: isActive ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </a>
                  </motion.div>
                )
              })}
            </nav>

            {/* Social Links */}
            <motion.div
              className="pt-6 border-t border-white/10 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-white/5 transition-all group"
                  whileHover={{ x: 3 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

