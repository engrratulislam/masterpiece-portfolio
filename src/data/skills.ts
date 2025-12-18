export interface Skill {
  name: string
  level: number // 0-100
  icon: string
  color: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools'
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  icon: string
  skills: Skill[]
}

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 90, icon: '⚛️', color: 'from-cyan-500 to-blue-500', category: 'frontend' },
  { name: 'Next.js', level: 85, icon: '▲', color: 'from-gray-700 to-gray-900', category: 'frontend' },
  { name: 'JavaScript', level: 90, icon: 'JS', color: 'from-yellow-400 to-yellow-600', category: 'frontend' },
  { name: 'TypeScript', level: 85, icon: 'TS', color: 'from-blue-600 to-blue-700', category: 'frontend' },
  { name: 'Tailwind CSS', level: 90, icon: '🎨', color: 'from-cyan-400 to-blue-500', category: 'frontend' },
  { name: 'Three.js', level: 70, icon: '🎮', color: 'from-purple-500 to-pink-500', category: 'frontend' },
  { name: 'HTML5', level: 95, icon: '🌐', color: 'from-orange-500 to-red-500', category: 'frontend' },
  { name: 'CSS3', level: 90, icon: '🎨', color: 'from-blue-500 to-purple-500', category: 'frontend' },

  // Backend
  { name: 'Node.js', level: 85, icon: '🟢', color: 'from-green-600 to-green-700', category: 'backend' },
  { name: 'Express.js', level: 85, icon: '⚡', color: 'from-gray-600 to-gray-800', category: 'backend' },
  { name: 'PHP', level: 80, icon: '🐘', color: 'from-indigo-500 to-purple-600', category: 'backend' },
  { name: 'Laravel', level: 80, icon: '🔴', color: 'from-red-500 to-red-700', category: 'backend' },
  { name: 'REST API', level: 90, icon: '🔌', color: 'from-green-500 to-teal-500', category: 'backend' },

  // Database
  { name: 'MongoDB', level: 85, icon: '🍃', color: 'from-green-500 to-green-600', category: 'database' },
  { name: 'MySQL', level: 85, icon: '🐬', color: 'from-blue-500 to-cyan-600', category: 'database' },
  { name: 'Redis', level: 70, icon: '⚡', color: 'from-red-500 to-orange-500', category: 'database' },

  // DevOps
  { name: 'Docker', level: 75, icon: '🐳', color: 'from-blue-500 to-cyan-500', category: 'devops' },
  { name: 'AWS', level: 70, icon: '☁️', color: 'from-orange-500 to-yellow-500', category: 'devops' },
  { name: 'Git', level: 90, icon: '📦', color: 'from-orange-600 to-red-600', category: 'devops' },
  { name: 'CI/CD', level: 70, icon: '🔄', color: 'from-green-500 to-blue-500', category: 'devops' },

  // Tools
  { name: 'VS Code', level: 95, icon: '💻', color: 'from-blue-500 to-blue-600', category: 'tools' },
  { name: 'Figma', level: 75, icon: '🎨', color: 'from-purple-500 to-pink-500', category: 'tools' },
  { name: 'Postman', level: 85, icon: '📮', color: 'from-orange-500 to-red-500', category: 'tools' },
  { name: 'Webpack', level: 70, icon: '📦', color: 'from-blue-400 to-cyan-500', category: 'tools' },
  { name: 'NPM', level: 90, icon: '📦', color: 'from-red-600 to-red-700', category: 'tools' },
]

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Building beautiful and responsive user interfaces',
    icon: '🎨',
    skills: skills.filter(s => s.category === 'frontend'),
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Creating robust and scalable server-side applications',
    icon: '⚙️',
    skills: skills.filter(s => s.category === 'backend'),
  },
  {
    id: 'database',
    title: 'Database & Storage',
    description: 'Designing and optimizing database systems',
    icon: '💾',
    skills: skills.filter(s => s.category === 'database'),
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    description: 'Deploying and managing applications in the cloud',
    icon: '☁️',
    skills: skills.filter(s => s.category === 'devops'),
  },
  {
    id: 'tools',
    title: 'Tools & Software',
    description: 'Development tools and productivity software',
    icon: '🛠️',
    skills: skills.filter(s => s.category === 'tools'),
  },
]

// Helper functions
export const getSkillsByCategory = (category: Skill['category']) =>
  skills.filter(s => s.category === category)

export const getTopSkills = (count: number = 6) =>
  [...skills].sort((a, b) => b.level - a.level).slice(0, count)

export const getSkillByName = (name: string) =>
  skills.find(s => s.name.toLowerCase() === name.toLowerCase())

