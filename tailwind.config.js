/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#1B1F35',
          50: '#EEF1F7',
          100: '#D7DCEA',
          200: '#A9B2CC',
          300: '#7B86AB',
          400: '#4D5889',
          500: '#363C4E',
          600: '#2A2F44',
          700: '#212538',
          800: '#1B1F35',
          900: '#12141B',
        },
        vermillion: {
          DEFAULT: '#ED3123',
          50: '#FFEEEB',
          100: '#FFD9D3',
          200: '#FFB3A8',
          300: '#FF8270',
          400: '#F55543',
          500: '#ED3123',
          600: '#C8221A',
          700: '#9E1A14',
          800: '#7A140F',
          900: '#5C0F0B',
        },
        cobalt: {
          DEFAULT: '#2B4BFF',
          50: '#EEF0FF',
          100: '#DCE0FF',
          200: '#B8C0FF',
          300: '#8A97FF',
          400: '#5C6EFF',
          500: '#2B4BFF',
          600: '#1F36CC',
          700: '#172899',
          800: '#0F1A66',
          900: '#080D33',
        },
        cloud: '#EEF1F7',
        ink: '#12141B',
        graphite: '#363C4E',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.25em',
        mono: '0.15em',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'scale-in': 'scaleIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-ring': 'pulseRing 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'draw': 'draw 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};
