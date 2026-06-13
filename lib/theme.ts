"use client";

import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#111827' : '#F9FAFB', // Dark charcoal/white primary
    },
    secondary: {
      main: mode === 'light' ? '#2563EB' : '#3B82F6', // Blue secondary brand accent
    },
    background: {
      default: mode === 'light' ? '#FAFAFA' : '#0A0A0A', // Ultra clean backgrounds
      paper: mode === 'light' ? '#FFFFFF' : '#141414', // High contrast cards
    },
    text: {
      primary: mode === 'light' ? '#374151' : '#EDEDED',
      secondary: mode === 'light' ? '#6B7280' : '#A1A1AA',
    },
    divider: mode === 'light' ? '#F3F4F6' : 'rgba(255,255,255,0.08)',
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
  },
  typography: {
    fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 900,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 900,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 20, // Modern large border radius
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped buttons globally
          padding: '12px 28px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 700,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)'
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 24,
          backgroundImage: 'none', 
          boxShadow: theme.palette.mode === 'light' ? '0 12px 40px -12px rgba(0,0,0,0.05)' : '0 12px 40px -12px rgba(0,0,0,0.5)',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 24,
        }
      }
    }
  },
});

export const getTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
