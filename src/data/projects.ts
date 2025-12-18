export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  images: string[]
  category: 'web' | 'mobile' | 'fullstack' | 'backend'
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  date: string
}

export const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-featured online shopping platform with payment integration and admin dashboard',
    longDescription: 'Built a comprehensive e-commerce solution with React, Node.js, and Stripe integration. Features include product management, shopping cart, user authentication, order tracking, and admin dashboard with real-time analytics.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
    ],
    category: 'fullstack',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    featured: true,
    date: '2024-03',
  },
  {
    id: 'task-management',
    title: 'Task Management System',
    description: 'Collaborative task management tool with real-time updates and team features',
    longDescription: 'Developed a full-stack task management application using Next.js and Laravel. Features include drag-and-drop task boards, real-time collaboration, file attachments, and team management.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    ],
    category: 'fullstack',
    tags: ['Next.js', 'Laravel', 'MySQL', 'Tailwind CSS', 'WebSocket'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/task-manager',
    featured: true,
    date: '2024-02',
  },
  {
    id: 'restaurant-website',
    title: 'Restaurant Website',
    description: 'Modern restaurant website with online ordering and reservation system',
    longDescription: 'Created a beautiful restaurant website with online menu, ordering system, table reservations, and customer reviews. Built with React and integrated with payment gateway.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    ],
    category: 'web',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/restaurant',
    featured: true,
    date: '2024-01',
  },
  {
    id: 'portfolio-3d',
    title: '3D Portfolio Experience',
    description: 'Interactive 3D portfolio website with Three.js animations',
    longDescription: 'Created an immersive portfolio experience using Three.js and React Three Fiber. Features include 3D models, particle effects, smooth animations, and interactive elements.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'],
    category: 'web',
    tags: ['Three.js', 'React', 'WebGL', 'GSAP', 'Framer Motion'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/3d-portfolio',
    featured: true,
    date: '2023-12',
  },
  {
    id: 'api-gateway',
    title: 'RESTful API Gateway',
    description: 'Scalable API gateway with authentication and rate limiting',
    longDescription: 'Built a robust API gateway using Node.js and Express.js with JWT authentication, rate limiting, request validation, and comprehensive logging. Deployed on AWS with auto-scaling.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'],
    category: 'backend',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'AWS', 'Docker'],
    githubUrl: 'https://github.com/yourusername/api-gateway',
    featured: false,
    date: '2023-11',
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform',
    description: 'Full-featured blogging platform with markdown support',
    longDescription: 'Developed a modern blogging platform with markdown editor, syntax highlighting, comments, tags, and SEO optimization. Built with Next.js and Laravel backend.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    ],
    category: 'fullstack',
    tags: ['Next.js', 'Laravel', 'MySQL', 'Markdown', 'SEO'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/blog',
    featured: false,
    date: '2023-10',
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description: 'Real-time weather dashboard with forecasts and maps',
    longDescription: 'Created a weather dashboard that displays current weather, 7-day forecasts, and interactive maps. Integrated with multiple weather APIs for accurate data.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop'],
    category: 'web',
    tags: ['React', 'TypeScript', 'API Integration', 'Charts.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/weather',
    featured: false,
    date: '2023-09',
  },
  {
    id: 'chat-application',
    title: 'Real-time Chat App',
    description: 'WebSocket-based chat application with rooms and file sharing',
    longDescription: 'Built a real-time chat application using Socket.io with features like private rooms, file sharing, typing indicators, and message history.',
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600&fit=crop'],
    category: 'fullstack',
    tags: ['Node.js', 'Socket.io', 'React', 'MongoDB', 'Express.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/chat',
    featured: false,
    date: '2023-08',
  },
]

// Helper functions
export const getFeaturedProjects = () => projects.filter(p => p.featured)

export const getProjectsByCategory = (category: Project['category']) => 
  projects.filter(p => p.category === category)

export const getProjectById = (id: string) => 
  projects.find(p => p.id === id)

export const getAllCategories = () => 
  Array.from(new Set(projects.map(p => p.category)))

