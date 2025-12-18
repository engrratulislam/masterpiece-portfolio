/**
 * StructuredData Component
 * 
 * Adds JSON-LD structured data for better SEO.
 * Helps search engines understand the content and context of the page.
 * 
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Engr. Ratul',
    alternateName: 'Ratul Islam',
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    sameAs: [
      'https://github.com/engrratulislam',
      'https://linkedin.com/in/engrratulislam',
      'https://twitter.com/engrratulislam',
    ],
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'Node.js',
      'PHP',
      'Laravel',
      'JavaScript',
      'TypeScript',
      'Full Stack Development',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kushtia',
      addressCountry: 'Bangladesh',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Engr. Ratul Portfolio',
    url: baseUrl,
    description:
      'Full Stack Developer specializing in React, Next.js, Node.js, PHP, Laravel, and modern web technologies.',
    author: {
      '@type': 'Person',
      name: 'Engr. Ratul',
    },
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Engr. Ratul',
      description:
        'Full Stack Developer with 3+ years of experience building scalable web applications.',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  )
}

