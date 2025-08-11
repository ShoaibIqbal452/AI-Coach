'use client';

import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'error'> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, type, fullWidth = true, variant = 'outlined', size = 'medium', ...props }, ref) => {
    return (
      <TextField
        type={type}
        label={label}
        error={!!error}
        helperText={error}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        inputRef={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
