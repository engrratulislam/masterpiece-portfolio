import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import MobileMenuButton from '@/components/layout/MobileMenuButton'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/animations/SmoothScroll'
import ScrollProgress from '@/components/animations/ScrollProgress'
import StructuredData from '@/components/common/StructuredData'
import { WebVitals } from './web-vitals'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { MainContent } from '@/components/layout/MainContent'

// Optimized Font Loading (14.3)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})


const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
  preload: false, // Only load when needed
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  title: {
    default: 'Engr. Ratul - Full Stack Developer Portfolio',
    template: '%s | Engr. Ratul',
  },
  description: 'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies. 3+ years of experience building scalable web applications.',
  keywords: ['Full Stack Developer', 'Web Developer', 'React', 'Next.js', 'Node.js', 'PHP', 'Laravel', 'JavaScript', 'TypeScript', 'Engr. Ratul', 'Portfolio', 'Kushtia Bangladesh'],
  authors: [{ name: 'Engr. Ratul', url: 'https://github.com/engrratulislam' }],
  creator: 'Engr. Ratul',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Engr. Ratul - Full Stack Developer Portfolio',
    description: 'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Engr. Ratul Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Engr. Ratul - Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engr. Ratul - Full Stack Developer Portfolio',
    description: 'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  var html = document.documentElement;
                  html.classList.add(theme);
                  html.style.colorScheme = theme;
                } catch (e) {
                  // Fallback to light theme if there's an error
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
        <StructuredData />
      </head>
      <body className="bg-secondary text-text-primary font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <WebVitals />
          <ScrollProgress />
          <SmoothScroll>
            <Sidebar />
            <MobileMenuButton />
            <MainContent>{children}</MainContent>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
