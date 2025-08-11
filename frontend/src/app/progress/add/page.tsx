"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Box, Typography, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProgressForm from '@/components/progress/ProgressForm';

export default function AddProgressPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/progress');
    }, 1500); 
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/progress')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Log New Progress
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <ProgressForm onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </MainLayout>
  );
}
