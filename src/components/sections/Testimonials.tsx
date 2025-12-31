'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials, getAverageRating, getTotalTestimonials } from '@/data/testimonials'
import Parallax from '@/components/parallax/Parallax'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section id="testimonials" className="relative py-20 md:py-32 bg-secondary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Parallax speed={-0.33} className="absolute inset-0">
          <div className="absolute top-1/4 -right-48 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        </Parallax>
        <Parallax speed={-0.27} className="absolute inset-0">
          <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </Parallax>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 glass-modern rounded-full text-sm font-semibold text-text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Client Feedback
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 text-text-primary">
            What Clients <span className="gradient-text-primary">Say</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Don't just take my word for it - hear from some of the clients I've worked with
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
          <div className="max-w-5xl mx-auto">
          <div className="relative min-h-[500px] md:min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="card-elevated relative">
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote className="w-24 h-24 text-accent-cool" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Client Info */}
                    <div className="flex items-center gap-6 mb-6">
                      {/* Client Image */}
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-accent-cool/30 flex-shrink-0">
                        <Image
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Client Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1 text-text-primary">{currentTestimonial.name}</h3>
                        <p className="text-text-secondary">
                          {currentTestimonial.position} at {currentTestimonial.company}
                        </p>
                        {currentTestimonial.projectType && (
                          <p className="text-sm text-accent-cool mt-1">
                            Project: {currentTestimonial.projectType}
                          </p>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="hidden md:flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < currentTestimonial.rating
                                ? 'fill-accent-gold text-accent-gold'
                                : 'text-text-secondary/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Rating Stars (Mobile) */}
                    <div className="flex gap-1 mb-6 md:hidden">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < currentTestimonial.rating
                              ? 'fill-accent-gold text-accent-gold'
                              : 'text-text-secondary/40'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-text-primary text-lg leading-relaxed mb-6">
                      "{currentTestimonial.text}"
                    </p>

                    {/* Date */}
                    <p className="text-sm text-text-secondary">
                      {new Date(currentTestimonial.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 glass-modern rounded-full flex items-center justify-center hover:bg-accent-cool/20 hover:border-accent-cool transition-all group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-text-secondary group-hover:text-text-primary" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 glass-modern rounded-full flex items-center justify-center hover:bg-accent-cool/20 hover:border-accent-cool transition-all group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-text-primary" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent-cool w-8'
                    : 'bg-text-secondary/30 hover:bg-text-secondary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Average Rating */}
          <motion.div
            className="card-glass text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 fill-accent-gold text-accent-gold" />
              <div className="text-5xl font-bold gradient-text-warm">
                {getAverageRating()}
              </div>
            </div>
            <div className="text-text-secondary">Average Rating</div>
          </motion.div>

          {/* Total Testimonials */}
          <motion.div
            className="card-glass text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-5xl font-bold gradient-text-primary mb-2">
              {getTotalTestimonials()}
            </div>
            <div className="text-text-secondary">Happy Clients</div>
          </motion.div>

          {/* Satisfaction Rate */}
          <motion.div
            className="card-glass text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-5xl font-bold gradient-text-cool mb-2">
              100%
            </div>
            <div className="text-text-secondary">Satisfaction Rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

