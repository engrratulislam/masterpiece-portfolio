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

export interface Skill {
  name: string
  level: number
  icon: string
  category: 'frontend' | 'backend' | 'design' | 'tools'
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
  logo?: string
  technologies: string[]
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  avatar?: string
  rating: number
  text: string
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

