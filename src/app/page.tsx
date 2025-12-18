import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import MagneticCursor from '@/components/animations/MagneticCursor'

export default function Home() {
  return (
    <>
      <MagneticCursor />
      <div className="min-h-screen">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Testimonials />
        <Contact />
      </div>
    </>
  )
}
