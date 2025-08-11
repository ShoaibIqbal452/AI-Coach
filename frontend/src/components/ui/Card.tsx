'use client';

import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardHeader as MuiCardHeader,
  CardHeaderProps,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  Typography,
  Box
} from '@mui/material';

export const Card = ({ children, ...props }: MuiCardProps) => (
  <MuiCard {...props}>{children}</MuiCard>
);

export const CardHeader = ({ 
  title, 
  subheader, 
  ...props 
}: CardHeaderProps) => (
  <MuiCardHeader title={title} subheader={subheader} {...props} />
);

export const CardContent = ({ children, ...props }: React.ComponentProps<typeof MuiCardContent>) => (
  <MuiCardContent {...props}>{children}</MuiCardContent>
);

export const CardFooter = ({ children, ...props }: React.ComponentProps<typeof MuiCardActions>) => (
  <MuiCardActions {...props}>{children}</MuiCardActions>
);

export const CardTitle = ({ children, ...props }: React.ComponentProps<typeof Typography>) => (
  <Typography variant="h6" component="h2" {...props}>
    {children}
  </Typography>
);

export const CardDescription = ({ children, ...props }: React.ComponentProps<typeof Typography>) => (
  <Typography variant="body2" color="text.secondary" {...props}>
    {children}
  </Typography>
);

