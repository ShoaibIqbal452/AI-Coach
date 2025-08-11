'use client';

import React, { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant' | 'size'> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', color = 'primary', size = 'medium', fullWidth = false, isLoading, disabled, ...props }, ref) => {
    const getVariant = () => {
      switch(variant) {
        case 'default': return 'contained';
        case 'secondary': return 'contained';
        case 'outline': return 'outlined';
        case 'ghost': return 'text';
        case 'destructive': return 'contained';
        default: return 'contained';
      }
    };
    
    const getSize = () => {
      switch(size) {
        case 'sm': return 'small';
        case 'md': return 'medium';
        case 'lg': return 'large';
        default: return size as 'small' | 'medium' | 'large';
      }
    };
    
    const getColor = () => {
      if (variant === 'secondary') return 'secondary';
      if (variant === 'destructive') return 'error';
      return color;
    };
    
    return (
      <MuiButton
        ref={ref}
        variant={getVariant()}
        color={getColor()}
        size={getSize()}
        fullWidth={fullWidth}
        disabled={isLoading || disabled}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
