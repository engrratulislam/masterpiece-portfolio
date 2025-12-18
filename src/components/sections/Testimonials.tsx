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
    <section id="testimonials" className="relative py-20 md:py-32 bg-dark-900 overflow-hidden">
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
            className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Client Feedback
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4">
            What Clients <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 md:p-12 relative">
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote className="w-24 h-24 text-primary-500" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Client Info */}
                    <div className="flex items-center gap-6 mb-6">
                      {/* Client Image */}
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary-500/30 flex-shrink-0">
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
                        <h3 className="text-2xl font-bold mb-1">{currentTestimonial.name}</h3>
                        <p className="text-gray-400">
                          {currentTestimonial.position} at {currentTestimonial.company}
                        </p>
                        {currentTestimonial.projectType && (
                          <p className="text-sm text-primary-400 mt-1">
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
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
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
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      "{currentTestimonial.text}"
                    </p>

                    {/* Date */}
                    <p className="text-sm text-gray-500">
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 bg-dark-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 bg-dark-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white" />
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
                    ? 'bg-primary-500 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
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
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {getAverageRating()}
              </div>
            </div>
            <div className="text-gray-400">Average Rating</div>
          </motion.div>

          {/* Total Testimonials */}
          <motion.div
            className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-xl p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent mb-2">
              {getTotalTestimonials()}
            </div>
            <div className="text-gray-400">Happy Clients</div>
          </motion.div>

          {/* Satisfaction Rate */}
          <motion.div
            className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

