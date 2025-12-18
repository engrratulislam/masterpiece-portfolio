'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Download, Sparkles, Code2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import MagneticHover from '@/components/animations/MagneticHover'
import ScrollReveal from '@/components/animations/ScrollReveal'

const Scene3D = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-gradient-start/10 to-gradient-end/10 animate-pulse" />,
})

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.6, 0.01, 0.05, 0.95] 
      },
    },
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh-gradient" />
      
      {/* 3D Scene Background */}
      <div className="absolute inset-0 opacity-30">
        <Scene3D />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-cool rounded-full blur-3xl opacity-20 animate-pulse floating" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-warm rounded-full blur-3xl opacity-20 animate-pulse floating animation-delay-300" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 0, 0, 0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container-custom max-w-7xl mx-auto px-6 lg:px-12 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-modern rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 text-accent-cool animate-pulse" />
                <span className="text-sm font-semibold text-text-primary">Available for Projects</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-display font-bold leading-[1.1] tracking-tight">
                <span className="block text-fluid-3xl lg:text-fluid-5xl text-text-primary">
                  Engr. Ratul
                </span>
                <span className="block text-fluid-4xl lg:text-fluid-6xl gradient-text-cool mt-2">
                  Full Stack Developer
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-fluid-lg text-text-secondary leading-relaxed max-w-xl"
            >
              Crafting exceptional digital experiences with modern technologies. 
              Specialized in building scalable architectures and seamless user interfaces.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <MagneticHover strength={15}>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">View My Work</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                </a>
              </MagneticHover>

              <MagneticHover strength={12}>
                <a
                  href="/images/about/Ratul-Islam-curriculum-vitae.pdf"
                  download="Ratul-Islam-Resume.pdf"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 glass-modern border-2 border-dark-300 font-semibold rounded-xl hover:border-accent-cool transition-all duration-300"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Download CV
                </a>
              </MagneticHover>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { value: '3+', label: 'Years Exp' },
                { value: '50+', label: 'Projects' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-fluid-3xl font-display font-bold gradient-text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {/* Experience Card */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="group card-elevated hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-cool rounded-xl shadow-lg">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                    Experience
                  </h3>
                </div>
                <p className="text-3xl font-bold text-text-primary mb-2">3+ Years</p>
                <p className="text-sm text-text-secondary">Building digital products</p>
              </div>
            </ScrollReveal>

            {/* Projects Card */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="group card-elevated hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-warm rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                    Projects
                  </h3>
                </div>
                <p className="text-3xl font-bold text-text-primary mb-2">50+</p>
                <p className="text-sm text-text-secondary">Completed successfully</p>
              </div>
            </ScrollReveal>

            {/* Tech Stack Card */}
            <ScrollReveal direction="right" delay={0.4}>
              <div className="col-span-2 card-glass">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-cool pulse-glow" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'JavaScript', color: '#FBBF24', bgColor: 'yellow' },
                    { name: 'React', color: '#3B82F6', bgColor: 'blue' },
                    { name: 'Next.js', color: '#1F2937', bgColor: 'gray' },
                    { name: 'TypeScript', color: '#2563EB', bgColor: 'blue' },
                    { name: 'Node.js', color: '#10B981', bgColor: 'green' },
                    { name: 'PHP', color: '#6366F1', bgColor: 'indigo' },
                    { name: 'Laravel', color: '#EF4444', bgColor: 'red' },
                    { name: 'MongoDB', color: '#059669', bgColor: 'emerald' },
                    { name: 'MySQL', color: '#1E40AF', bgColor: 'blue' },
                  ].map((tech) => (
                    <motion.span
                      key={tech.name}
                      className="px-3 py-1.5 bg-white/50 border border-dark-200 rounded-lg text-xs font-medium text-text-primary transition-all duration-300 cursor-default"
                      whileHover={{
                        backgroundColor: `${tech.color}20`,
                        borderColor: tech.color,
                        color: tech.color,
                        scale: 1.05,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tech.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 group cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent-cool to-transparent" />
          </motion.div>
          <span className="text-xs text-text-secondary uppercase tracking-[0.2em] font-semibold group-hover:text-accent-cool transition-colors">
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}