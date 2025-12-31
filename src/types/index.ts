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

// ========================
// Database Models
// ========================

export interface User {
  id: number
  email: string
  password_hash: string
  name: string | null
  role: string
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: number
  sessionToken: string
  expiresAt: Date
  createdAt: Date
}

export interface RateLimit {
  id: number
  identifier: string
  attempts: number
  lastAttempt: Date
  lockedUntil: Date | null
  createdAt: Date
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  readAt: Date | null
  createdAt: Date
}

export interface ProjectDB {
  id: number
  title: string
  description: string
  longDescription: string | null
  image: string | null
  category: 'web' | 'mobile' | 'design' | '3d'
  tags: string // JSON string
  liveUrl: string | null
  githubUrl: string | null
  featured: boolean
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ProjectImage {
  id: number
  projectId: number
  imageUrl: string
  displayOrder: number
  createdAt: Date
}

export interface SkillDB {
  id: number
  name: string
  level: number
  icon: string | null
  category: 'frontend' | 'backend' | 'design' | 'tools'
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  duration: string
  description: string
  logo: string | null
  technologies: string // JSON string
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface TestimonialDB {
  id: number
  name: string
  position: string
  company: string
  avatar: string | null
  rating: number
  text: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MediaFile {
  id: number
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  alt: string | null
  category: 'image' | 'document' | 'video' | 'other'
  uploadedAt: Date
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  totalProjects: number
  totalSkills: number
  totalExperience: number
  totalMessages: number
  unreadMessages: number
}

