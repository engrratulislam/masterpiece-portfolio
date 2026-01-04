'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface QuickLink {
  name: string
  href: string
}

interface SocialLink {
  name: string
  icon: string
  href: string
}

interface FooterData {
  brandName: string
  brandDescription: string
  quickLinksTitle: string
  quickLink1Name: string | null
  quickLink1Href: string | null
  quickLink2Name: string | null
  quickLink2Href: string | null
  quickLink3Name: string | null
  quickLink3Href: string | null
  quickLink4Name: string | null
  quickLink4Href: string | null
  socialTitle: string
  githubUrl: string | null
  linkedinUrl: string | null
  emailAddress: string | null
  copyrightText: string
  footerNote: string | null
  quickLinks?: QuickLink[]  // Computed property
  socialLinks?: SocialLink[]  // Computed property
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, typeof Github> = {
    Github,
    Linkedin,
    Mail,
  }
  return icons[iconName] || Mail
}

export default function Footer() {
  const pathname = usePathname()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/footer')
      if (response.ok) {
        const data = await response.json()
        const dbData = data.data
        
        // Build quick links array from individual fields
        const quickLinks: QuickLink[] = []
        if (dbData.quickLink1Name && dbData.quickLink1Href) {
          quickLinks.push({ name: dbData.quickLink1Name, href: dbData.quickLink1Href })
        }
        if (dbData.quickLink2Name && dbData.quickLink2Href) {
          quickLinks.push({ name: dbData.quickLink2Name, href: dbData.quickLink2Href })
        }
        if (dbData.quickLink3Name && dbData.quickLink3Href) {
          quickLinks.push({ name: dbData.quickLink3Name, href: dbData.quickLink3Href })
        }
        if (dbData.quickLink4Name && dbData.quickLink4Href) {
          quickLinks.push({ name: dbData.quickLink4Name, href: dbData.quickLink4Href })
        }
        
        // Build social links array from individual fields
        const socialLinks: SocialLink[] = []
        if (dbData.githubUrl) {
          socialLinks.push({ name: 'GitHub', icon: 'Github', href: dbData.githubUrl })
        }
        if (dbData.linkedinUrl) {
          socialLinks.push({ name: 'LinkedIn', icon: 'Linkedin', href: dbData.linkedinUrl })
        }
        if (dbData.emailAddress) {
          socialLinks.push({ name: 'Email', icon: 'Mail', href: `mailto:${dbData.emailAddress}` })
        }
        
        setFooterData({
          ...dbData,
          quickLinks,
          socialLinks,
        })
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render on ANY admin pages - AFTER all hooks
  if (pathname?.startsWith('/admin')) {
    return null
  }

  if (loading || !footerData) {
    return (
      <footer className="bg-secondary border-t border-dark-200 lg:pl-64">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 animate-pulse">
            <div className="h-24 bg-dark-100 rounded" />
            <div className="h-24 bg-dark-100 rounded" />
            <div className="h-24 bg-dark-100 rounded" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-secondary border-t border-dark-200 lg:pl-64">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold font-display">
              <span className="gradient-text-primary">
                {footerData.brandName}
              </span>
            </Link>
            <p className="mt-4 text-text-secondary text-sm">
              {footerData.brandDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">{footerData.quickLinksTitle}</h3>
            <ul className="space-y-2">
              {footerData.quickLinks && footerData.quickLinks.map((link) => (
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
            <h3 className="text-lg font-semibold mb-4 text-text-primary">{footerData.socialTitle}</h3>
            <div className="flex space-x-4">
              {footerData.socialLinks && footerData.socialLinks.map((social) => {
                const IconComponent = getIconComponent(social.icon)
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-modern rounded-lg hover:scale-110 transition-all text-text-primary"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © {currentYear} {footerData.copyrightText}
            </p>
            {footerData.footerNote && (
              <p className="text-text-secondary text-sm flex items-center">
                {footerData.footerNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

