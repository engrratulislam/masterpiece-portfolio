'use client'

import { useState, useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import MagneticHover from '@/components/animations/MagneticHover'

interface Skill {
  id: number
  name: string
  level: number
  icon: string
  category: string
  color: string
}

interface SkillCategory {
  id: string
  title: string
  description: string
  icon: string
  skills: Skill[]
}

interface SkillCategoryData {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  displayOrder: number
  isActive: boolean
}

interface SkillsSection {
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('frontend')
  const [skills, setSkills] = useState<Skill[]>([])
  const [categoryData, setCategoryData] = useState<SkillCategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionData, setSectionData] = useState<SkillsSection>({
    sectionBadge: 'What I Do Best',
    sectionTitle: 'Skills & Expertise',
    sectionDescription: 'Technologies and tools I use to bring ideas to life',
    stat1Value: '16+',
    stat1Label: 'Technologies Mastered',
    stat2Value: '85%',
    stat2Label: 'Average Proficiency',
    stat3Value: '5+',
    stat3Label: 'Years Learning',
  })

  useEffect(() => {
    fetchSkills()
    fetchCategories()
    fetchSection()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (response.ok) {
        const data = await response.json()
        setSkills(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/skill-categories')
      if (response.ok) {
        const data = await response.json()
        setCategoryData(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/skills-section')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data.data)
      }
    } catch (error) {
      console.error('Error fetching section:', error)
      // Keep default values on error
    }
  }

  const categoryMap: Record<string, { title: string; description: string; icon: string }> = {
    frontend: { title: 'Frontend Development', description: 'Building beautiful and responsive user interfaces', icon: '🎨' },
    backend: { title: 'Backend Development', description: 'Creating robust and scalable server-side applications', icon: '⚙️' },
    design: { title: 'Design & UX', description: 'Crafting intuitive user experiences and interfaces', icon: '✨' },
    tools: { title: 'Tools & DevOps', description: 'Development tools and cloud infrastructure', icon: '🛠️' },
  }

  // Build skill categories from database data
  const skillCategories: SkillCategory[] = categoryData
    .filter(cat => cat.isActive)
    .map(cat => ({
      id: cat.slug,
      title: cat.name,
      description: cat.description || 'No description available',
      icon: cat.icon || '💻',
      skills: skills.filter(s => s.category === cat.slug),
    }))
    .filter(cat => cat.skills.length > 0) // Only show categories with skills

  // Fallback to hardcoded map if no categories from database
  const fallbackCategories: SkillCategory[] = Object.keys(categoryMap).map(key => ({
    id: key,
    ...categoryMap[key],
    skills: skills.filter(s => s.category === key),
  }))

  const activeSkills = (skillCategories.length > 0 ? skillCategories : fallbackCategories).find(cat => cat.id === activeCategory)

  // Auto-select first available category if current selection has no skills
  useEffect(() => {
    const availableCategories = skillCategories.length > 0 ? skillCategories : fallbackCategories
    if (!activeSkills && availableCategories.length > 0) {
      setActiveCategory(availableCategories[0].id)
    }
  }, [skillCategories, fallbackCategories, activeSkills])

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
            {sectionData.sectionBadge}
          </motion.span>
          <h2 className="font-display font-bold text-fluid-4xl lg:text-fluid-5xl text-text-primary mb-4">
            {sectionData.sectionTitle.split(' ')[0]} {sectionData.sectionTitle.includes('&') && '& '}<span className="gradient-text-warm">{sectionData.sectionTitle.split(/[&\s]+/).slice(-1)[0]}</span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-2xl mx-auto">
            {sectionData.sectionDescription}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {(skillCategories.length > 0 ? skillCategories : fallbackCategories).map((category) => (
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
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-glass animate-pulse h-24" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSkills.skills.map((skill, index) => (
                <ScrollReveal key={skill.id} direction="up" delay={index * 0.05}>
                  <div className="card-glass group hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Display icon as emoji or image */}
                        {skill.icon ? (
                          skill.icon.startsWith('/') ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                // Fallback to a default icon if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-3xl">{skill.icon}</div>
                          )
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center bg-gradient-warm rounded-lg text-white font-bold">
                            {skill.name.charAt(0)}
                          </div>
                        )}
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
                    <div className="relative w-full h-2 bg-text-secondary/20 rounded-full overflow-hidden">
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
            )}
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { value: sectionData.stat1Value, label: sectionData.stat1Label },
            { value: sectionData.stat2Value, label: sectionData.stat2Label },
            { value: sectionData.stat3Value, label: sectionData.stat3Label },
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