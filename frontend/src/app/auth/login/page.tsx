'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/constants';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Alert, 
  Container, 
  Divider,
  Link as MuiLink
} from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('token', data.access_token);
      
      router.push('/chat');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', py: 4 }}>
      <Card sx={{ width: '100%', boxShadow: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h5" component="h1" align="center" color="primary" fontWeight="bold">
              AI Gym Coach
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" align="center">
              Sign in to your account
            </Typography>
          }
          sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}
        />
        <CardContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button 
              type="submit" 
              fullWidth
              isLoading={isLoading}
              variant="default"
              color="primary"
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{' '}
            <MuiLink component={Link} href="/auth/register" color="primary" fontWeight="medium">
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
