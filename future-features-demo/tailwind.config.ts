import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#fdfcff',
        ink: '#101729',
        mist: '#f6f8ff',
        alabaster: '#fbf7ef',
        slate: {
          50: '#f8fafc',
          100: '#eef2f6',
          200: '#e3e8f0',
          300: '#cdd5e3',
          400: '#aab4c8',
          500: '#7b879d',
          600: '#5c6781',
          700: '#445069',
          800: '#2f3a51',
          900: '#1c2533',
        },
        brand: {
          50: '#f7f3ff',
          100: '#ede3ff',
          200: '#d8c2ff',
          300: '#be9cff',
          400: '#a274f9',
          500: '#8b5cf6',
          600: '#7140e0',
          700: '#5b30b3',
        },
        accent: {
          100: '#e7f0ff',
          200: '#d4e4ff',
          400: '#9bbcff',
          600: '#5b7cff',
        },
        surface: {
          base: 'rgba(255, 255, 255, 0.92)',
          raised: 'rgba(255, 255, 255, 0.96)',
          glass: 'rgba(255, 255, 255, 0.85)',
          soft: 'rgba(16, 26, 44, 0.05)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 16px 40px rgba(142, 108, 255, 0.18)',
        glass: '0 12px 50px rgba(79, 70, 229, 0.12)',
        soft: '0 15px 35px rgba(15, 23, 42, 0.1)',
      },
      backgroundImage: {
        'gradient-surface': 'linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(99, 102, 241, 0.10) 40%, rgba(139, 92, 246, 0.14) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 248, 255, 0.94) 100%)',
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
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.95' },
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
