/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Boosteroid theme colors
        'boo-dark': '#060912',
        'boo-blue': '#00a3ff',
        'boo-green': '#22c55e',
      },
      fontFamily: {
        sans: ['Sofia Sans', 'sans-serif'],
        walkway: ['Walkway Black', 'Sofia Sans', 'sans-serif'],
        vcr: ['VCR OSD Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #060912 0%, #131721 50%, #0a0d14 100%)',
        'blue-glow': 'radial-gradient(circle at center, rgba(0, 163, 255, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.01)' },
        },
      },
    },
  },
  plugins: [],
}
