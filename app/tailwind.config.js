/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#070b14',
        surface: '#0d1527',
        'surface-border': 'rgba(0, 242, 254, 0.15)',
        'neon-purple': '#bd00ff',
        'neon-cyan': '#00f2fe',
        'neon-pink': '#e056fd',
        'neon-gold': '#ffbe0b',
        'neon-green': '#06d6a0',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(189, 0, 255, 0.35)',
        'neon-cyan': '0 0 20px rgba(0, 242, 254, 0.35)',
        'neon-gold': '0 0 15px rgba(255, 190, 11, 0.35)',
        'neon-green': '0 0 15px rgba(6, 214, 160, 0.35)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
