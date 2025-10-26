# Next.js Masterpiece Portfolio - Complete Implementation Guide

## 🎯 Project Overview

This document provides a comprehensive guide to building a world-class portfolio website using Next.js, combining the best features from multiple reference portfolios:

- **Elias Devis Portfolio**: Smooth animations, modern UI/UX
- **Tiger World (Figma)**: Clean design patterns, typography
- **Unrovr HTML**: Professional layout, sectioning
- **Metaverse/Frenify**: Advanced interactions, 3D elements, NFT/Web3 aesthetics

---

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Component Architecture](#component-architecture)
6. [Animation System](#animation-system)
7. [Styling Guidelines](#styling-guidelines)
8. [Performance Optimization](#performance-optimization)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🛠 Technology Stack

### Required Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.4",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.11",
    "@react-three/drei": "^9.88.17",
    "locomotive-scroll": "^4.1.4",
    "gsap": "^3.12.2",
    "lenis": "^1.0.27",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/react": "^18.2.37",
    "@types/node": "^20.9.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "eslint": "^8.53.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### Why These Technologies?

- **Next.js 14**: App Router for better performance, SEO, and routing
- **Framer Motion**: Smooth animations and transitions
- **Three.js + R3F**: 3D elements and interactive visuals
- **GSAP**: Advanced scroll-triggered animations
- **Lenis**: Butter-smooth scrolling experience
- **Tailwind CSS**: Rapid styling with utility classes

---

## 🚀 Project Setup

### Step 1: Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest --typescript --tailwind --app --use-npm

# Install additional dependencies
npm install framer-motion three @react-three/fiber @react-three/drei gsap lenis lucide-react clsx tailwind-merge
```

### Step 2: Configure Tailwind CSS

**File: `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        dark: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### Step 3: Configure Next.js

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config) => {
    config.externals.push({
      'three': 'three'
    });
    return config;
  },
}

module.exports = nextConfig
```

---

## 📁 Project Structure

```
portfolio-masterpiece/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── projects/
│   │   └── about/
│   ├── models/           # 3D models (.glb, .gltf)
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/     # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Contact.tsx
│   │   ├── animations/   # Animation components
│   │   │   ├── PageTransition.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   ├── TextReveal.tsx
│   │   │   └── ParallaxSection.tsx
│   │   └── three/        # 3D components
│   │       ├── Scene.tsx
│   │       ├── Model3D.tsx
│   │       └── ParticleField.tsx
│   ├── lib/
│   │   ├── utils.ts      # Utility functions
│   │   ├── constants.ts  # Constants and config
│   │   └── hooks/        # Custom React hooks
│   │       ├── useScroll.ts
│   │       ├── useMousePosition.ts
│   │       └── useMediaQuery.ts
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── experience.ts
│   └── types/
│       └── index.ts
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Core Features

### Feature Checklist

#### ✅ Hero Section
- [ ] Full-screen animated hero with 3D background
- [ ] Dynamic text animations (typewriter, fade, split text)
- [ ] Scroll indicator with smooth animation
- [ ] Particle effects or 3D scene
- [ ] Call-to-action buttons with hover effects

#### ✅ Navigation
- [ ] Fixed header with glassmorphism effect
- [ ] Smooth scroll navigation
- [ ] Mobile hamburger menu with animations
- [ ] Active section highlighting
- [ ] Theme toggle (dark/light mode)

#### ✅ About Section
- [ ] Animated profile image with hover effects
- [ ] Bio with reveal animations
- [ ] Tech stack showcase with icons
- [ ] Download resume button
- [ ] Social media links

#### ✅ Projects Section
- [ ] Filterable project grid
- [ ] Project cards with hover effects
- [ ] Modal/detail view for each project
- [ ] Image galleries with lightbox
- [ ] Live demo and GitHub links
- [ ] Tech stack tags

#### ✅ Skills Section
- [ ] Animated skill bars or circular progress
- [ ] Category-based skill organization
- [ ] Interactive skill cards
- [ ] Proficiency indicators

#### ✅ Experience Section
- [ ] Timeline layout
- [ ] Animated milestones
- [ ] Company logos
- [ ] Expandable descriptions

#### ✅ Testimonials Section
- [ ] Carousel/slider
- [ ] Client avatars
- [ ] Rating stars
- [ ] Animated quotes

#### ✅ Contact Section
- [ ] Working contact form with validation
- [ ] Form submission feedback
- [ ] Alternative contact methods
- [ ] Location map (optional)
- [ ] Email integration

#### ✅ Performance Features
- [ ] Lazy loading for images
- [ ] Code splitting
- [ ] Optimized fonts
- [ ] Lighthouse score > 90

---

## 🧩 Component Architecture

### 1. Root Layout Component

**File: `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Fira_Code } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/animations/SmoothScroll'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Name - Portfolio',
  description: 'Full-stack developer and designer',
  keywords: ['portfolio', 'web developer', 'designer', 'Next.js'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Name - Portfolio',
    description: 'Full-stack developer and designer',
    url: 'https://yourportfolio.com',
    siteName: 'Your Name Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}>
      <body className="bg-dark-900 text-white font-sans antialiased">
        <SmoothScroll>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
```

### 2. Header Component

**File: `src/components/layout/Header.tsx`**

```typescript
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-900/80 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold font-display">
              <motion.span
                className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                YourName
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}
```

### 3. Navigation Component

**File: `src/components/layout/Navigation.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href}>
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
                className="absolute inset-0 bg-primary-500/20 rounded-lg"
                layoutId="navbar-active"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.div>
        </Link>
      ))}
      
      {/* CTA Button */}
      <motion.a
        href="#contact"
        className="ml-4 px-6 py-2 bg-primary-500 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Talk
      </motion.a>
    </nav>
  )
}
```

### 4. Hero Section

**File: `src/components/sections/Hero.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import Scene3D from '@/components/three/Scene'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/70 to-dark-900 z-10" />

      {/* Content */}
      <motion.div
        className="relative z-20 container mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium">
            👋 Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-6"
        >
          <span className="block">Hi, I'm</span>
          <span className="block bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your Name
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Full-Stack Developer & Creative Designer crafting beautiful digital experiences
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href="#projects"
            className="px-8 py-4 bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-4 border-2 border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4"
        >
          {[
            { Icon: Github, href: 'https://github.com' },
            { Icon: Linkedin, href: 'https://linkedin.com' },
            { Icon: Mail, href: 'mailto:your@email.com' },
          ].map(({ Icon, href }, index) => (
            <motion.a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
```

### 5. Projects Section

**File: `src/components/sections/Projects.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { projects } from '@/data/projects'

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const categories = ['all', 'web', 'mobile', 'design', '3d']

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="py-20 md:py-32 bg-dark-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Featured <span className="text-primary-500">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Showcasing my best work in web development, design, and creative coding
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          layout
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-dark-900 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60" />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex items-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 🎬 Animation System

### Smooth Scroll Component

**File: `src/components/animations/SmoothScroll.tsx`**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Animation frame
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

### Scroll Reveal Component

**File: `src/components/animations/ScrollReveal.tsx`**

```typescript
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction] 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut' 
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Text Reveal Animation

**File: `src/components/animations/TextReveal.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  delay?: number
  className?: string
}

export default function TextReveal({ text, delay = 0, className = '' }: TextRevealProps) {
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
```

### Parallax Section

**File: `src/components/animations/ParallaxSection.tsx`**

```typescript
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
}

export default function ParallaxSection({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
```

### Page Transition

**File: `src/components/animations/PageTransition.tsx`**

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## 🎨 Styling Guidelines

### Global Styles

**File: `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-dark-900 text-white;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-dark-800;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-primary-500 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-primary-600;
  }

  /* Selection */
  ::selection {
    @apply bg-primary-500/30 text-white;
  }
}

@layer components {
  /* Glassmorphism Effect */
  .glass {
    @apply bg-white/5 backdrop-blur-md border border-white/10;
  }

  /* Gradient Text */
  .gradient-text {
    @apply bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent;
  }

  /* Container */
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Button Variants */
  .btn-primary {
    @apply px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50;
  }

  .btn-secondary {
    @apply px-6 py-3 border-2 border-white/20 rounded-lg font-medium hover:bg-white/10 transition-all duration-300;
  }

  .btn-ghost {
    @apply px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300;
  }

  /* Card Styles */
  .card {
    @apply bg-dark-800 rounded-xl p-6 border border-white/5 hover:border-primary-500/30 transition-all duration-300;
  }

  .card-hover {
    @apply hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1;
  }
}

@layer utilities {
  /* Text Shadows */
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .text-shadow-lg {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }

  /* Gradient Backgrounds */
  .bg-gradient-primary {
    @apply bg-gradient-to-br from-primary-500 to-purple-600;
  }

  .bg-gradient-dark {
    @apply bg-gradient-to-br from-dark-800 to-dark-900;
  }

  /* Animation Delays */
  .animation-delay-100 {
    animation-delay: 100ms;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-300 {
    animation-delay: 300ms;
  }

  .animation-delay-400 {
    animation-delay: 400ms;
  }
}

/* Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 1000px 100%;
}
```

---

## 🎭 3D Components

### Three.js Scene

**File: `src/components/three/Scene.tsx`**

```typescript
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import ParticleField from './ParticleField'

export default function Scene3D() {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />

      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
```

### Particle Field

**File: `src/components/three/ParticleField.tsx`**

```typescript
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 1000

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#0ea5e9"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
```

---

## 📊 Data Management

### Projects Data

**File: `src/data/projects.ts`**

```typescript
export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  images: string[]
  category: 'web' | 'mobile' | 'design' | '3d'
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  date: string
}

export const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with payment integration',
    longDescription: 'Built a comprehensive e-commerce solution with React, Node.js, and Stripe integration. Features include product management, shopping cart, user authentication, order tracking, and admin dashboard.',
    image: '/images/projects/ecommerce.jpg',
    images: [
      '/images/projects/ecommerce-1.jpg',
      '/images/projects/ecommerce-2.jpg',
      '/images/projects/ecommerce-3.jpg',
    ],
    category: 'web',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/project',
    featured: true,
    date: '2024-03',
  },
  {
    id: 'fitness-app',
    title: 'Fitness Tracking App',
    description: 'Mobile app for tracking workouts and nutrition',
    longDescription: 'Developed a cross-platform mobile application using React Native. Includes workout planning, progress tracking, nutrition calculator, and social features.',
    image: '/images/projects/fitness.jpg',
    images: [
      '/images/projects/fitness-1.jpg',
      '/images/projects/fitness-2.jpg',
    ],
    category: 'mobile',
    tags: ['React Native', 'Firebase', 'TypeScript', 'Expo'],
    liveUrl: 'https://example.com',
    featured: true,
    date: '2024-02',
  },
  {
    id: 'portfolio-3d',
    title: '3D Portfolio Experience',
    description: 'Interactive 3D portfolio website with Three.js',
    longDescription: 'Created an immersive portfolio experience using Three.js and React Three Fiber. Features include 3D models, particle effects, and interactive elements.',
    image: '/images/projects/3d-portfolio.jpg',
    images: ['/images/projects/3d-portfolio-1.jpg'],
    category: '3d',
    tags: ['Three.js', 'React', 'WebGL', 'GSAP'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/project',
    featured: true,
    date: '2024-01',
  },
]
```

### Skills Data

**File: `src/data/skills.ts`**

```typescript
export interface Skill {
  name: string
  level: number
  icon: string
  category: 'frontend' | 'backend' | 'design' | 'tools'
}

export const skills: Skill[] = [
  // Frontend
  { name: 'React/Next.js', level: 95, icon: '⚛️', category: 'frontend' },
  { name: 'TypeScript', level: 90, icon: '📘', category: 'frontend' },
  { name: 'Tailwind CSS', level: 95, icon: '🎨', category: 'frontend' },
  { name: 'Three.js', level: 80, icon: '🎮', category: 'frontend' },
  { name: 'Framer Motion', level: 85, icon: '✨', category: 'frontend' },
  
  // Backend
  { name: 'Node.js', level: 85, icon: '🟢', category: 'backend' },
  { name: 'Python', level: 75, icon: '🐍', category: 'backend' },
  { name: 'PostgreSQL', level: 80, icon: '🐘', category: 'backend' },
  { name: 'MongoDB', level: 85, icon: '🍃', category: 'backend' },
  { name: 'GraphQL', level: 75, icon: '◼️', category: 'backend' },
  
  // Design
  { name: 'Figma', level: 90, icon: '🎨', category: 'design' },
  { name: 'Adobe XD', level: 80, icon: '🎭', category: 'design' },
  { name: 'Blender', level: 70, icon: '🎲', category: 'design' },
  
  // Tools
  { name: 'Git', level: 90, icon: '📦', category: 'tools' },
  { name: 'Docker', level: 75, icon: '🐳', category: 'tools' },
  { name: 'AWS', level: 70, icon: '☁️', category: 'tools' },
]
```

---

## 🔧 Utility Functions

### Utility Library

**File: `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Smooth scroll to element
export function scrollToElement(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// Check if element is in viewport
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
```

### Custom Hooks

**File: `src/lib/hooks/useScroll.ts`**

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useScroll() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')

  useEffect(() => {
    let lastScrollY = window.pageYOffset

    const updateScroll = () => {
      const scrollY = window.pageYOffset
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction)
      }
      
      setScrollY(scrollY)
      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [scrollDirection])

  return { scrollY, scrollDirection }
}
```

**File: `src/lib/hooks/useMediaQuery.ts`**

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Preset breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
```

**File: `src/lib/hooks/useMousePosition.ts`**

```typescript
'use client'

import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}
```

---

## ⚡ Performance Optimization

### Image Optimization Checklist

- [ ] Use Next.js `<Image>` component for all images
- [ ] Specify width and height for all images
- [ ] Use WebP format with fallbacks
- [ ] Implement lazy loading for below-the-fold images
- [ ] Add blur placeholders for better UX
- [ ] Optimize image sizes (use appropriate dimensions)

### Code Splitting Strategy

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-dark-900 animate-pulse" />,
})

const ProjectModal = dynamic(() => import('@/components/ProjectModal'))
```

### Font Loading

**File: `src/app/layout.tsx`** (Already included above)

```typescript
// Use next/font for automatic font optimization
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // IMPORTANT: Use swap for better performance
  variable: '--font-inter',
})
```

### Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
npm install -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables

**File: `.env.local`**

```bash
# API Keys
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Email Service (e.g., SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your@email.com

# Database (if needed)
DATABASE_URL=postgresql://user:password@host:port/database

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_id
```

### Build Commands

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "analyze": "ANALYZE=true next build"
  }
}
```

### Pre-Deployment Checklist

- [ ] Run `npm run build` locally to check for errors
- [ ] Test on multiple devices and browsers
- [ ] Check Lighthouse scores (Performance, Accessibility, SEO)
- [ ] Verify all links work correctly
- [ ] Test contact form submission
- [ ] Check meta tags and OG images
- [ ] Verify Google Analytics/tracking is working
- [ ] Test with slow 3G connection
- [ ] Check console for errors
- [ ] Verify all images load correctly

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Three.js Not Rendering

**Problem**: Black screen or 3D elements not appearing

**Solutions**:
```typescript
// 1. Ensure Canvas has explicit dimensions
<div className="w-full h-screen">
  <Canvas>...</Canvas>
</div>

// 2. Add lights to the scene
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} />

// 3. Disable SSR for Three.js components
const Scene3D = dynamic(() => import('./Scene'), { ssr: false })

// 4. Check camera position
<PerspectiveCamera makeDefault position={[0, 0, 5]} />
```

#### Issue 2: Framer Motion Animations Not Working

**Problem**: Elements appear without animation

**Solutions**:
```typescript
// 1. Ensure motion components are used
import { motion } from 'framer-motion'
<motion.div animate={{ opacity: 1 }}>...</motion.div>

// 2. Check viewport settings for scroll animations
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.3 }} // Added amount
>

// 3. Verify parent has overflow visible
// Avoid: overflow-hidden on parent containers
```

#### Issue 3: Lenis Smooth Scroll Conflicts

**Problem**: Scroll behavior is jumpy or broken

**Solutions**:
```typescript
// 1. Disable native smooth scroll
html {
  scroll-behavior: auto; /* Not smooth */
}

// 2. Ensure Lenis cleanup
useEffect(() => {
  const lenis = new Lenis({...})
  return () => lenis.destroy() // Important!
}, [])

// 3. Handle anchor links properly
lenis.on('scroll', (e) => {
  // Update scroll position for other libraries
})
```

#### Issue 4: Images Not Loading

**Problem**: Next.js Image component shows error

**Solutions**:
```typescript
// 1. Add domain to next.config.js
module.exports = {
  images: {
    domains: ['yourdomain.com', 'images.unsplash.com'],
  },
}

// 2. Ensure src path is correct
<Image src="/images/hero.jpg" /> // Public folder
<Image src={import('./image.jpg')} /> // Imported

// 3. Always provide width and height
<Image src="..." width={1200} height={800} alt="..." />
```

#### Issue 5: Build Errors with TypeScript

**Problem**: Type errors during build

**Solutions**:
```typescript
// 1. Create proper types
// src/types/index.ts
export interface Project {
  id: string
  title: string
  // ... other fields
}

// 2. Add type safety to components
interface Props {
  projects: Project[]
}

export default function Projects({ projects }: Props) {
  // ...
}

// 3. Use proper typing for refs
const ref = useRef<HTMLDivElement>(null)
```

#### Issue 6: Performance Issues / Slow Loading

**Problem**: Site loads slowly or animations are janky

**Solutions**:
```typescript
// 1. Implement code splitting
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
})

// 2. Optimize images
<Image
  src="..."
  placeholder="blur"
  blurDataURL="data:image/..." // Or use plaiceholder
  quality={80} // Reduce if needed
/>

// 3. Reduce particle count
const particleCount = isMobile ? 500 : 1000

// 4. Use requestAnimationFrame correctly
useFrame(() => {
  // Limit calculations
  if (frameCount % 2 === 0) {
    // Update every other frame
  }
})

// 5. Implement virtual scrolling for long lists
import { FixedSizeList } from 'react-window'
```

#### Issue 7: Mobile Menu Not Closing

**Problem**: Mobile menu stays open after navigation

**Solutions**:
```typescript
// 1. Close menu on route change
const pathname = usePathname()

useEffect(() => {
  setIsMobileMenuOpen(false)
}, [pathname])

// 2. Close on outside click
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }
  
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

// 3. Prevent body scroll when menu is open
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
```

#### Issue 8: Contact Form Not Submitting

**Problem**: Form submission fails or doesn't send emails

**Solutions**:
```typescript
// 1. Create API route for form handling
// app/api/contact/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email (using SendGrid, Resend, or Nodemailer)
    // await sendEmail({ name, email, message })

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// 2. Handle form submission
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } else {
      toast.error('Failed to send message')
    }
  } catch (error) {
    toast.error('An error occurred')
  } finally {
    setIsSubmitting(false)
  }
}
```

---

## 📱 Responsive Design Guidelines

### Breakpoint Strategy

```typescript
// Use Tailwind's default breakpoints
// sm: 640px   - Mobile landscape, small tablets
// md: 768px   - Tablets
// lg: 1024px  - Small laptops
// xl: 1280px  - Desktops
// 2xl: 1536px - Large desktops

// Example responsive component
<div className="
  px-4           // Mobile: 16px padding
  sm:px-6        // Small screens: 24px padding
  lg:px-8        // Large screens: 32px padding
  
  text-2xl       // Mobile: 1.5rem
  md:text-4xl    // Tablet: 2.25rem
  lg:text-5xl    // Desktop: 3rem
  
  grid-cols-1    // Mobile: 1 column
  md:grid-cols-2 // Tablet: 2 columns
  lg:grid-cols-3 // Desktop: 3 columns
">
```

### Mobile-First Approach

```typescript
// ✅ Correct: Start with mobile styles
<div className="text-sm md:text-base lg:text-lg">

// ❌ Wrong: Desktop-first approach
<div className="text-lg md:text-base sm:text-sm">
```

### Touch-Friendly Elements

```css
/* Minimum touch target size */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Increase tap areas on mobile */
@media (max-width: 768px) {
  .btn {
    padding: 1rem 1.5rem; /* Larger padding */
  }
}
```

---

## 🔒 Security Best Practices

### Environment Variables

```bash
# ✅ Never commit sensitive data
# Use .env.local for local development
# Set production variables in Vercel/hosting platform

# Public variables (accessible in browser)
NEXT_PUBLIC_SITE_URL=https://yoursite.com

# Private variables (server-side only)
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=SG.xxx
```

### API Routes Security

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiting
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    await limiter.check(ip, 5) // 5 requests per minute

    // CSRF protection (if using sessions)
    const csrfToken = request.headers.get('x-csrf-token')
    // Verify CSRF token

    // Input sanitization
    const body = await request.json()
    const sanitizedData = sanitizeInput(body)

    // Process request
    // ...

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 📊 Analytics & SEO

### Google Analytics Setup

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### SEO Optimization

```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Name - Full-Stack Developer & Designer',
  description: 'Portfolio showcasing web development, design, and creative projects. Specializing in React, Next.js, and modern web technologies.',
  keywords: [
    'web developer',
    'full-stack developer',
    'react developer',
    'next.js',
    'portfolio',
    'web design',
  ],
  authors: [{ name: 'Your Name', url: 'https://yoursite.com' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Your Name - Full-Stack Developer',
    description: 'Portfolio showcasing web development and design projects',
    siteName: 'Your Name Portfolio',
    images: [
      {
        url: 'https://yoursite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Name Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - Full-Stack Developer',
    description: 'Portfolio showcasing web development and design projects',
    creator: '@yourusername',
    images: ['https://yoursite.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### Structured Data (JSON-LD)

```typescript
// components/StructuredData.tsx
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Your Name',
    url: 'https://yoursite.com',
    image: 'https://yoursite.com/profile.jpg',
    jobTitle: 'Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Company Name',
    },
    sameAs: [
      'https://github.com/yourusername',
      'https://linkedin.com/in/yourusername',
      'https://twitter.com/yourusername',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://yoursite.com/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://yoursite.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
```

---

## ✅ Testing Checklist

### Pre-Launch Testing

#### Performance Testing
- [ ] Lighthouse score > 90 for all metrics
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Test on slow 3G connection
- [ ] Check bundle size < 200kb (initial load)

#### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Responsive Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)
- [ ] 4K Display (3840px)

#### Functionality Testing
- [ ] All navigation links work
- [ ] Mobile menu opens/closes correctly
- [ ] Contact form submits successfully
- [ ] External links open in new tab
- [ ] Smooth scrolling works
- [ ] Animations trigger correctly
- [ ] Images load with proper lazy loading
- [ ] 3D elements render properly
- [ ] No console errors

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Alt text on all images
- [ ] Proper heading hierarchy
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader friendly
- [ ] ARIA labels where needed

#### SEO Testing
- [ ] Meta tags are present
- [ ] Open Graph tags work
- [ ] Twitter cards work
- [ ] Sitemap generates correctly
- [ ] Robots.txt is configured
- [ ] Canonical URLs set
- [ ] Structured data validates

---

## 🎯 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/hero-section

# Make changes and commit
git add .
git commit -m "feat: add hero section with 3D background"

# Push to remote
git push origin feature/hero-section

# Create pull request
# Merge after review

# Update main branch
git checkout main
git pull origin main
```

### Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semi colons, etc
refactor: code refactoring
test: adding tests
chore: maintenance tasks

Examples:
feat: add contact form with validation
fix: resolve mobile menu animation issue
docs: update README with deployment instructions
style: format code with Prettier
refactor: extract hero section into component
```

### Code Review Checklist

- [ ] Code follows project structure
- [ ] No console.logs or debug code
- [ ] All TypeScript types are defined
- [ ] Components are properly documented
- [ ] Responsive design is implemented
- [ ] Accessibility features included
- [ ] Performance optimizations applied
- [ ] No hardcoded values (use constants)
- [ ] Error handling is implemented
- [ ] Code is DRY (Don't Repeat Yourself)

---

## 📚 Additional Resources

### Documentation Links

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion/
- **Three.js**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

### Design Inspiration

- **Awwwards**: https://www.awwwards.com/
- **Dribbble**: https://dribbble.com/
- **Behance**: https://www.behance.net/
- **CodePen**: https://codepen.io/
- **CSS Design Awards**: https://www.cssdesignawards.com/

### Learning Resources

- **Next.js Learn**: https://nextjs.org/learn
- **React Tutorial**: https://react.dev/learn
- **Three.js Journey**: https://threejs-journey.com/
- **Web.dev**: https://web.dev/learn/
- **MDN Web Docs**: https://developer.mozilla.org/

---

## 🚨 Critical Reminders for Developers

### ⚠️ MUST DO

1. **NEVER commit sensitive data** (API keys, passwords, tokens)
2. **ALWAYS use TypeScript types** - no `any` types unless absolutely necessary
3. **ALWAYS optimize images** - use Next.js Image component
4. **ALWAYS test on mobile devices** - mobile-first approach
5. **ALWAYS handle errors** - try-catch blocks and error boundaries
6. **ALWAYS add loading states** - improve perceived performance
7. **ALWAYS validate user inputs** - both client and server-side
8. **ALWAYS use semantic HTML** - for accessibility and SEO
9. **ALWAYS test in multiple browsers** - ensure cross-browser compatibility
10. **ALWAYS comment complex logic** - make code maintainable

### ❌ NEVER DO

1. **NEVER use `any` type** without a very good reason
2. **NEVER skip error handling** - especially in API routes
3. **NEVER hardcode sensitive data** - use environment variables
4. **NEVER ignore TypeScript errors** - fix them properly
5. **NEVER skip responsive testing** - test all breakpoints
6. **NEVER use inline styles** - use Tailwind or CSS modules
7. **NEVER skip accessibility** - always include ARIA labels
8. **NEVER commit node_modules** - use .gitignore
9. **NEVER skip loading states** - always show user feedback
10. **NEVER deploy without testing** - test thoroughly before deployment

---

## 📞 Support & Maintenance

### Common Maintenance Tasks

```bash
# Update dependencies
npm outdated # Check for updates
npm update # Update to latest minor/patch versions
npm install <package>@latest # Update specific package

# Security audits
npm audit # Check for vulnerabilities
npm audit fix # Fix vulnerabilities automatically

# Clean cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Format code
npm run format

# Lint code
npm run lint -- --fix
```

### Monitoring & Analytics

1. **Setup monitoring** (Vercel Analytics, Sentry)
2. **Track Core Web Vitals** (Lighthouse CI)
3. **Monitor error logs** (Check daily for issues)
4. **Review analytics** (User behavior, popular pages)
5. **Update content regularly** (Projects, blog posts)

---

## 🎉 Final Notes

This documentation provides a complete blueprint for building a world-class portfolio website. Follow these guidelines carefully to ensure:

✨ **Exceptional Performance**: Fast loading, smooth animations
🎨 **Beautiful Design**: Modern, responsive, accessible
🔒 **Secure Implementation**: Protected APIs, safe data handling
📱 **Mobile-First**: Works perfectly on all devices
🚀 **Production-Ready**: Optimized for deployment

### Success Metrics

Your portfolio should achieve:
- **Lighthouse Score**: > 90 in all categories
- **Load Time**: < 3 seconds on 3G
- **Accessibility**: WCAG AA compliance
- **Browser Support**: 95%+ global coverage
- **User Engagement**: Low bounce rate, high time on site

### Next Steps

1. ✅ Setup project using this guide
2. ✅ Build components one section at a time
3. ✅ Test thoroughly on all devices
4. ✅ Optimize performance
5. ✅ Deploy to Vercel
6. ✅ Monitor and iterate

**Remember**: A portfolio is never truly "finished". Keep updating, improving, and showcasing your latest work!

---

## 📄 Document Version

**Version**: 1.0.0  
**Last Updated**: October 2024  
**Author**: Portfolio Development Team  
**Status**: Production Ready  

For questions or issues, refer to the troubleshooting section or consult the official Next.js documentation.

**Good luck building your masterpiece! 🚀**
