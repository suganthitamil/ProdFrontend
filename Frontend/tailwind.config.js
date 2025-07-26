/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // App Router structure
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#6366F1', // Indigo-500
            dark: '#4F46E5',   // Indigo-600
            light: '#A5B4FC',  // Indigo-300
          },
          accent: {
            DEFAULT: '#F59E42', // Orange-400
            dark: '#D97706',   // Orange-600
            light: '#FDE68A',  // Orange-200
          },
          background: {
            DEFAULT: '#F9FAFB', // Gray-50
            dark: '#18181B',   // Gray-900
          },
          surface: {
            DEFAULT: '#FFFFFF', // White
            dark: '#27272A',   // Gray-800
          },
        },
        fontFamily: {
          sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
      },
    },
    darkMode: 'class',
    plugins: [],
  }