/**
 * Performance Monitoring Utilities (14.4)
 */

// Report Web Vitals to analytics
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Log to console in development
    console.log(metric)
    
    // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
    // Example: window.gtag?.('event', metric.name, { value: metric.value })
  }
}

// Measure component render time
export function measureRender(componentName: string, callback: () => void) {
  const start = performance.now()
  callback()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} rendered in ${(end - start).toFixed(2)}ms`)
  }
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load images when they enter viewport
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement
        const src = image.dataset.src
        if (src) {
          image.src = src
          image.classList.add('loaded')
        }
        observer.unobserve(image)
      }
    })
  })
  
  observer.observe(img)
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

