'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import dynamic from 'next/dynamic'
import ParallaxLayer from './ParallaxLayer'
import TextSplitReveal from '@/components/animations/TextSplitReveal'
import MagneticHover from '@/components/animations/MagneticHover'

const Scene3D = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-dark-900 animate-pulse" />,
})

export default function ParallaxHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layer Parallax Background */}
      <ParallaxLayer speed={0.1} className="absolute inset-0 z-0">
        <Scene3D />
      </ParallaxLayer>

      <ParallaxLayer speed={0.2} className="absolute inset-0 z-[5]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.3} className="absolute inset-0 z-[5]">
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.15} className="absolute inset-0 z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.05} className="absolute inset-0 z-[15]">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/70 to-dark-900" />
      </ParallaxLayer>

      {/* Content with different speeds */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <ParallaxLayer speed={0.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium backdrop-blur-sm">
              👋 Welcome to my portfolio
            </span>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.5}>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-display mb-6">
            <TextSplitReveal text="Hi, I'm" type="words" delay={0.5} className="block text-white" />
            <TextSplitReveal
              text="Engr. Ratul"
              type="chars"
              delay={0.8}
              className="block bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            />
          </h1>
        </ParallaxLayer>

        <ParallaxLayer speed={0.6}>
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 mb-2">
              Full Stack Developer
            </h2>
            <p className="text-lg md:text-xl text-primary-400 font-medium">
              Server & Infrastructure Specialist
            </p>
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.7}>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Crafting scalable solutions with modern technologies.
            Specialized in building robust server architectures and seamless user experiences.
          </p>
        </ParallaxLayer>

        <ParallaxLayer speed={0.8}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <MagneticHover strength={20}>
              <motion.a
                href="#projects"
                className="px-8 py-4 bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-colors w-full sm:w-auto shadow-lg shadow-primary-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
            </MagneticHover>
            <MagneticHover strength={20}>
              <motion.a
                href="#contact"
                className="px-8 py-4 border-2 border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </MagneticHover>
          </div>
        </ParallaxLayer>

        <ParallaxLayer speed={0.9}>
          <div className="flex items-center justify-center gap-4">
            {[
              { Icon: Github, href: 'https://github.com/engrratulislam', label: 'GitHub' },
              { Icon: Linkedin, href: 'https://www.linkedin.com/in/engr-ratulislam/', label: 'LinkedIn' },
              { Icon: Mail, href: 'mailto:ratul.innovations@gmail.com', label: 'Email' },
            ].map(({ Icon, href, label }, index) => (
              <MagneticHover key={index} strength={15}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              </MagneticHover>
            ))}
          </div>
        </ParallaxLayer>
      </div>

      {/* Scroll Indicator */}
      <ParallaxLayer speed={1} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-400">Scroll</span>
          <ArrowDown className="w-6 h-6 text-primary-500" />
        </motion.div>
      </ParallaxLayer>
    </section>
  )
}
