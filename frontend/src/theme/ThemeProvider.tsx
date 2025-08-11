'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
