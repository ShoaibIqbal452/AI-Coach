'use client';

import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Blue color similar to the previous primary color
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#6b7280', // Gray color
      light: '#9ca3af',
      dark: '#4b5563',
    },
    error: {
      main: '#ef4444', // Red color
      light: '#f87171',
      dark: '#b91c1c',
    },
    success: {
      main: '#10b981', // Green color
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber color
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6', // Blue color
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Open Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none', // Prevent all-caps buttons
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
  },
});

export default theme;
