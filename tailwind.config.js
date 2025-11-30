// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores feministas personalizadas
        'feminist': {
          'pink': '#EC4899',
          'purple': '#8B5CF6',
          'lilac': '#C4B5FD',
          'green': '#10B981',
          'blue': '#3B82F6',
          'gold': '#F59E0B',
        },
        // Tons neutros elegantes
        'elegant': {
          'white': '#FFFFFF',
          'pearl': '#F8FAFC',
          'gray-light': '#F1F5F9',
          'gray-medium': '#64748B',
          'gray-dark': '#334155',
          'black': '#0F172A',
        }
      },
      backgroundImage: {
        'feminist-gradient': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        'feminist-gradient-soft': 'linear-gradient(135deg, #C4B5FD 0%, #3B82F6 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'message-slide-in': 'messageSlideIn 0.3s ease-out',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'loading-bounce': 'loading-bounce 1.4s ease-in-out infinite both',
      },
      boxShadow: {
        'feminist-soft': '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)',
        'feminist-medium': '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)',
        'feminist-floating': '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}