# OG Image Generation Guide

## Overview
Open Graph (OG) images are displayed when your portfolio is shared on social media platforms like Facebook, Twitter, LinkedIn, etc.

## Requirements
- **Size:** 1200x630 pixels (recommended)
- **Format:** JPG or PNG
- **File size:** < 1MB for faster loading
- **Location:** `/public/og-image.jpg`

## Option 1: Create Manually (Recommended for Quick Start)

### Using Canva (Free)
1. Go to [Canva.com](https://www.canva.com)
2. Create a custom size: 1200 x 630 px
3. Design your image with:
   - Your name/brand
   - Title: "Full Stack Developer"
   - Tech stack icons (React, Next.js, Node.js, etc.)
   - Professional background
   - Your photo (optional)
4. Download as JPG
5. Save to `/public/og-image.jpg`

### Using Figma (Free)
1. Create a new frame: 1200 x 630 px
2. Design your OG image
3. Export as JPG or PNG
4. Save to `/public/og-image.jpg`

## Option 2: Use Next.js Dynamic OG Image Generation

Next.js 14+ supports dynamic OG image generation using the `ImageResponse` API.

### Create OG Image Route

**File: `src/app/api/og/route.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(to bottom right, #0ea5e9, #8b5cf6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            Engr. Ratul
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#e0f2fe',
              marginBottom: '40px',
            }}
          >
            Full Stack Developer
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '24px',
              color: '#bae6fd',
            }}
          >
            <span>React</span>
            <span>•</span>
            <span>Next.js</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>PHP</span>
            <span>•</span>
            <span>Laravel</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

Then update your metadata to use this dynamic image:

```tsx
// In src/app/layout.tsx
openGraph: {
  images: [
    {
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'Engr. Ratul - Full Stack Developer',
    },
  ],
}
```

## Option 3: Use Online Tools

### Free OG Image Generators
1. **[OG Image Playground](https://og-playground.vercel.app/)** - Vercel's official tool
2. **[Social Image Generator](https://www.bannerbear.com/tools/social-image-generator/)** - Free online tool
3. **[Meta Tags](https://metatags.io/)** - Preview and generate OG images

## Testing Your OG Image

### Test Tools
1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
4. **Meta Tags Checker:** https://metatags.io/

### Steps to Test
1. Deploy your site or use a local tunnel (ngrok)
2. Enter your URL in the testing tool
3. Check if the OG image displays correctly
4. Verify image dimensions and content

## Current Status

- [ ] OG image created
- [ ] OG image saved to `/public/og-image.jpg`
- [ ] Metadata updated in `layout.tsx`
- [ ] Tested on Facebook Debugger
- [ ] Tested on Twitter Card Validator
- [ ] Tested on LinkedIn Post Inspector

## Quick Action

**For immediate deployment:**
1. Create a simple OG image using Canva (5 minutes)
2. Save as `/public/og-image.jpg`
3. The metadata is already configured in `layout.tsx`
4. Test after deployment

**For dynamic generation:**
1. Create the API route as shown above
2. Update metadata to use `/api/og`
3. Test locally and after deployment

