'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Divider, 
  Card, 
  CardContent,
  Button,
  Alert,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getProgressAnalysis, generateAdaptivePlan } from '@/services/progressAnalysisService';
import { ProgressAnalysis, AdaptivePlanRequest } from '@/types/progress';
import { useRouter } from 'next/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecommendIcon from '@mui/icons-material/Recommend';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export default function ProgressAnalysisPage() {
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<number>(30);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAnalysis(timeframe);
  }, [timeframe]);

  const fetchAnalysis = async (days: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProgressAnalysis(days);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAdaptivePlan = async (planType: string) => {
    setGeneratingPlan(true);
    try {
      const request: AdaptivePlanRequest = {
        plan_type: planType
      };
      const response = await generateAdaptivePlan(request);
      
      if (response.success && response.plan) {
        router.push(`/plans/${response.plan.id}`);
      } else {
        setError(response.message || 'Failed to generate adaptive plan');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate adaptive plan');
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <MainLayout>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          AI Progress Analysis
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/progress/add')}
        >
          Log Progress
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(Number(e.target.value))}
            label="Timeframe"
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          onClick={() => fetchAnalysis(timeframe)}
          disabled={loading}
        >
          Refresh Analysis
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : analysis ? (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5">Summary</Typography>
            </Box>
            <Typography variant="body1">
              {analysis.analysis_summary || 'No summary available'}
            </Typography>
          </Paper>

          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <LightbulbIcon sx={{ mr: 1, color: 'primary.main' }} />
            Key Insights
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {analysis.insights && analysis.insights.length > 0 ? (
              <Stack spacing={2}>
                {analysis.insights.map((insight, index) => (
                  <Card key={index} sx={{ borderLeft: '4px solid #3f51b5' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2">
                        {insight.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No insights available. Add more progress data to get personalized insights.
              </Typography>
            )}
          </Box>

          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <RecommendIcon sx={{ mr: 1, color: 'primary.main' }} />
            Recommendations
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <Stack spacing={2}>
                {analysis.recommendations.map((recommendation, index) => (
                  <Card key={index} sx={{ borderLeft: '4px solid #4caf50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {recommendation.title}
                      </Typography>
                      <Typography variant="body2">
                        {recommendation.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No recommendations available yet. Continue tracking your progress to receive personalized recommendations.
              </Typography>
            )}
          </Box>

          {analysis.plan_adjustments && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AutoFixHighIcon sx={{ mr: 1, color: 'primary.main' }} />
                Suggested Plan Adjustments
              </Typography>
              
              {analysis.plan_adjustments.workout && analysis.plan_adjustments.workout.length > 0 && (
                <Card sx={{ mb: 2, borderLeft: '4px solid #ff9800' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Workout Adjustments
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.plan_adjustments.workout.map((item, i) => (
                        <Chip key={i} label={item} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
              
              {analysis.plan_adjustments.diet && analysis.plan_adjustments.diet.length > 0 && (
                <Card sx={{ mb: 2, borderLeft: '4px solid #ff9800' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Diet Adjustments
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.plan_adjustments.diet.map((item, i) => (
                        <Chip key={i} label={item} color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Generate Adaptive Plan
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Create a new plan based on your progress data and AI analysis.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => handleGenerateAdaptivePlan('workout')}
                disabled={generatingPlan}
              >
                {generatingPlan ? 'Generating...' : 'Generate Workout Plan'}
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => handleGenerateAdaptivePlan('diet')}
                disabled={generatingPlan}
              >
                {generatingPlan ? 'Generating...' : 'Generate Diet Plan'}
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Alert severity="info">
          No analysis data available. Start tracking your progress to get AI-powered insights.
        </Alert>
      )}
    </Box>
    </MainLayout>
  );
}
