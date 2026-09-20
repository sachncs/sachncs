/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d8d8dc',
          300: '#b6b6bd',
          400: '#8d8d96',
          500: '#6e6e78',
          600: '#52525b',
          700: '#3d3d44',
          800: '#26262b',
          900: '#15151a',
          950: '#07131d',
        },
        accent: {
          50: '#f4ffe2',
          100: '#e7ffb5',
          200: '#d7ff78',
          300: '#c1f34d',
          400: '#a4dc32',
          500: '#86bd20',
          600: '#6b9815',
          700: '#527511',
          800: '#3f5a12',
          900: '#354b13',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-xl': '0 30px 80px -20px rgba(15, 15, 25, 0.18)',
        'glow-accent': '0 0 0 1px rgba(99,102,241,0.18), 0 12px 40px -10px rgba(99,102,241,0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out both',
        'shimmer': 'shimmer 6s linear infinite',
        'aurora': 'aurora 18s ease infinite',
        'float-slow': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(2%,-2%,0) rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
