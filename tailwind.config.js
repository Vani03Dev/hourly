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
        // Sessionly Design Tokens
        primary: {
          DEFAULT: '#111827',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        success: {
          DEFAULT: '#16A34A',
        },
        warning: {
          DEFAULT: '#D97706',
        },
        danger: {
          DEFAULT: '#DC2626',
        },
        bg: {
          DEFAULT: '#F9FAFB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        muted: {
          DEFAULT: '#6B7280',
        },
        text: {
          DEFAULT: '#111827',
        },
        // Legacy Brand support mapped to Sessionly brand colors
        navy: {
          DEFAULT: '#111827', // Charcoal primary
          700: '#1F2937',
        },
        teal: {
          DEFAULT: '#2563EB', // Blue accent
          600: '#1D4ED8',     // Accent hover
          50: '#EFF6FF',      // Accent light bg
        },
        white: '#FFFFFF',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
        green: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          900: '#064E3B',
        },
        amber: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
        },
        red: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
        },
        gold: '#F59E0B',
        itc: {
          bg: '#ECFDF5',
          text: '#065F46',
        },
        verified: {
          bg: '#EFF6FF',
          text: '#1D4ED8',
        },
        workspace: {
          bg: '#F5F3FF',
          text: '#5B21B6',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        snug: '-0.015em',
        normal: '0',
        wide: '0.02em',
        wider: '0.04em',
        widest: '0.08em',
      },
      lineHeight: {
        tight: '1.1',
        snug: '1.25',
        normal: '1.5',
        relaxed: '1.625',
        loose: '1.75',
      },
      boxShadow: {
        'level-0': 'none',
        'level-1': '0 1px 2px rgba(15,33,55,0.04), 0 1px 4px rgba(15,33,55,0.06)',
        'level-2': '0 4px 6px rgba(15,33,55,0.05), 0 10px 15px rgba(15,33,55,0.08)',
        'level-3': '0 10px 24px rgba(15,33,55,0.10), 0 24px 48px rgba(15,33,55,0.12)',
        'level-4': '0 20px 40px rgba(15,33,55,0.15), 0 40px 80px rgba(15,33,55,0.18)',
        'premium': '0 10px 30px -10px rgba(37, 99, 235, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      spacing: {
        '2px': '2px',
        '4px': '4px',
        '8px': '8px',
        '12px': '12px',
        '16px': '16px',
        '20px': '20px',
        '24px': '24px',
        '32px': '32px',
        '40px': '40px',
        '48px': '48px',
        '64px': '64px',
        '80px': '80px',
        '96px': '96px',
        '128px': '128px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
