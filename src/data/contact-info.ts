/**
 * Contact Information Configuration
 * 
 * Update this file with your actual contact details.
 * This centralized configuration makes it easy to update contact info across the entire portfolio.
 */

export interface ContactInfo {
  email: string
  phone: string
  location: string
  social: {
    github: string
    linkedin: string
    twitter: string
    facebook: string
  }
}

export const contactInfo: ContactInfo = {
  // Your actual email
  email: 'ratul.innovations@gmail.com',

  // Your phone number (update if you want to display it)
  phone: '+880 1XXX-XXXXXX',

  // Your actual location
  location: 'Kushtia, Bangladesh',

  // Your actual social media profiles
  social: {
    github: 'https://github.com/engrratulislam',
    linkedin: 'https://www.linkedin.com/in/engr-ratulislam/',
    twitter: 'https://twitter.com/yourusername',
    facebook: 'https://facebook.com/yourusername',
  },
}

// Helper function to get mailto link
export const getMailtoLink = () => `mailto:${contactInfo.email}`

// Helper function to get tel link
export const getTelLink = () => `tel:${contactInfo.phone.replace(/\s/g, '')}`

// Helper function to get Google Maps link
export const getMapsLink = () => `https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}`

