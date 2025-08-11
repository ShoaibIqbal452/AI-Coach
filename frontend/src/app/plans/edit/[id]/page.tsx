'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { 
  Box, 
  Typography, 
  Stack, 
  CircularProgress, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Alert,
  Snackbar
} from '@mui/material';
import { getPlanById, updatePlan, Plan } from '@/services/planService';

// Using Plan interface from planService

export default function EditPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<string>('workout');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchPlan = async () => {
      try {
        // Use getPlanById from planService instead of direct fetch
        const data = await getPlanById(params.id);
        
        setPlan(data);
        setTitle(data.title || '');
        setContent(data.content);
        setType(data.type as 'workout' | 'diet');
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError('Failed to load plan. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [params.id, router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!content.trim()) {
      setSaveError('Content is required');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Use updatePlan from planService instead of direct fetch
      await updatePlan(params.id, {
        content,
        type,
        title
      });

      setSaveSuccess('Plan updated successfully!');
      
      setTimeout(() => {
        router.push(`/plans/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating plan:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to update plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <Snackbar 
        open={!!saveSuccess} 
        autoHideDuration={3000} 
        onClose={() => setSaveSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSaveSuccess(null)}>
          {saveSuccess}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!saveError} 
        autoHideDuration={3000} 
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSaveError(null)}>
          {saveError}
        </Alert>
      </Snackbar>

      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/plans/${params.id}`)}
          >
            ← Back to Plan
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Edit Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <FormLabel>Plan Type</FormLabel>
                  <RadioGroup
                    row
                    value={type}
                    onChange={(e) => setType(e.target.value as 'workout' | 'diet')}
                  >
                    <FormControlLabel value="workout" control={<Radio />} label="Workout Plan" />
                    <FormControlLabel value="diet" control={<Radio />} label="Diet Plan" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  label="Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                />

                <TextField
                  label="Content"
                  fullWidth
                  multiline
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="outlined"
                />
              </Stack>
            </CardContent>
            <CardFooter sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/plans/${params.id}`)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
}
