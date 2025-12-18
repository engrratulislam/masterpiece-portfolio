import { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: {
    default: 'Engr. Ratul - Full Stack Developer Portfolio',
    template: '%s | Engr. Ratul',
  },
  description:
    'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies. 3+ years of experience building scalable web applications.',
  keywords: [
    'Full Stack Developer',
    'Web Developer',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'PHP Developer',
    'Laravel Developer',
    'JavaScript',
    'TypeScript',
    'Engr. Ratul',
    'Ratul Islam',
    'Portfolio',
    'Kushtia Bangladesh',
    'Web Development',
    'Frontend Developer',
    'Backend Developer',
  ],
  authors: [{ name: 'Engr. Ratul', url: 'https://github.com/engrratulislam' }],
  creator: 'Engr. Ratul',
  publisher: 'Engr. Ratul',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://engratul.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://engratul.com', // Update with your actual domain
    title: 'Engr. Ratul - Full Stack Developer Portfolio',
    description:
      'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies. 3+ years of experience building scalable web applications.',
    siteName: 'Engr. Ratul Portfolio',
    images: [
      {
        url: '/images/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Engr. Ratul - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engr. Ratul - Full Stack Developer Portfolio',
    description:
      'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies.',
    creator: '@yourusername', // Update with your Twitter handle
    images: ['/images/og-image.jpg'], // Create this image (1200x630px)
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

