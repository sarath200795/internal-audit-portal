/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Cyan brand accent (matches the original portal)
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Dark marketing-panel ink
        ink: {
          900: '#0b1220',
          800: '#0f172a',
          700: '#1e293b',
        },
      },
      backgroundImage: {
        'auth-panel':
          'radial-gradient(1200px 600px at 0% 0%, rgba(8,145,178,0.28), transparent 55%), linear-gradient(160deg, #0b1f24 0%, #0a1118 55%, #060a0f 100%)',
        'brand-gradient': 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      },
      boxShadow: {
        input: 'inset 0 1px 2px rgba(15,23,42,0.06), 0 1px 0 rgba(255,255,255,0.7)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        brand: '0 8px 24px rgba(8,145,178,0.35)',
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
