import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'brand-primary': '#00aaff', // Example primary color
        'brand-secondary': '#0077cc', // Example secondary color
        'trust-high-risk': '#FF4136', // Red
        'trust-suspicious': '#FF851B', // Orange
        'trust-neutral': '#FFDC00', // Yellow
        'trust-trusted': '#2ECC40', // Light Green
        'trust-highly-trusted': '#01FF70', // Green
        'cyberpunk': {
          'primary': '#ff2a6d',
          'secondary': '#05d9e8',
          'accent': '#7b61ff',
          'dark': '#0a0a16',
          'card': '#1a1a2e',
          'muted': '#252542',
          'text': '#f1f1f9',
          'highlight': '#fee440'
        }
      },
      animation: {
        'shine': 'shine 3s infinite ease-in-out',
        'neonPulse': 'neonPulse 2s infinite alternate',
        'glitch': 'glitch 5s infinite linear',
        'neonBorderShine': 'neonBorderShine 3s infinite',
        'gridPulse': 'gridPulse 10s infinite alternate',
        'cyberpunkGradient': 'cyberpunkGradient 15s ease infinite',
        'cardShine': 'cardShine 5s infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '60%, 100%': { transform: 'translateX(200%)' },
        },
        neonPulse: {
          'from': { 
            textShadow: 
              '0 0 5px rgba(255, 42, 109, 0.7), 0 0 10px rgba(255, 42, 109, 0.5), 0 0 20px rgba(255, 42, 109, 0.3)'
          },
          'to': { 
            textShadow: 
              '0 0 10px rgba(255, 42, 109, 0.9), 0 0 20px rgba(255, 42, 109, 0.7), 0 0 30px rgba(255, 42, 109, 0.5)'
          }
        },
        glitch: {
          '0%': {
            transform: 'translateX(0)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          },
          '2%': {
            clipPath: 'polygon(0 10%, 100% 10%, 100% 90%, 0 90%)',
            transform: 'translateX(-3px)'
          },
          '4%': {
            clipPath: 'polygon(0 5%, 100% 5%, 100% 95%, 0 95%)',
            transform: 'translateX(3px)'
          },
          '6%': {
            clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)',
            transform: 'translateX(-3px)'
          },
          '8%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateX(0)'
          },
          '100%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateX(0)'
          }
        },
        neonBorderShine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' }
        },
        gridPulse: {
          '0%': { opacity: '0.1' },
          '100%': { opacity: '0.3' }
        },
        cyberpunkGradient: {
          '0%': {
            backgroundPosition: '0% 50%',
            opacity: '0.6'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: '0.8'
          },
          '100%': {
            backgroundPosition: '0% 50%',
            opacity: '0.6'
          }
        },
        cardShine: {
          '0%': { left: '-100%' },
          '20%, 100%': { left: '200%' }
        }
      },
      variants: {
        extend: {
          backgroundColor: ['cyberpunk'],
          textColor: ['cyberpunk'],
          borderColor: ['cyberpunk'],
          boxShadow: ['cyberpunk'],
          textShadow: ['cyberpunk'],
          animation: ['cyberpunk']
        }
      }
    },
  },
  plugins: [],
}
export default config 