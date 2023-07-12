/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{tsx,css}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-opacity': 'fade-in-opacity 0.2s ease-in-out',
        'fade-out-opacity': 'fade-out-opacity 0.2s ease-in-out',
        'fade-side-up': 'fade-side-up 0.5s ease-in-out',
        'fade-side-down': 'fade-side-down 0.5s ease-in-out',
        'fade-side-left': 'fade-side-left 0.5s ease-in-out',
        'fade-side-right': 'fade-side-right 0.5s ease-in-out',
        'ping-infinite': 'ping-infinite 1.5s ease-in-out infinite',
      },
      keyframes: {
        'fade-in-opacity': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out-opacity': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fade-side-down': {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-side-up': {
          '0%': { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-side-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-side-left': {
          '0%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'ping-infinite': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

