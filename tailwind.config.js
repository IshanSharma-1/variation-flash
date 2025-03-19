module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neonYellow: '#ffd700',
        neonRed: '#ff0000',
        glassWhite: 'rgba(255, 255, 255, 0.15)',
      },
      fontFamily: {
        sans: ['Montserrat', "'Segoe UI'", 'sans-serif'],
        title: ['Cinzel', 'serif'],
        accent: ['Playfair Display', 'serif'],
      },
      keyframes: {
        particleMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(0, -100vh)' },
        },
        glitter: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-20%) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        particleMove: 'particleMove 10s linear infinite',
        glitter: 'glitter 3s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out forwards',
        gradient: 'gradient 15s ease infinite',
      },
    },
  },
  plugins: [],
};