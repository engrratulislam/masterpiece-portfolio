'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

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
            className="fixed left-0 top-0 bottom-0 w-64 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-r border-dark-200 dark:border-dark-600 z-50 lg:hidden flex flex-col justify-between py-12 px-6 transition-colors duration-300"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg bg-text-secondary/10 hover:bg-text-secondary/20 transition-colors text-text-primary"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Section */}
            <div className="text-center space-y-4">
              <Link href="/" className="block" onClick={onClose}>
                {/* Profile Picture */}
                <motion.div
                  className="relative w-20 h-20 mx-auto mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-cool to-accent-warm p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden bg-surface-light dark:bg-surface-dark">
                      <Image
                        src="/images/about/profile.jpeg"
                        alt="Engr. Ratul - Software Developer"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-light dark:border-surface-dark">
                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse" />
                  </div>
                </motion.div>
                
                {/* Professional Title */}
                <motion.div
                  className="space-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <h1 className="text-xl font-bold font-display gradient-text-primary">
                    Engr. Ratul
                  </h1>
                  <p className="text-sm font-medium text-text-secondary">
                    Software Developer
                  </p>
                </motion.div>
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
                          ? 'text-text-primary bg-accent-cool/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-text-secondary/10'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cool rounded-r"
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
              className="pt-6 border-t border-dark-200 space-y-3"
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
                  className="flex items-center gap-3 p-2 rounded-lg text-text-secondary hover:text-accent-cool hover:bg-text-secondary/10 transition-all group"
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

