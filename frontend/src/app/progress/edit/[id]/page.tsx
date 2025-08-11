"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { Box, Typography, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProgressForm from '@/components/progress/ProgressForm';

export default function EditProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const progressId = parseInt(params.id);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (isNaN(progressId)) {
      router.push('/progress');
    }
  }, [router, progressId]);

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
            Edit Progress Entry
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <ProgressForm progressId={progressId} onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </MainLayout>
  );
}
