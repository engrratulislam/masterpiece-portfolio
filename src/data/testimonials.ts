export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  image: string
  rating: number // 1-5
  text: string
  date: string
  projectType?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'TechStart Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Working with Ratul was an absolute pleasure. He delivered our e-commerce platform ahead of schedule and exceeded all our expectations. His attention to detail and technical expertise is outstanding. The platform has increased our sales by 150% in just 3 months!',
    date: '2024-01',
    projectType: 'E-Commerce Platform',
  },
  {
    id: 'testimonial-2',
    name: 'Michael Chen',
    position: 'Product Manager',
    company: 'Digital Solutions Ltd.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Ratul is a highly skilled developer who brings both technical excellence and creative problem-solving to every project. He transformed our outdated website into a modern, responsive application that our users love. Communication was excellent throughout the project.',
    date: '2023-11',
    projectType: 'Web Application',
  },
  {
    id: 'testimonial-3',
    name: 'Emily Rodriguez',
    position: 'Founder',
    company: 'Creative Agency Pro',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 5,
    text: 'I have worked with many developers, but Ratul stands out for his professionalism and dedication. He built our portfolio website with stunning animations and 3D effects that truly showcase our work. Our client inquiries have tripled since the launch!',
    date: '2023-09',
    projectType: 'Portfolio Website',
  },
  {
    id: 'testimonial-4',
    name: 'David Thompson',
    position: 'CTO',
    company: 'FinTech Innovations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Ratul developed a complex dashboard for our financial platform with real-time data visualization. His code is clean, well-documented, and maintainable. He also provided excellent post-launch support. Highly recommended for any serious project!',
    date: '2023-07',
    projectType: 'Dashboard Application',
  },
  {
    id: 'testimonial-5',
    name: 'Lisa Anderson',
    position: 'Marketing Director',
    company: 'GrowthHub',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    rating: 5,
    text: 'The landing pages Ratul created for our marketing campaigns have significantly improved our conversion rates. His understanding of both design and development resulted in pages that are not only beautiful but also highly effective. A true professional!',
    date: '2023-05',
    projectType: 'Landing Pages',
  },
  {
    id: 'testimonial-6',
    name: 'James Wilson',
    position: 'Owner',
    company: 'Restaurant Delights',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Ratul built our restaurant website with online ordering system. The interface is intuitive and our customers love it. Online orders have increased by 200% and the system runs flawlessly. Best investment we made for our business!',
    date: '2023-03',
    projectType: 'Restaurant Website',
  },
  {
    id: 'testimonial-7',
    name: 'Amanda Foster',
    position: 'HR Manager',
    company: 'TalentConnect',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    rating: 5,
    text: 'We hired Ratul to build our job portal platform and he delivered beyond expectations. The platform is fast, secure, and user-friendly. His expertise in both frontend and backend development was evident throughout the project.',
    date: '2023-01',
    projectType: 'Job Portal',
  },
  {
    id: 'testimonial-8',
    name: 'Robert Martinez',
    position: 'Founder',
    company: 'EduLearn Platform',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    rating: 5,
    text: 'Ratul developed our online learning platform with video streaming, quizzes, and progress tracking. The platform is robust and handles thousands of concurrent users without any issues. His technical skills are top-notch!',
    date: '2022-10',
    projectType: 'Learning Platform',
  },
]

// Helper functions
export const getAverageRating = () => {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0)
  return (total / testimonials.length).toFixed(1)
}

export const getTotalTestimonials = () => testimonials.length

export const getRecentTestimonials = (count: number = 3) =>
  [...testimonials]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)

export const getTestimonialsByRating = (rating: number) =>
  testimonials.filter(t => t.rating === rating)

export const getFiveStarTestimonials = () =>
  testimonials.filter(t => t.rating === 5)

