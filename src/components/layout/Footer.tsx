'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { contactInfo } from '@/data/contact-info'
import { usePathname } from 'next/navigation'

const socialLinks = [
  { name: 'GitHub', icon: Github, href: contactInfo.social.github },
  { name: 'LinkedIn', icon: Linkedin, href: contactInfo.social.linkedin },
  { name: 'Email', icon: Mail, href: `mailto:${contactInfo.email}` },
]

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Footer() {
  const pathname = usePathname()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Don't render on admin login page
  if (pathname === '/admin/login') {
    return null
  }

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-secondary border-t border-dark-200 lg:pl-64">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold font-display">
              <span className="gradient-text-primary">
                Engr. Ratul
              </span>
            </Link>
            <p className="mt-4 text-text-secondary text-sm">
              Full Stack Developer & Server Infrastructure Specialist crafting scalable solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-cool transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-modern rounded-lg hover:scale-110 transition-all text-text-primary"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={name}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © {currentYear} Engr. Ratul. All rights reserved.
            </p>
            <p className="text-text-secondary text-sm flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-warm-500" /> using Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

