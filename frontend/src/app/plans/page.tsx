'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllPlans, Plan as PlanType, deletePlan, createPlan } from '@/services/planService';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Box, 
  Typography, 
  Stack, 
  CircularProgress, 
  Grid, 
  Alert, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Using the Plan type from planService

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<PlanType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'workout' | 'diet'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchPlans(token);
  }, [router]);

  const fetchPlans = async (token: string) => {
    setIsLoading(true);
    try {
      const plansData = await getAllPlans();
      setPlans(plansData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching plans');
      console.error('Error fetching plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = activeTab === 'all' 
    ? plans 
    : plans.filter(plan => plan.type === activeTab);

  const createNewPlan = async (type: 'workout' | 'diet') => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Use the planService instead of direct fetch with hardcoded URL
      const content = type === 'workout' 
        ? 'New workout plan created on ' + new Date().toLocaleDateString() 
        : 'New diet plan created on ' + new Date().toLocaleDateString();
      
      // Import createPlan from planService at the top of the file
      const newPlan = await createPlan(token, { type, content });
      
      // Refresh plans list
      fetchPlans(token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the plan');
      console.error('Error creating plan:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openDeleteDialog = (plan: PlanType) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'all' | 'workout' | 'diet') => {
    setActiveTab(newValue);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deletePlan(planToDelete.id);

      setDeleteSuccess('Plan deleted successfully!');
      setDeleteDialogOpen(false);

      setPlans(plans.filter(p => p.id !== planToDelete.id));
    } catch (err) {
      console.error('Error deleting plan:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete plan');
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
      setPlanToDelete(null);
    }
  };

  return (
    <MainLayout>
      <Snackbar 
        open={!!deleteSuccess} 
        autoHideDuration={3000} 
        onClose={() => setDeleteSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setDeleteSuccess(null)}>
          {deleteSuccess}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!deleteError} 
        autoHideDuration={3000} 
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      </Snackbar>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Plan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{planToDelete?.content}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDeletePlan} variant="default" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>My Plans</Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="default" 
              onClick={() => router.push('/plans/create')}
            >
              Create Custom Plan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => createNewPlan('workout')}
            >
              Quick Workout Plan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => createNewPlan('diet')}
            >
              Quick Diet Plan
            </Button>
          </Stack>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="plan type tabs"
          >
            <Tab label="All Plans" value="all" />
            <Tab label="Workout Plans" value="workout" />
            <Tab label="Diet Plans" value="diet" />
          </Tabs>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography color="error" align="center">{error}</Typography>
            </CardContent>
          </Card>
        ) : filteredPlans.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">No plans found. Create your first plan!</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredPlans.map((plan) => (
              <Grid item xs={12} md={6} lg={4} key={plan.id}>
                <Card sx={{ '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.3s' }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{plan.type === 'workout' ? 'Workout Plan' : 'Diet Plan'}</Typography>
                          {plan.type === 'workout' ? (
                            <Badge variant="default" label="Workout" />
                          ) : plan.type === 'diet' ? (
                            <Badge variant="secondary" label="Diet" />
                          ) : (
                            <Badge variant="default" label={plan.type} />
                          )}
                        </Box>
                        <Box>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(plan);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    }
                    subheader={`Created on ${formatDate(plan.created_at)}`}
                  />
                  <CardContent>
                    <Typography 
                      color="text.secondary" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {plan.content}
                    </Typography>
                  </CardContent>
                  <CardFooter>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/plans/edit/${plan.id}`);
                        }}
                        size="sm"
                        startIcon={<EditIcon fontSize="small" />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push(`/plans/${plan.id}`)}
                        size="sm"
                        startIcon={<VisibilityIcon fontSize="small" />}
                      >
                        View
                      </Button>
                    </Stack>
                  </CardFooter>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </MainLayout>
  );
}
