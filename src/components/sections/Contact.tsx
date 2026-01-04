'use client'

import { useState, useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Facebook, CheckCircle, AlertCircle } from 'lucide-react'
import Parallax from '@/components/parallax/Parallax'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface ContactData {
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
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContactData(data.data)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const contactCards = contactData ? [
    {
      icon: Mail,
      label: 'Email',
      value: contactData.email,
      href: `mailto:${contactData.email}`,
      color: 'from-blue-500 to-cyan-500',
    },
    ...(contactData.phone ? [{
      icon: Phone,
      label: 'Phone',
      value: contactData.phone,
      href: `tel:${contactData.phone.replace(/\s/g, '')}`,
      color: 'from-green-500 to-teal-500',
    }] : []),
    ...(contactData.location ? [{
      icon: MapPin,
      label: 'Location',
      value: contactData.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(contactData.location)}`,
      color: 'from-purple-500 to-pink-500',
    }] : []),
  ] : []

  const socialLinks = contactData ? [
    ...(contactData.githubUrl ? [{ icon: Github, href: contactData.githubUrl, label: 'GitHub', color: 'hover:text-gray-400' }] : []),
    ...(contactData.linkedinUrl ? [{ icon: Linkedin, href: contactData.linkedinUrl, label: 'LinkedIn', color: 'hover:text-blue-400' }] : []),
    ...(contactData.twitterUrl ? [{ icon: Twitter, href: contactData.twitterUrl, label: 'Twitter', color: 'hover:text-sky-400' }] : []),
    ...(contactData.facebookUrl ? [{ icon: Facebook, href: contactData.facebookUrl, label: 'Facebook', color: 'hover:text-blue-500' }] : []),
  ] : []

  return (
    <section id="contact" className="relative py-20 md:py-32 bg-secondary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Parallax speed={-0.36} className="absolute inset-0">
          <div className="absolute top-1/3 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        </Parallax>
        <Parallax speed={-0.31} className="absolute inset-0">
          <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
            {loading ? 'Loading...' : (contactData?.sectionBadge || 'Get In Touch')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 text-text-primary">
            {loading ? 'Loading...' : (contactData?.sectionTitle || "Let's Work")} <span className="gradient-text-primary">Together</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {loading ? 'Loading...' : (contactData?.sectionDescription || "Have a project in mind? Let's discuss how I can help bring your ideas to life")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-text-primary">
                  {loading ? 'Loading...' : (contactData?.contactInfoTitle || 'Contact Information')}
                </h3>
                <p className="text-text-secondary">
                  {loading ? 'Loading...' : (contactData?.contactInfoDescription || 'Feel free to reach out through any of these channels. I\'m always open to discussing new projects and opportunities.')}
                </p>
              </motion.div>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                {contactCards.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.href}
                    target={info.label === 'Location' ? '_blank' : undefined}
                    rel={info.label === 'Location' ? 'noopener noreferrer' : undefined}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 card-modern hover:border-accent-cool/50 transition-all group"
                    whileHover={{ x: 10 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">{info.label}</div>
                      <div className="text-text-primary font-medium group-hover:text-accent-cool transition-colors">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-lg font-semibold mb-4 text-text-primary">
                  {loading ? 'Loading...' : (contactData?.socialTitle || 'Follow Me')}
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-12 h-12 glass-modern rounded-lg flex items-center justify-center text-text-secondary ${social.color} transition-all`}
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-primary">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-surface-light border ${
                      errors.name ? 'border-red-500' : 'border-dark-200'
                    } rounded-lg focus:outline-none focus:border-accent-cool transition-colors text-text-primary`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-surface-light border ${
                      errors.email ? 'border-red-500' : 'border-dark-200'
                    } rounded-lg focus:outline-none focus:border-accent-cool transition-colors text-text-primary`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-text-primary">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-surface-light border ${
                      errors.subject ? 'border-red-500' : 'border-dark-200'
                    } rounded-lg focus:outline-none focus:border-accent-cool transition-colors text-text-primary`}
                    placeholder="Project Inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-text-primary">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-surface-light border ${
                      errors.message ? 'border-red-500' : 'border-dark-200'
                    } rounded-lg focus:outline-none focus:border-accent-cool transition-colors resize-none text-text-primary`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent-cool/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Failed to send message. Please try again.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

