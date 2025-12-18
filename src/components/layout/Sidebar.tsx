'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/common/ThemeToggle'

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

export default function Sidebar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''))
      const scrollPosition = window.scrollY + 100 // Offset for better detection

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
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen w-64 bg-dark-800/95 backdrop-blur-md border-r border-white/10 z-50 hidden lg:flex flex-col justify-between py-12 px-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {/* Logo */}
      <div>
        <Link href="/" className="block text-center">
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
              transition={{ delay: index * 0.1 + 0.2 }}
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

      {/* Theme Toggle and Social Links */}
      <motion.div
        className="pt-6 border-t border-white/10 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
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
            <span className="text-sm font-medium">
              {label}
            </span>
          </motion.a>
        ))}
      </motion.div>
    </motion.aside>
  )
}

