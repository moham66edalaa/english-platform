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
      },
      animation: {
        marquee:      'marquee 30s linear infinite',
        float:        'float 4s ease-in-out infinite',
        'float-delay':'float 4s 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config