import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5C00',
          dark: '#1A1A1A',
          cream: '#FFF3EC',
          success: '#12B76A',
          warning: '#F79009',
          danger: '#F04438',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '100px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 10px 32px rgba(0,0,0,0.14)',
        cta: '0 4px 24px rgba(255,92,0,0.35)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'badge-bounce': 'badgeBounce 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        marquee: 'marquee 30s linear infinite',
        'progress-bar': 'progressBar 1s ease-out forwards',
        'check-draw': 'checkDraw 0.6s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        badgeBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '75%' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
