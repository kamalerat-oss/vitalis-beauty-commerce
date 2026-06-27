/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 16px)',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'rose-sm': '0 2px 12px rgba(212, 119, 138, 0.12)',
        'rose-md': '0 4px 24px rgba(212, 119, 138, 0.2)',
        'rose-lg': '0 8px 40px rgba(212, 119, 138, 0.28)',
        'rose-xl': '0 16px 60px rgba(212, 119, 138, 0.35)',
        'card': '0 2px 12px rgba(45, 27, 30, 0.06)',
        'card-hover': '0 12px 32px rgba(212, 119, 138, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #FFFAF9 0%, #FDE8ED 40%, #F5C6D0 100%)',
        'gradient-pink': 'linear-gradient(135deg, #D4778A 0%, #C9956D 50%, #E8A0B0 100%)',
        'gradient-rose-gold': 'linear-gradient(135deg, #C9956D 0%, #D4778A 100%)',
      },
      animation: {
        'fade-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-scale': 'fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'floatY 5s ease-in-out infinite',
        'float-slow': 'floatYSlow 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 18s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient': 'gradientShift 5s ease infinite',
        'chat-bounce': 'chatBounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};