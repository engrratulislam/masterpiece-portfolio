'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log Web Vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }
    
    // Send to analytics in production
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
    
    // Example: Send to Vercel Analytics
    // if (window.va) {
    //   window.va('event', {
    //     name: metric.name,
    //     data: {
    //       value: metric.value,
    //       rating: metric.rating,
    //     },
    //   })
    // }
  })

  return null
}

