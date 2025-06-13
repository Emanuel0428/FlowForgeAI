/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Líquida y Dinámica
        liquid: {
          dark: 'var(--liquid-dark)',
          navy: 'var(--liquid-navy)',
          charcoal: 'var(--liquid-charcoal)',
          surface: 'var(--liquid-surface)',
          border: 'var(--liquid-border)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        iridescent: {
          blue: '#00d4ff',
          violet: '#8b5cf6',
          cyan: '#06ffa5',
          emerald: '#10b981',
          electric: '#3b82f6',
          purple: '#a855f7',
        },
        glow: {
          50: 'rgba(0, 212, 255, 0.05)',
          100: 'rgba(0, 212, 255, 0.1)',
          200: 'rgba(0, 212, 255, 0.2)',
          300: 'rgba(0, 212, 255, 0.3)',
          500: 'rgba(0, 212, 255, 0.5)',
        },
        primary: {
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
          950: '#172554',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'blob': '30% 70% 70% 30% / 30% 30% 70% 70%',
        'organic': '25% 75% 75% 25% / 25% 25% 75% 75%',
        'fluid': '40% 60% 60% 40% / 40% 40% 60% 60%',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'liquid-flow': 'liquidFlow 4s ease-in-out infinite',
        'iridescent': 'iridescent 3s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glowPulse: {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)',
            transform: 'scale(1.02)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        liquidFlow: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateX(30px) rotate(120deg)' },
          '66%': { transform: 'translateX(-20px) rotate(240deg)' },
        },
        iridescent: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'iridescent-gradient': 'linear-gradient(-45deg, #00d4ff, #8b5cf6, #06ffa5, #a855f7)',
        'liquid-gradient': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1))',
        'glow-gradient': 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1), transparent 70%)',
      },
      backgroundSize: {
        'iridescent': '400% 400%',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}