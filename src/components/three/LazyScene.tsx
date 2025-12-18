'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load the 3D Scene component (14.5 & 14.6)
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-dark-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    </div>
  ),
})

export default function LazyScene() {
  return (
    <Suspense fallback={
      <div className="absolute inset-0 bg-dark-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </div>
    }>
      <Scene />
    </Suspense>
  )
}

