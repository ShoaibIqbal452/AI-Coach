'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Box, 
  Typography, 
  Stack, 
  CircularProgress, 
  Divider, 
  Paper, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getPlanById, analyzePlan, PlanAnalysis, Plan, deletePlan } from '@/services/planService';

export default function PlanDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const [analysis, setAnalysis] = useState<PlanAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchPlanDetails(token, params.id);
  }, [router, params.id]);

  const fetchPlanDetails = async (token: string, planId: string) => {
    setIsLoading(true);
    try {
      // Use the planService instead of direct fetch with hardcoded URL
      const planData = await getPlanById(planId);
      setPlan(planData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching plan details');
      console.error('Error fetching plan details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleDeletePlan = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Use the deletePlan function from planService
      await deletePlan(params.id);
      
      setDeleteSuccess('Plan deleted successfully!');
      setDeleteDialogOpen(false);
      
      setTimeout(() => {
        router.push('/plans');
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting plan:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete plan');
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditPlan = () => {
    router.push(`/plans/edit/${params.id}`);
  };
  
  const handleAnalyzePlan = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const analysisResult = await analyzePlan(params.id);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('Error analyzing plan:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze plan');
    } finally {
      setIsAnalyzing(false);
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
            Are you sure you want to delete this plan? This action cannot be undone.
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
      
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outline" 
            onClick={() => router.push('/plans')}
          >
            ← Back to Plans
          </Button>
          
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outline" 
              onClick={handleEditPlan}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button 
              variant="default" 
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Stack>
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
        ) : plan ? (
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>
                    {plan.type === 'workout' ? 'Workout Plan' : 'Diet Plan'}
                  </CardTitle>
                  <Badge 
                    variant={plan.type === 'workout' ? 'default' : 'secondary'}
                    label={plan.type}
                  />
                </Box>
              }
              subheader={`Created on ${formatDate(plan.created_at)}`}
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                <Typography 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}
                >
                  {plan.content}
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    AI Analysis & Feedback
                  </Typography>
                </Divider>
                
                {analysis ? (
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="analysis-content"
                      id="analysis-header"
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        Plan Analysis Results
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.95rem',
                          lineHeight: 1.6 
                        }}
                      >
                        {analysis.analysis}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    {isAnalyzing ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={30} />
                        <Typography>Analyzing your plan...</Typography>
                      </Box>
                    ) : (
                      <>
                        {analysisError ? (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {analysisError}
                          </Alert>
                        ) : null}
                        <Typography sx={{ mb: 2 }}>
                          Get AI-powered feedback on how well this plan matches your fitness profile and goals.
                        </Typography>
                        <Button
                          variant="default"
                          onClick={handleAnalyzePlan}
                          startIcon={<AnalyticsIcon />}
                        >
                          Analyze This Plan
                        </Button>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
            <CardFooter sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outline" 
                onClick={() => router.push('/chat')}
              >
                Discuss in Chat
              </Button>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outline" 
                  onClick={handleEditPlan}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button 
                  variant="default" 
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Stack>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography color="error" align="center">Plan not found</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
}
