# Parallax Components

Professional parallax scrolling system for Next.js portfolios.

## 🚀 Quick Start

```tsx
import { ParallaxContainer, ParallaxLayer } from '@/components/parallax'

export default function Page() {
  return (
    <ParallaxContainer>
      <ParallaxLayer speed={0.5}>
        <h1>Hello Parallax!</h1>
      </ParallaxLayer>
    </ParallaxContainer>
  )
}
```

## 📦 Components

### ParallaxContainer
Enables smooth scrolling for the entire page.

```tsx
<ParallaxContainer>
  {/* Your content */}
</ParallaxContainer>
```

### ParallaxLayer
Creates parallax effect on elements.

```tsx
<ParallaxLayer 
  speed={0.5}           // 0.1 (slow) to 1.0 (fast)
  direction="up"        // "up" or "down"
  scale={false}         // Enable scale effect
  rotate={false}        // Enable rotation
  opacity={false}       // Enable fade effect
  className="..."
>
  {/* Your content */}
</ParallaxLayer>
```

### ParallaxSection
Full-screen section with fade-in animation.

```tsx
<ParallaxSection 
  id="about"
  className="..."
  background="linear-gradient(...)"
>
  {/* Section content */}
</ParallaxSection>
```

### ParallaxHero
Pre-built hero section with multi-layer parallax.

```tsx
<ParallaxHero />
```

### ParallaxText
Animated text with parallax.

```tsx
<ParallaxText
  speed={0.4}
  splitBy="words"       // "words", "chars", or "lines"
  stagger={0.05}        // Delay between animations
>
  Your text here
</ParallaxText>
```

### ParallaxNav
Navigation for demo pages.

```tsx
<ParallaxNav />
```

## 🎯 Examples

### Basic Parallax
```tsx
<ParallaxLayer speed={0.3}>
  <h1>Slow moving title</h1>
</ParallaxLayer>
```

### Multi-Layer
```tsx
<div className="relative">
  <ParallaxLayer speed={0.1} className="absolute">
    <Background />
  </ParallaxLayer>
  <ParallaxLayer speed={0.5}>
    <Content />
  </ParallaxLayer>
</div>
```

### With Effects
```tsx
<ParallaxLayer speed={0.5} scale rotate opacity>
  <Card />
</ParallaxLayer>
```

## 📚 Documentation

- **Quick Start**: `/PARALLAX-QUICKSTART.md`
- **Full Guide**: `/docs/parallax-implementation.md`
- **Speed Guide**: `/docs/parallax-speed-guide.md`
- **Examples**: `/docs/parallax-examples.md`

## 🎬 Demo Pages

- `/parallax-demo` - All effects showcase
- `/parallax-portfolio` - Full portfolio example
- `/parallax-advanced` - Advanced techniques

## 🎨 Speed Reference

| Speed | Use Case |
|-------|----------|
| 0.1-0.2 | Backgrounds |
| 0.3-0.4 | Decorative elements |
| 0.5-0.6 | Main content |
| 0.7-0.8 | Foreground |
| 0.9-1.0 | UI overlays |

## 💡 Tips

1. Use 3-5 layers per section
2. Keep speed differences at least 0.2 apart
3. Test on mobile devices
4. Start subtle, increase gradually

## 🔧 Tech Stack

- **Lenis** - Smooth scrolling
- **GSAP** - Animations
- **ScrollTrigger** - Scroll detection
- **Next.js** - Framework
- **TypeScript** - Type safety

## 📱 Browser Support

✅ Chrome/Edge
✅ Firefox
✅ Safari
✅ Mobile browsers

## 🎉 That's It!

You're ready to create amazing parallax effects!
