/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38aaf8',
          500: '#0ea5e9', // Sky blue for links/accents if needed
          600: '#0054a6', // Deep Blue
          700: '#004080', // Navy
          800: '#002d5a', // Dark Navy
          900: '#001a33', // Deep Dark Navy
        },
        gold: {
          50:  '#fffbea',
          100: '#fff1c5',
          200: '#ffe28a',
          300: '#ffcc4d',
          400: '#ffb31a',
          500: '#e69900', // Brand Gold/Orange
          600: '#cc7a00',
          700: '#a35c00',
          800: '#854700',
          900: '#6b3700',
        },
        secondary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      keyframes: {
        scroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(37,99,235,0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        scroll:     'scroll 30s linear infinite',
        float:      'float 6s ease-in-out infinite',
        shimmer:    'shimmer 2s linear infinite',
        pulseGlow:  'pulseGlow 2s ease-in-out infinite',
        slideDown:  'slideDown 0.3s ease-out',
        toastIn:    'toastIn 0.4s ease-out',
        fadeInUp:   'fadeInUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
