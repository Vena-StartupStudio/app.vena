import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#070910',
        ink: '#0b1220',
        mist: '#f6f7fb',
        alabaster: '#f7f5f1',
        slate: {
          50: '#f3f7ff',
          100: '#dde7ff',
          200: '#c0d3ff',
          300: '#a0bbff',
          400: '#7f9cff',
          500: '#6b84ff',
          600: '#5667e5',
          700: '#4a53b7',
          800: '#3a418f',
          900: '#2b2f68',
        },
        aqua: {
          100: '#d8f5ff',
          300: '#97e3ff',
          500: '#5acbff',
          700: '#1d97d6',
        },
        lavender: {
          100: '#f1e8ff',
          300: '#d5c3ff',
          500: '#b195ff',
          700: '#8a63f0',
        },
        surface: {
          base: 'rgba(12, 17, 32, 0.72)',
          raised: 'rgba(16, 22, 41, 0.78)',
          glass: 'rgba(23, 32, 59, 0.72)',
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
        'gradient-surface': 'linear-gradient(135deg, rgba(107, 132, 255, 0.16) 0%, rgba(90, 203, 255, 0.08) 40%, rgba(177, 149, 255, 0.14) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(33, 45, 80, 0.95) 0%, rgba(21, 30, 58, 0.92) 100%)',
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
