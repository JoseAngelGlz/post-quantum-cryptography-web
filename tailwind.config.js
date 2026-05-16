/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: 'rgb(var(--bg) / <alpha-value>)',
          panel: 'rgb(var(--panel) / <alpha-value>)',
          panel2: 'rgb(var(--panel2) / <alpha-value>)',
          border: 'rgb(var(--border) / <alpha-value>)',
          fg: 'rgb(var(--fg) / <alpha-value>)',
          'fg-strong': 'rgb(var(--fg-strong) / <alpha-value>)',
          'fg-soft': 'rgb(var(--fg-soft) / <alpha-value>)',
          'fg-mute': 'rgb(var(--fg-mute) / <alpha-value>)',
          cyan: 'rgb(var(--cyan) / <alpha-value>)',
          violet: 'rgb(var(--violet) / <alpha-value>)',
          pink: 'rgb(var(--pink) / <alpha-value>)',
          blue: 'rgb(var(--blue) / <alpha-value>)',
          mint: 'rgb(var(--mint) / <alpha-value>)',
          amber: 'rgb(var(--amber) / <alpha-value>)',
          rose: 'rgb(var(--rose) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
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
      },
      animation: {
        'gradient-shift': 'gradient-shift 12s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
