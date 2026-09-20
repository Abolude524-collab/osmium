/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0F14',
        graphite: '#111820',
        elevated: '#17212B',
        cyan: {
          DEFAULT: '#00E5FF',
          hover: '#33EBFF',
          dim: 'rgba(0, 229, 255, 0.15)',
        },
        primary: '#F4F7FA',
        secondary: '#A7B0BA',
        border: '#26313C',
        success: '#35D07F',
        warning: '#FFB84D',
        error: '#FF5C6C',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        full: '9999px',
      },
      boxShadow: {
        cyan: '0 0 20px rgba(0, 229, 255, 0.25)',
        subtle: '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
