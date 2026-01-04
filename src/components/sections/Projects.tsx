'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Github, X, ArrowUpRight, Calendar } from 'lucide-react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import MagneticHover from '@/components/animations/MagneticHover'

interface Project {
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

interface ProjectsSection {
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
}

export default function Projects() {
  const [filter, setFilter] = useState<'all' | Project['category']>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionData, setSectionData] = useState<ProjectsSection>({
    sectionBadge: 'My Work',
    sectionTitle: 'Featured Projects',
    sectionDescription: 'Showcasing my best work in web development and creative coding',
  })

  useEffect(() => {
    fetchProjects()
    fetchSection()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/projects-section')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data.data)
      }
    } catch (error) {
      console.error('Error fetching section:', error)
      // Keep default values on error
    }
  }

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web Apps' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'backend', label: 'Backend' },
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  // Professional Bento Grid Layout System - Clean and Balanced
  const getBentoGridClass = (index: number) => {
    // Professional Bento Grid pattern inspired by modern design systems
    // Creates a balanced, visually appealing layout with no awkward gaps
    
    const total = filteredProjects.length
    
    // First featured project gets prominent hero placement
    if (index === 0 && filteredProjects[0]?.featured) {
      return 'col-span-1 sm:col-span-2 row-span-2'
    }

    // Carefully designed pattern for professional appearance
    // This creates visual rhythm and balance
    const adjustedIndex = filteredProjects[0]?.featured ? index - 1 : index
    
    // Pattern creates: Regular, Tall, Regular, Regular, Tall, Regular...
    // This ensures even distribution and no awkward gaps
    const pattern = adjustedIndex % 6
    
    switch (pattern) {
      case 0: return 'col-span-1 row-span-1'  // Regular
      case 1: return 'col-span-1 row-span-2'  // Tall
      case 2: return 'col-span-1 row-span-1'  // Regular
      case 3: return 'col-span-1 row-span-1'  // Regular
      case 4: return 'col-span-1 row-span-2'  // Tall
      case 5: return 'col-span-1 row-span-1'  // Regular
      default: return 'col-span-1 row-span-1'
    }
  }

  return (
    <section id="projects" className="relative py-24 lg:py-32 bg-secondary overflow-hidden">
      {/* Background Elements */}
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
            {sectionData.sectionTitle.split(' ')[0]} <span className="gradient-text-primary">{sectionData.sectionTitle.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-2xl mx-auto">
            {sectionData.sectionDescription}
          </p>
        </div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <MagneticHover key={category.value} strength={8}>
              <button
                onClick={() => setFilter(category.value as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === category.value
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'glass-modern text-text-primary hover:scale-105'
                }`}
              >
                {category.label}
              </button>
            </MagneticHover>
          ))}
        </motion.div>

        {/* Professional Bento Grid Layout - Clean and Balanced */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card-glass animate-pulse h-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={getBentoGridClass(index)}
                >
                  <BentoProjectCard 
                    project={project} 
                    index={index}
                    isLarge={index === 0 && project.featured}
                    onClick={() => setSelectedProject(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-text-secondary text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// Professional Bento Project Card Component
function BentoProjectCard({ 
  project, 
  index, 
  isLarge, 
  onClick 
}: { 
  project: Project
  index: number
  isLarge: boolean
  onClick: () => void 
}) {
  return (
    <motion.div 
      className="group relative h-full w-full rounded-3xl overflow-hidden cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 4}
        />
        {/* Gradient Overlay - Stronger for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5 lg:p-7 text-white">
        {/* Top Section - Badges */}
        <div className="flex items-start justify-between gap-2">
          {/* Category Badge */}
          <span className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20 shadow-lg">
            {project.category}
          </span>
          
          {/* Featured Badge */}
          {project.featured && (
            <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Bottom Section - Main Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className={`font-display font-bold text-white leading-tight ${
            isLarge ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
          }`}>
            {project.title}
          </h3>

          {/* Description - Only show on larger cards */}
          {isLarge && (
            <p className="text-white/85 text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, isLarge ? 4 : 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-lg border border-white/10"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > (isLarge ? 4 : 3) && (
              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-lg border border-white/10">
                +{project.tags.length - (isLarge ? 4 : 3)}
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl">
          <ArrowUpRight className="w-6 h-6 text-gray-900" />
        </div>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 glass-modern rounded-full hover:scale-110 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-4xl text-text-primary mb-3">
                {project.title}
              </h3>
              <span className="inline-block px-4 py-2 glass-modern text-accent-cool text-sm font-semibold rounded-full">
                {project.category}
              </span>
            </div>
          </div>

          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            {project.longDescription}
          </p>

          {/* Technologies */}
          <div className="mb-8">
            <h4 className="font-display font-bold text-xl text-text-primary mb-4">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 glass-modern text-text-primary rounded-xl font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <MagneticHover strength={10}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Live Demo
                </a>
              </MagneticHover>
            )}
            {project.githubUrl && (
              <MagneticHover strength={10}>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 glass-modern border-2 border-dark-300 font-semibold rounded-xl hover:border-accent-cool transition-all"
                >
                  <Github className="w-5 h-5" />
                  View Source Code
                </a>
              </MagneticHover>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}