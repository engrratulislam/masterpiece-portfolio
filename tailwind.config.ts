import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'accent-warm': 'var(--color-accent-warm)',
        'accent-cool': 'var(--color-accent-cool)',
        'accent-gold': 'var(--color-accent-gold)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'surface-light': 'var(--color-surface-light)',
        'surface-dark': 'var(--color-surface-dark)',
        'gradient-start': 'var(--color-gradient-start)',
        'gradient-end': 'var(--color-gradient-end)',
        dark: {
          50: 'var(--color-dark-50)',
          100: 'var(--color-dark-100)',
          200: 'var(--color-dark-200)',
          300: 'var(--color-dark-300)',
          400: 'var(--color-dark-400)',
          500: 'var(--color-dark-500)',
          600: 'var(--color-dark-600)',
          700: 'var(--color-dark-700)',
          800: 'var(--color-dark-800)',
          900: 'var(--color-dark-900)',
        },
        warm: {
          50: 'var(--color-warm-50)',
          100: 'var(--color-warm-100)',
          500: 'var(--color-warm-500)',
          600: 'var(--color-warm-600)',
          700: 'var(--color-warm-700)',
        },
        cool: {
          50: 'var(--color-cool-50)',
          100: 'var(--color-cool-100)',
          500: 'var(--color-cool-500)',
          600: 'var(--color-cool-600)',
          700: 'var(--color-cool-700)',
        },
        gold: {
          50: 'var(--color-gold-50)',
          100: 'var(--color-gold-100)',
          500: 'var(--color-gold-500)',
          600: 'var(--color-gold-600)',
          700: 'var(--color-gold-700)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'bento-hover': 'bentoHover 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bentoHover: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-8px) scale(1.02)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
      gridTemplateRows: {
        'bento': 'repeat(auto-fit, minmax(200px, auto))',
      },
      gridAutoRows: {
        'bento': 'minmax(200px, auto)',
      },
    },
  },
  plugins: [],
}

export default config

