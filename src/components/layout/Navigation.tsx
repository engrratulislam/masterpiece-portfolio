'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const pathname = usePathname()

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
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
        >
          <motion.div
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {item.name}
            </span>
            {pathname === item.href && (
              <motion.div
                className="absolute inset-0 glass-modern rounded-lg"
                layoutId="navbar-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.div>
        </a>
      ))}
      
      {/* CTA Button */}
      <motion.a
        href="#contact"
        onClick={(e) => handleClick(e, '#contact')}
        className="ml-4 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Talk
      </motion.a>
    </nav>
  )
}

