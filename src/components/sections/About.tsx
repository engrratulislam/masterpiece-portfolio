'use client'

import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import { Download, Github, Linkedin, Mail, Code2, Rocket, Zap, Award } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import MagneticHover from '@/components/animations/MagneticHover'
import { contactInfo } from '@/data/contact-info'

export default function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] },
    },
  }

  const techStack = [
    { name: 'React', icon: '⚛️', level: 95 },
    { name: 'Next.js', icon: '▲', level: 92 },
    { name: 'TypeScript', icon: 'TS', level: 90 },
    { name: 'Node.js', icon: '🟢', level: 88 },
    { name: 'Laravel', icon: '🔴', level: 85 },
    { name: 'MongoDB', icon: '🍃', level: 87 },
    { name: 'Docker', icon: '🐳', level: 82 },
    { name: 'AWS', icon: '☁️', level: 80 },
  ]

  const highlights = [
    {
      icon: Code2,
      title: '3+ Years',
      description: 'Professional Experience',
      color: 'from-cool-500 to-gradient-start',
    },
    {
      icon: Rocket,
      title: '50+ Projects',
      description: 'Successfully Delivered',
      color: 'from-warm-500 to-gold-500',
    },
    {
      icon: Award,
      title: '100% Client',
      description: 'Satisfaction Rate',
      color: 'from-gradient-start to-gradient-end',
    },
  ]

  const socialLinks = [
    { icon: Github, href: contactInfo.social.github, label: 'GitHub', color: 'hover:text-dark-900' },
    { icon: Linkedin, href: contactInfo.social.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Mail, href: `mailto:${contactInfo.email}`, label: 'Email', color: 'hover:text-warm-500' },
  ]

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-secondary overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-cool rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-warm rounded-full blur-3xl opacity-10" />

      <div className="container-custom max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <span className="inline-block px-4 py-2 glass-modern rounded-full text-sm font-semibold text-text-primary mb-4">
              Get to Know Me
            </span>
            <h2 className="font-display font-bold text-fluid-4xl lg:text-fluid-5xl text-text-primary mb-4">
              About <span className="gradient-text-cool">Me</span>
            </h2>
            <p className="text-fluid-lg text-text-secondary max-w-2xl mx-auto">
              Passionate developer crafting exceptional digital experiences
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
            {/* Image Column */}
            <ScrollReveal direction="left">
              <div className="relative max-w-md mx-auto lg:mx-0">
                {/* Decorative Background */}
                <div className="absolute -inset-6 bg-gradient-primary rounded-3xl blur-2xl opacity-20" />
                
                {/* Image Container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 glass-modern">
                  <Image
                    src="/images/about/profile.jpeg"
                    alt="Engr. Ratul - Full Stack Developer"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>

                {/* Floating Badge */}
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-gradient-cool rounded-2xl p-6 shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl font-bold">3+</div>
                    <div className="text-sm font-medium opacity-90">Years</div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Text Column */}
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-fluid-3xl text-text-primary mb-6 min-h-[4rem]">
                    <TypeAnimation
                      sequence={[
                        "Hi, I'm Engr. Ratul",
                        2000,
                        "I'm a Full Stack Developer",
                        2000,
                        "I Build Amazing Products",
                        2000,
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={Infinity}
                      className="gradient-text-cool"
                    />
                  </h3>
                  
                  <p className="text-fluid-base text-text-secondary leading-relaxed mb-4">
                    A passionate <span className="font-semibold text-accent-cool">Full Stack Developer</span> with
                    over 3 years of experience building modern web applications. I specialize in creating scalable,
                    performant, and user-friendly solutions using cutting-edge technologies.
                  </p>
                  
                  <p className="text-fluid-base text-text-secondary leading-relaxed mb-4">
                    With a strong foundation in both frontend and backend development, I bring ideas to
                    life through clean code, thoughtful design, and innovative problem-solving.
                  </p>
                  
                  <p className="text-fluid-base text-text-secondary leading-relaxed">
                    When I'm not coding, you'll find me exploring new technologies, contributing to
                    open-source projects, or sharing knowledge with the developer community.
                  </p>
                </div>

                {/* CTA & Social */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                  <MagneticHover strength={12}>
                    <a
                      href="/images/about/Ratul-Islam-curriculum-vitae.pdf"
                      download="Ratul-Islam-Resume.pdf"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Download Resume
                    </a>
                  </MagneticHover>

                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ icon: Icon, href, label, color }) => (
                      <MagneticHover key={label} strength={10}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-3 glass-modern rounded-xl border border-dark-200 transition-all duration-300 group ${color} flex items-center justify-center`}
                          aria-label={label}
                          title={label}
                        >
                          <Icon 
                            className="w-5 h-5 transition-transform group-hover:scale-110 text-text-primary" 
                            strokeWidth={2}
                            fill="none"
                          />
                        </a>
                      </MagneticHover>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Highlights Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-24"
          >
            {highlights.map(({ icon: Icon, title, description, color }, index) => (
              <ScrollReveal key={title} direction="up" delay={index * 0.1}>
                <div className="group card-elevated text-center">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${color} rounded-2xl mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-text-primary mb-2">{title}</h4>
                  <p className="text-text-secondary">{description}</p>
                </div>
              </ScrollReveal>
            ))}
          </motion.div>

          {/* Tech Stack */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-12">
              <h3 className="font-display font-bold text-fluid-3xl text-text-primary mb-4">
                Tech Stack & <span className="gradient-text-primary">Expertise</span>
              </h3>
              <p className="text-text-secondary">Technologies I work with daily</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map((tech, index) => (
                <ScrollReveal key={tech.name} direction="up" delay={index * 0.05}>
                  <div className="card-glass group hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{tech.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-text-primary mb-1">{tech.name}</div>
                        <div className="text-xs text-text-secondary">{tech.level}% Proficiency</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-text-secondary/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-cool rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}