/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Blue brand accent (Fire Marshal template, recolored blue)
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Dark marketing-panel ink
        ink: {
          900: '#0b1020',
          800: '#0f172a',
          700: '#1e293b',
        },
      },
      backgroundImage: {
        'auth-panel':
          'radial-gradient(1200px 600px at 0% 0%, rgba(37,99,235,0.22), transparent 55%), linear-gradient(160deg, #0b1226 0%, #0a0e18 55%, #06080f 100%)',
        'brand-gradient': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      },
      boxShadow: {
        input: 'inset 0 1px 2px rgba(15,23,42,0.06), 0 1px 0 rgba(255,255,255,0.7)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        brand: '0 8px 24px rgba(37,99,235,0.32)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
