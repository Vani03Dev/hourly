"use client";

import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1E3A5F' : '#60A5FA', // Bright blue in dark mode for visible text
    },
    secondary: {
      main: mode === 'light' ? '#0D9488' : '#2DD4BF', // Brighter teal for dark mode visibility
    },
    background: {
      default: mode === 'light' ? '#F9FAFB' : '#000000', // True black
      paper: mode === 'light' ? '#FFFFFF' : '#111111', // Very dark grey
    },
    text: {
      primary: mode === 'light' ? '#374151' : '#EDEDED',
      secondary: mode === 'light' ? '#6B7280' : '#A1A1AA',
    },
    divider: mode === 'light' ? '#E5E7EB' : 'rgba(255,255,255,0.1)',
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
  },
  typography: {
    fontFamily: 'var(--font-plus-jakarta), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
    borderRadius: 16, // Softer global border radius
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
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)'
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none', // Remove weird overlay in dark mode MUI
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  },
});

export const getTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
