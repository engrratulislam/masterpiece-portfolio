'use client'

import { useState, useEffect } from 'react'
import { motion, type Variants, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Briefcase, MapPin, Calendar, ExternalLink, ChevronDown, ChevronUp, Award } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import MagneticHover from '@/components/animations/MagneticHover'

interface Experience {
  id: string
  company: string
  position: string
  location: string
  type: string
  startDate: string
  endDate: string
  description: string
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  logo?: string
  companyUrl?: string
}

interface ExperienceSection {
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sectionData, setSectionData] = useState<ExperienceSection>({
    sectionBadge: 'Career Journey',
    sectionTitle: 'Work Experience',
    sectionDescription: 'My professional journey and key achievements',
  })

  useEffect(() => {
    fetchExperiences()
    fetchSection()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience')
      if (response.ok) {
        const data = await response.json()
        const exps = data.data || []
        setExperiences(exps)
        if (exps.length > 0) setExpandedId(exps[0].id)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/experience-section')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data.data)
      }
    } catch (error) {
      console.error('Error fetching section:', error)
      // Keep default values on error
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (date: string) => {
    if (date === 'Present') return 'Present'
    return date
  }

  const calculateDuration = (start: string, end: string) => {
    return '1 yr'
  }

  return (
    <section id="experience" className="relative py-24 lg:py-32 bg-secondary overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-cool rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-warm rounded-full blur-3xl opacity-10" />

      <div className="container-custom max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block px-4 py-2 glass-modern rounded-full text-sm font-semibold text-text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {sectionData.sectionBadge}
          </motion.span>
          <h2 className="font-display font-bold text-fluid-4xl lg:text-fluid-5xl text-text-primary mb-4">
            {sectionData.sectionTitle.split(' ')[0]} <span className="gradient-text-primary">{sectionData.sectionTitle.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-2xl mx-auto">
            {sectionData.sectionDescription}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-cool via-accent-warm to-accent-gold hidden md:block" />

          {/* Experience Items */}
          <div className="space-y-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="md:ml-20 card-glass animate-pulse h-48" />
              ))
            ) : (
              experiences.map((exp, index) => (
              <ScrollReveal key={exp.id} direction="up" delay={index * 0.1}>
                <div className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-8 top-8 w-4 h-4 -ml-2 rounded-full bg-gradient-primary shadow-lg hidden md:block" />

                  {/* Card */}
                  <div className="md:ml-20">
                    <div
                      className={`card-elevated cursor-pointer transition-all duration-300 ${
                        expandedId === exp.id ? 'ring-2 ring-accent-cool' : ''
                      }`}
                      onClick={() => toggleExpand(exp.id)}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {exp.logo && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                            <Image
                              src={exp.logo}
                              alt={exp.company}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-display font-bold text-xl text-text-primary mb-1">
                                {exp.position}
                              </h3>
                              <div className="flex items-center gap-2 text-text-secondary">
                                <Briefcase className="w-4 h-4" />
                                <span className="font-semibold">{exp.company}</span>
                                {exp.companyUrl && (
                                  <a
                                    href={exp.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-accent-cool hover:text-cool-600 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </div>

                            <button
                              className="p-2 glass-modern rounded-lg hover:scale-110 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpand(exp.id)
                              }}
                            >
                              {expandedId === exp.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-text-secondary/10 text-text-primary rounded-full ml-1">
                                {calculateDuration(exp.startDate, exp.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>

                          <p className="text-text-secondary leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedId === exp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 border-t border-dark-200 space-y-6">
                              {/* Responsibilities */}
                              <div>
                                <h4 className="font-display font-bold text-lg text-text-primary mb-3">
                                  Key Responsibilities
                                </h4>
                                <ul className="space-y-2">
                                  {exp.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex items-start gap-2 text-text-secondary">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cool mt-2 flex-shrink-0" />
                                      <span>{resp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Achievements */}
                              <div>
                                <h4 className="font-display font-bold text-lg text-text-primary mb-3 flex items-center gap-2">
                                  <Award className="w-5 h-5 text-accent-gold" />
                                  Key Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {exp.achievements.map((achievement, i) => (
                                    <li key={i} className="flex items-start gap-2 text-text-secondary">
                                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-2 flex-shrink-0" />
                                      <span>{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Technologies */}
                              <div>
                                <h4 className="font-display font-bold text-lg text-text-primary mb-3">
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {exp.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-3 py-1.5 glass-modern text-sm font-medium text-text-primary rounded-lg"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}