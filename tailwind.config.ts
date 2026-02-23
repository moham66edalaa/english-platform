// 📁 tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        sans:  ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      colors: {
        ink:   { DEFAULT: '#0d0f14', 2: '#1a1e28', 3: '#252c3a' },
        gold:  { DEFAULT: '#c9a84c', light: '#e8cc80', dim: '#7a6230' },
        cream: { DEFAULT: '#f5f0e8', dim: '#d8cebc' },
        muted: '#6b7280',
        'grad-gold': 'linear-gradient(135deg, #c9a84c, #e8cc80, #c9a84c)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float:         'float 4s ease-in-out infinite',
        'float-delay': 'float 4s 2s ease-in-out infinite',
        marquee:       'marquee 30s linear infinite',
        'fade-up-1':   'fadeUp 0.8s 0.10s forwards',
        'fade-up-2':   'fadeUp 0.8s 0.25s forwards',
        'fade-up-3':   'fadeUp 0.8s 0.40s forwards',
        'fade-up-4':   'fadeUp 0.8s 0.55s forwards',
        'fade-up-5':   'fadeUp 0.8s 0.70s forwards',
        'fade-in-6':   'fadeUp 0.8s 0.60s forwards',
      },
    },
  },
  plugins: [],
}

export default config