/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f2',
          100: '#ffe6df',
          200: '#ffdad2',
          300: '#ffb4a2',
          400: '#ff9478',
          500: '#ff7a59',
          600: '#111827', // Obsidian Charcoal primary anchor
          700: '#1f2937',
          800: '#111827',
          900: '#0b0f19',
          950: '#030712',
        },
        coral: {
          50: '#fff5f2',
          100: '#ffe6df',
          200: '#ffdad2',
          300: '#ffb4a2',
          400: '#ff9478',
          500: '#ff7a59',
          600: '#f95f3b',
          700: '#d9411e',
          800: '#a7391e',
          900: '#701500',
        },
        charcoal: {
          DEFAULT: '#111827',
          hover: '#1f2937',
          surface: '#191c1e',
        },
        canvas: '#f8f9fb',
        surface: {
          DEFAULT: '#f8f9fb',
          lowest: '#ffffff',
          low: '#f3f4f6',
          container: '#edeef0',
          high: '#e7e8ea',
          highest: '#e1e2e4',
        },
        star: {
          gold: '#f59e0b',
          light: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ["'DM Sans'", "'Inter'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
        display: ["'Outfit'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        headline: ["'Outfit'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'mobile': '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'card': '0 4px 24px -2px rgba(17, 24, 39, 0.04)',
        'card-hover': '0 8px 30px -4px rgba(17, 24, 39, 0.08)',
        'stitch': '0 4px 24px -2px rgba(17, 24, 39, 0.04)',
        'stitch-lg': '0 16px 36px -8px rgba(17, 24, 39, 0.12)',
        'stitch-pill': '0 4px 12px rgba(17, 24, 39, 0.08)',
        'bottom-nav': '0 -2px 15px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
