export interface Experience {
  id: string
  company: string
  position: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  startDate: string
  endDate: string | 'Present'
  description: string
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  logo?: string
  companyUrl?: string
}

export const experiences: Experience[] = [
  {
    id: 'current-position',
    company: 'Tech Solutions Inc.',
    position: 'Full Stack Developer',
    location: 'Remote',
    type: 'full-time',
    startDate: '2023-06',
    endDate: 'Present',
    description: 'Leading development of modern web applications using React, Next.js, and Node.js. Working with cross-functional teams to deliver high-quality software solutions.',
    responsibilities: [
      'Develop and maintain full-stack web applications using React, Next.js, and Node.js',
      'Design and implement RESTful APIs with Express.js and MongoDB',
      'Collaborate with UI/UX designers to create responsive and intuitive interfaces',
      'Write clean, maintainable code following best practices and coding standards',
      'Participate in code reviews and provide constructive feedback to team members',
      'Optimize application performance and ensure scalability',
    ],
    achievements: [
      'Reduced page load time by 40% through code optimization and lazy loading',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Led migration from JavaScript to TypeScript improving code quality',
      'Mentored 3 junior developers in modern web development practices',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS'],
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop',
    companyUrl: 'https://example.com',
  },
  {
    id: 'previous-position-1',
    company: 'Digital Agency Pro',
    position: 'Frontend Developer',
    location: 'Hybrid',
    type: 'full-time',
    startDate: '2022-01',
    endDate: '2023-05',
    description: 'Developed responsive web applications and landing pages for various clients. Focused on creating pixel-perfect designs and smooth user experiences.',
    responsibilities: [
      'Built responsive websites using React and Tailwind CSS',
      'Converted Figma designs into functional web applications',
      'Implemented animations and transitions using Framer Motion and GSAP',
      'Integrated third-party APIs and services',
      'Ensured cross-browser compatibility and mobile responsiveness',
      'Collaborated with backend developers for API integration',
    ],
    achievements: [
      'Delivered 15+ client projects on time and within budget',
      'Improved website accessibility scores to 95+ on Lighthouse',
      'Created reusable component library reducing development time by 30%',
      'Received "Developer of the Quarter" award for outstanding performance',
    ],
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'GSAP', 'REST API', 'Git'],
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop',
    companyUrl: 'https://example.com',
  },
  {
    id: 'freelance-work',
    company: 'Freelance Developer',
    position: 'Full Stack Developer',
    location: 'Remote',
    type: 'freelance',
    startDate: '2021-06',
    endDate: '2021-12',
    description: 'Worked with multiple clients to build custom web applications and e-commerce solutions. Managed projects from requirements gathering to deployment.',
    responsibilities: [
      'Developed custom web applications based on client requirements',
      'Built e-commerce platforms with payment gateway integration',
      'Created admin dashboards for content management',
      'Provided technical consultation and project estimates',
      'Managed client communications and project timelines',
      'Deployed applications on various hosting platforms',
    ],
    achievements: [
      'Successfully completed 10+ freelance projects with 5-star ratings',
      'Built e-commerce platform generating $50K+ monthly revenue for client',
      'Established long-term relationships with 5 recurring clients',
      'Maintained 100% client satisfaction rate',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'PHP', 'Laravel', 'MySQL'],
    logo: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=200&h=200&fit=crop',
  },
  {
    id: 'first-position',
    company: 'StartUp Ventures',
    position: 'Junior Web Developer',
    location: 'On-site',
    type: 'full-time',
    startDate: '2020-08',
    endDate: '2021-05',
    description: 'Started my professional journey as a junior developer, learning modern web development practices and contributing to various projects.',
    responsibilities: [
      'Assisted senior developers in building web applications',
      'Fixed bugs and implemented minor features',
      'Wrote unit tests for frontend components',
      'Participated in daily stand-ups and sprint planning',
      'Documented code and created technical documentation',
      'Learned and applied new technologies and frameworks',
    ],
    achievements: [
      'Quickly learned React and contributed to production code within 2 months',
      'Reduced bug count by 25% through thorough testing',
      'Completed online certifications in JavaScript and React',
      'Promoted to regular developer role after 6 months',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST API'],
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop',
    companyUrl: 'https://example.com',
  },
]

// Helper functions
export const getCurrentExperience = () =>
  experiences.find(exp => exp.endDate === 'Present')

export const getPastExperiences = () =>
  experiences.filter(exp => exp.endDate !== 'Present')

export const getExperienceByType = (type: Experience['type']) =>
  experiences.filter(exp => exp.type === type)

export const getTotalYearsOfExperience = () => {
  const startYear = 2020 // First job start year
  const currentYear = new Date().getFullYear()
  return currentYear - startYear
}

// Calculate duration for each experience
export const calculateDuration = (startDate: string, endDate: string | 'Present'): string => {
  const start = new Date(startDate)
  const end = endDate === 'Present' ? new Date() : new Date(endDate)
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }
}

// Format date for display
export const formatDate = (date: string | 'Present'): string => {
  if (date === 'Present') return 'Present'
  
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

