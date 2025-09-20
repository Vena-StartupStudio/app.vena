import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Keep a dark canvas but shift accents towards the marketing page’s purple–indigo spectrum
        night: '#0b0f1a',
        ink: '#0e1424',
        mist: '#faf8f4',
        alabaster: '#fcfaf7',
        slate: {
          50: '#f8fafc',
          100: '#eef2f6',
          200: '#dce3ea',
          300: '#c9d0dc',
          400: '#9aa6b2',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Replace aqua with indigo hues
        aqua: {
          100: '#e0e7ff',
          300: '#b7c3ff',
          500: '#6366f1', // indigo-500
          700: '#4f46e5', // indigo-600
        },
        // Replace lavender with violet/purple hues
        lavender: {
          100: '#ede9fe', // violet-100
          300: '#c4b5fd', // violet-300
          500: '#8b5cf6', // violet-500
          700: '#7c3aed', // violet-600
        },
        surface: {
          base: 'rgba(14, 20, 36, 0.78)',
          raised: 'rgba(16, 23, 42, 0.82)',
          glass: 'rgba(20, 28, 50, 0.78)',
          soft: 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 26px 80px -40px rgba(96, 165, 255, 0.65)',
        glass: '0 24px 60px -30px rgba(7, 10, 22, 0.7)',
        soft: '0 18px 40px -24px rgba(10, 19, 40, 0.6)',
      },
      backgroundImage: {
        // Marketing-inspired purple→indigo blends
        'gradient-surface': 'linear-gradient(135deg, rgba(139, 92, 246, 0.20) 0%, rgba(99, 102, 241, 0.14) 40%, rgba(139, 92, 246, 0.18) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(28, 32, 52, 0.95) 0%, rgba(18, 24, 42, 0.92) 100%)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      animation: {
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 0.95 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      maxWidth: {
        shell: '1240px',
      },
    },
  },
  plugins: [],
};

export default config;
