/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fff5f5', 100: '#ffeaea', 200: '#ffc5c5',
          300: '#ff9a9a', 400: '#ff6b6b', 500: '#c0392b',
          600: '#a93226', 700: '#922b21', 800: '#7b241c',
          900: '#641e16',
        },
        gold: {
          50: '#fffdf0', 100: '#fff9d6', 200: '#fff0a0',
          300: '#ffe066', 400: '#ffc93c', 500: '#e6a817',
          600: '#c8873a', 700: '#a0672a', 800: '#7a4a1c',
          900: '#5a350f',
        },
        navy: {
          50: '#eef6fb', 100: '#d0e8f5', 200: '#9ecfe9',
          300: '#63b0d8', 400: '#3492c2', 500: '#1a6080',
          600: '#0d4d6a', 700: '#0a3d55', 800: '#072e42',
          900: '#041f2e',
        },
        cream: {
          50: '#fffdf9', 100: '#fff8ee', 200: '#fef0d5',
          300: '#fde3b3', 400: '#fbcf85', 500: '#f8b84e',
        },
        saffron: {
          500: '#f97316', 600: '#ea6c0a',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        hindi: ['"Noto Serif Devanagari"', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(200, 135, 58, 0.15)',
        'warm-lg': '0 8px 40px rgba(200, 135, 58, 0.25)',
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a0800 0%, #4a1a00 50%, #7a3a10 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c8873a 0%, #e6a817 50%, #c8873a 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #7b241c 0%, #c0392b 100%)',
        'navy-gradient': 'linear-gradient(180deg, #041f2e 0%, #0d4d6a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,135,58,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,135,58,0)' },
        },
      },
    }
  },
  plugins: [],
}
