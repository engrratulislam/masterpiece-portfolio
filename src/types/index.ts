export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  images: string[]
  category: string // Changed from union type to string for custom categories
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
  category: string // Changed from union type to string for custom categories
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
  category: string // Changed from union type to string for custom categories
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

export interface HeroSection {
  id: number
  badge: string
  name: string
  title: string
  description: string
  cvUrl: string | null
  profileImage: string | null
  yearsExperience: string
  projectsCompleted: string
  satisfactionRate: string
  // Tech Stack Fields
  tech1: string | null
  tech2: string | null
  tech3: string | null
  tech4: string | null
  tech5: string | null
  tech6: string | null
  tech7: string | null
  tech8: string | null
  tech9: string | null
  isActive: boolean
  updatedAt: Date
}

export interface AboutSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string | null
  profileImage: string | null
  heading: string | null
  paragraph1: string
  paragraph2: string | null
  paragraph3: string | null
  cvUrl: string | null
  yearsExperience: string
  projectsCompleted: string
  clientSatisfaction: string
  isActive: boolean
  updatedAt: Date
}

export interface FooterSection {
  id: number
  brandName: string
  brandDescription: string
  quickLinksTitle: string
  // Quick Links (Individual Fields)
  quickLink1Name: string | null
  quickLink1Href: string | null
  quickLink2Name: string | null
  quickLink2Href: string | null
  quickLink3Name: string | null
  quickLink3Href: string | null
  quickLink4Name: string | null
  quickLink4Href: string | null
  socialTitle: string
  // Social Links (Synced with Sidebar)
  githubUrl: string | null
  linkedinUrl: string | null
  emailAddress: string | null
  copyrightText: string
  footerNote: string | null
  isActive: boolean
  updatedAt: Date
}

export interface ContactSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string | null
  contactInfoTitle: string
  contactInfoDescription: string | null
  email: string
  phone: string | null
  location: string | null
  socialTitle: string
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  facebookUrl: string | null
  isActive: boolean
  updatedAt: Date
}

export interface ProjectsSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
  isActive: boolean
  updatedAt: Date
}

export interface SkillsSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
  isActive: boolean
  updatedAt: Date
}

export interface ExperienceSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
  isActive: boolean
  updatedAt: Date
}

export interface TestimonialsSection {
  id: number
  sectionBadge: string
  sectionTitle: string
  sectionDescription: string
  isActive: boolean
  updatedAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SkillCategory {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
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
  totalMedia: number
}

