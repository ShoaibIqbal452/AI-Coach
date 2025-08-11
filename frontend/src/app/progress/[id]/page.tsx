"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProgressById, deleteProgressEntry } from '@/services/progressService';
import { ProgressEntry, MEASUREMENT_FIELDS, COMMON_MEASUREMENTS, COMMON_EXERCISES } from '@/types/progress';
import { format } from 'date-fns';

export default function ProgressDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const progressId = parseInt(params.id);
  
  const [progress, setProgress] = useState<ProgressEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (isNaN(progressId)) {
      router.push('/progress');
      return;
    }

    fetchProgressEntry();
  }, [router, progressId]);

  const fetchProgressEntry = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getProgressById(progressId);
      setProgress(data);
    } catch (err) {
      console.error('Error fetching progress entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    router.push(`/progress/edit/${progressId}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteProgressEntry(progressId);
      router.push('/progress');
    } catch (err) {
      console.error('Error deleting progress entry:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete progress entry');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !progress) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Progress entry not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/progress')}
          >
            Back to Progress
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/progress')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              Progress Entry
            </Typography>
          </Box>
          <Box>
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {formatDate(progress.date)}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Physical Metrics
              </Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    {MEASUREMENT_FIELDS.filter(field => field.category === 'physical').map((field) => {
                      const value = progress[field.key as keyof ProgressEntry];
                      if (value === undefined || value === null) return null;
                      
                      return (
                        <Grid item xs={12} sm={6} key={field.key}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {field.label}
                          </Typography>
                          <Typography variant="body1">
                            {value} {field.unit || ''}
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {progress.measurements && Object.keys(progress.measurements).length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Body Measurements
                </Typography>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      {COMMON_MEASUREMENTS.map((field) => {
                        const key = field.key.split('.')[1];
                        const value = progress.measurements?.[key];
                        if (value === undefined || value === null) return null;
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={field.key}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {field.label}
                            </Typography>
                            <Typography variant="body1">
                              {value} {field.unit || ''}
                            </Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {progress.workout_performance && Object.keys(progress.workout_performance).length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Workout Performance
                </Typography>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      {COMMON_EXERCISES.map((field) => {
                        const key = field.key.split('.')[1];
                        const value = progress.workout_performance?.[key];
                        if (value === undefined || value === null) return null;
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={field.key}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {field.label}
                            </Typography>
                            <Typography variant="body1">
                              {value} {field.unit || ''}
                            </Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Subjective Metrics
              </Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    {MEASUREMENT_FIELDS.filter(field => field.category === 'subjective').map((field) => {
                      const value = progress[field.key as keyof ProgressEntry];
                      if (value === undefined || value === null) return null;
                      
                      return (
                        <Grid item xs={12} sm={4} key={field.key}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {field.label}
                          </Typography>
                          <Typography variant="body1">
                            {value}/10
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {progress.notes && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {progress.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Progress Entry
        </DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this progress entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
