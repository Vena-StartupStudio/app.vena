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
        elegant: '0 20px 60px rgba(15, 23, 42, 0.08), 0 8px 32px rgba(15, 23, 42, 0.06)',
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
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'tab-slide': 'tabSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'tab-bounce': 'tabBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'reveal-up': 'revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'reveal-scale': 'revealScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'reveal-fade': 'revealFade 0.5s ease-out forwards',
        'metric-glow': 'metricGlow 2s ease-in-out infinite alternate',
        'shine': 'shine 3s ease-in-out infinite',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
        'badge-shimmer': 'badgeShimmer 2.5s ease-in-out infinite',
        'section-float': 'sectionFloat 6s ease-in-out infinite',
        'section-shine': 'sectionShine 4s ease-in-out infinite',
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
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        tabSlide: {
          from: { transform: 'translateX(-100%) scale(0.8)', opacity: '0' },
          to: { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        tabBounce: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        revealUp: {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        revealScale: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        revealFade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        metricGlow: {
          from: { boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)' },
          to: { boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' },
        },
        shine: {
          '0%, 100%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '50%': { transform: 'translateX(100%) skewX(-15deg)' },
        },
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        badgeShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sectionFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        sectionShine: {
          '0%, 100%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '50%': { transform: 'translateX(100%) skewX(-15deg)' },
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
