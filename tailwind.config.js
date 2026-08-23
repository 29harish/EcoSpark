/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary — fresh natural green
        leaf: {
          50: '#f1faf3',
          100: '#ddf3e2',
          200: '#bce6c8',
          300: '#8ed3a4',
          400: '#57b87c',
          500: '#339c5d',
          600: '#237d49',
          700: '#1c643c',
          800: '#194f33',
          900: '#15422c',
          950: '#0a2517',
        },
        // Secondary — teal
        lagoon: {
          50: '#eefbfd',
          100: '#d3f4f8',
          200: '#abe8f0',
          300: '#73d6e3',
          400: '#38bccf',
          500: '#1b9fb6',
          600: '#177e98',
          700: '#15657b',
          800: '#155265',
          900: '#154555',
          950: '#082c38',
        },
        // Accent — warm gold
        sun: {
          50: '#fffbeb',
          100: '#fff3c4',
          200: '#ffe588',
          300: '#ffd24d',
          400: '#fcb816',
          500: '#f09a0a',
          600: '#d27706',
          700: '#a85408',
          800: '#89420f',
          900: '#733710',
          950: '#441d03',
        },
        // Supporting — sky blue
        sky2: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Supporting — lavender
        lavender: {
          50: '#f6f4ff',
          100: '#ece9fe',
          200: '#ddd6fe',
          300: '#c3b1fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Supporting — coral
        coral: {
          50: '#fff5f3',
          100: '#ffe8e2',
          200: '#ffd0c5',
          300: '#ffb0a0',
          400: '#ff8870',
          500: '#fb6a4e',
          600: '#ec4a2c',
          700: '#c5371f',
          800: '#9c2f1f',
          900: '#7e2a1e',
          950: '#43100a',
        },
        // Neutrals — warm cream
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ecd9',
          300: '#ecdcbd',
          400: '#dcc39a',
          500: '#c9a878',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(28, 100, 60, 0.08)',
        'soft-lg': '0 12px 40px -4px rgba(28, 100, 60, 0.12)',
        glow: '0 0 30px -5px rgba(51, 156, 93, 0.4)',
        'glow-gold': '0 0 30px -5px rgba(252, 184, 22, 0.5)',
        inset: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(28,100,60,0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(6deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) translateX(10px) rotate(-5deg)' },
          '66%': { transform: 'translateY(10px) translateX(-8px) rotate(4deg)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'grow-up': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(300px) rotate(720deg)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up': 'slide-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        sway: 'sway 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'grow-up': 'grow-up 0.8s ease-out both',
        'slide-up-delay': 'slide-up 0.6s ease-out 0.1s both',
      },
    },
  },
  plugins: [],
};
