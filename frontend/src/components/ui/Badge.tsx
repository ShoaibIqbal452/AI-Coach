'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface BadgeProps extends Omit<ChipProps, 'color' | 'variant'> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'info' | 'outline';
}

function Badge({ variant = 'default', label, size = 'small', ...props }: BadgeProps) {
  const colorMap: Record<string, ChipProps['color']> = {
    default: 'primary',
    secondary: 'secondary',
    success: 'success',
    destructive: 'error',
    warning: 'warning',
    info: 'info',
    outline: 'default',
  };

  const color = colorMap[variant] || 'default';
  const chipVariant = variant === 'outline' ? 'outlined' : 'filled';

  return (
    <Chip 
      label={label} 
      color={color}
      size={size}
      variant={chipVariant}
      {...props} 
    />
  );
}

export { Badge };
