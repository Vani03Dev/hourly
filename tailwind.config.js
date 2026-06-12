/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand
        'navy-DEFAULT': '#1E3A5F',
        navy: {
          DEFAULT: '#1E3A5F',
          dark: '#152D4A',
          light: '#2A4E7F',
        },
        'teal-DEFAULT': '#0D9488',
        teal: {
          DEFAULT: '#0D9488',
          dark: '#0A7A70',
          light: '#14B8A6',
          bg: '#F0FDFA',
        },
        // Neutrals
        'surface-DEFAULT': '#F9FAFB',
        surface: {
          DEFAULT: '#F9FAFB',
          2: '#F3F4F6',
        },
        'border-DEFAULT': '#E5E7EB',
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB',
        },
        // Text
        text: {
          primary: '#111827',
          body: '#374151',
          sub: '#4B5563',
          muted: '#6B7280',
          disabled: '#9CA3AF',
        },
        // Semantic
        'gold-DEFAULT': '#F59E0B',
        gold: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },
        'green-DEFAULT': '#10B981',
        green: {
          DEFAULT: '#10B981',
          bg: '#ECFDF5',
        },
        'red-DEFAULT': '#EF4444',
        red: {
          DEFAULT: '#EF4444',
          bg: '#FEF2F2',
        },
        'yellow-DEFAULT': '#F59E0B',
        yellow: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },
        overlay: 'rgba(17,24,39,0.6)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-instrument)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'sm': '0 2px 4px rgba(0,0,0,0.05)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
        'lg': '0 8px 24px rgba(0,0,0,0.10)',
        'xl': '0 16px 48px rgba(0,0,0,0.12)',
        'teal': '0 4px 16px rgba(13,148,136,0.25)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'h5': ['18px', { lineHeight: '1.5' }],
        'h4': ['22px', { lineHeight: '1.4' }],
        'h3': ['28px', { lineHeight: '1.3' }],
        'h2': ['40px', { lineHeight: '1.2' }],
        'h1': ['56px', { lineHeight: '1.1' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
