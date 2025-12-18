import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string
}

/**
 * Optimized Image Component (14.1)
 * - Lazy loading by default
 * - Blur placeholder
 * - Loading state
 * - Error handling with fallback
 */
export default function OptimizedImage({
  src,
  alt,
  fallback = '/images/placeholder.jpg',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <Image
        src={error ? fallback : src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        loading="lazy"
        quality={85}
        {...props}
      />
    </div>
  )
}

