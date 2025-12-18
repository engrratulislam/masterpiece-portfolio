'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, Briefcase, Zap } from 'lucide-react'

export default function ParallaxNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/parallax-demo', label: 'Demo', icon: Sparkles },
    { href: '/parallax-portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/parallax-advanced', label: 'Advanced', icon: Zap },
  ]

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-3">
      <ul className="flex items-center gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
