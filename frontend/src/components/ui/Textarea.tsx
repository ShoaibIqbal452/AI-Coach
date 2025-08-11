'use client';

import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface TextareaProps extends Omit<TextFieldProps, 'error'> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, type, fullWidth = true, variant = 'outlined', size = 'medium', ...props }, ref) => {
    return (
      <TextField
        multiline
        minRows={3}
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

Textarea.displayName = 'Textarea';

export { Textarea };
