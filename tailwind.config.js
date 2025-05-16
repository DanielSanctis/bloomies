/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: 'hsl(60, 30%, 96%)',
        foreground: 'hsl(30, 25%, 18%)',

        // Primary colors (Tan/Beige)
        primary: {
          DEFAULT: 'hsl(34, 37%, 67%)',
          light: 'hsl(34, 37%, 83%)',
          dark: 'hsl(34, 37%, 58%)',
          foreground: 'hsl(0, 0%, 100%)',
        },

        // Secondary colors (Soft Pink)
        secondary: {
          DEFAULT: 'hsl(348, 29%, 75%)',
          light: 'hsl(348, 29%, 88%)',
          dark: 'hsl(348, 29%, 62%)',
          foreground: 'hsl(0, 0%, 100%)',
        },

        // Accent colors (Gold)
        accent: {
          DEFAULT: 'hsl(51, 100%, 50%)',
          light: 'hsl(51, 100%, 70%)',
          dark: 'hsl(51, 100%, 40%)',
          foreground: 'hsl(30, 25%, 18%)',
        },

        // Neutral colors (for backward compatibility)
        cream: {
          DEFAULT: 'hsl(60, 33%, 94%)',
          light: 'hsl(60, 33%, 97%)'
        },
        beige: {
          DEFAULT: 'hsl(33, 28%, 86%)',
          dark: 'hsl(33, 28%, 76%)'
        },
        brown: {
          DEFAULT: 'hsl(15, 28%, 28%)',
          light: 'hsl(15, 28%, 38%)',
          dark: 'hsl(15, 28%, 22%)'
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Merriweather', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        // Legacy font families for backward compatibility
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 15px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
