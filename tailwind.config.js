/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        animation: {
          tada: 'tada 1s ease-in-out',
        },
        keyframes: {
          tada: {
            '0%, 100%': { transform: 'scale(1)' },
            '10%, 30%': { transform: 'scale(0.9) rotate(-3deg)' },
            '20%, 40%, 60%, 80%': { transform: 'scale(1.1) rotate(3deg)' },
            '50%, 70%': { transform: 'scale(1.1) rotate(-3deg)' },
          },
        },
      },
    },
    plugins: [],
  };
  