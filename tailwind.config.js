/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: '#05060f',
          panel: '#0c0f1d',
          panel2: '#121733',
          border: '#1f2750',
          cyan: '#5eead4',
          violet: '#a78bfa',
          pink: '#f472b6',
          blue: '#60a5fa',
          mint: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'grid-cyan': 'linear-gradient(rgba(94,234,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.06) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(ellipse at top, rgba(167,139,250,0.18), transparent 60%)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 12s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
      },
    },
  },
  plugins: [],
}
