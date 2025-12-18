'use client'

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { skillCategories } from '@/data/skills'
import ScrollReveal from '@/components/animations/ScrollReveal'
import MagneticHover from '@/components/animations/MagneticHover'

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('frontend')

  const activeSkills = skillCategories.find(cat => cat.id === activeCategory)

  return (
    <section id="skills" className="relative py-24 lg:py-32 bg-secondary overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />

      <div className="container-custom max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-2 glass-modern rounded-full text-sm font-semibold text-text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            What I Do Best
          </motion.span>
          <h2 className="font-display font-bold text-fluid-4xl lg:text-fluid-5xl text-text-primary mb-4">
            Skills & <span className="gradient-text-warm">Expertise</span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {skillCategories.map((category) => (
            <MagneticHover key={category.id} strength={8}>
              <button
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-warm text-white shadow-lg'
                    : 'glass-modern text-text-primary hover:scale-105'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </button>
            </MagneticHover>
          ))}
        </div>

        {/* Active Category Content */}
        {activeSkills && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {/* Category Description */}
            <div className="text-center mb-12">
              <p className="text-fluid-lg text-text-secondary">
                {activeSkills.description}
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSkills.skills.map((skill, index) => (
                <ScrollReveal key={skill.name} direction="up" delay={index * 0.05}>
                  <div className="card-glass group hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{skill.icon}</div>
                        <div>
                          <h4 className="font-display font-bold text-lg text-text-primary">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-text-secondary">
                            {skill.level}% Proficiency
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-full h-2 bg-dark-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { value: '15+', label: 'Technologies Mastered' },
            { value: '90%', label: 'Average Proficiency' },
            { value: '5+', label: 'Years Learning' },
          ].map((stat, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <div className="card-elevated text-center">
                <div className="text-fluid-4xl font-display font-bold gradient-text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}