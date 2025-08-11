"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getProgressEntries } from '@/services/progressService';
import { ProgressEntry } from '@/types/progress';
import ProgressEntryList from '@/components/progress/ProgressEntryList';
import ProgressTrends from '@/components/progress/ProgressTrends';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProgressPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProgressEntries();
  }, [router]);

  const fetchProgressEntries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getProgressEntries();
      setProgressEntries(data.progress);
    } catch (err) {
      console.error('Error fetching progress entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddProgress = () => {
    router.push('/progress/add');
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Progress Tracking
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddProgress}
          >
            Log Progress
          </Button>
        </Box>

        <Paper sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="progress tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Entries" />
            <Tab label="Trends" icon={<TimelineIcon />} iconPosition="start" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : progressEntries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You haven't logged any progress yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleAddProgress}
                >
                  Log Your First Entry
                </Button>
              </Box>
            ) : (
              <ProgressEntryList 
                entries={progressEntries} 
                onRefresh={fetchProgressEntries} 
              />
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {progressEntries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Start logging your progress to see trends over time.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleAddProgress}
                >
                  Log Your First Entry
                </Button>
              </Box>
            ) : (
              <ProgressTrends />
            )}
          </TabPanel>
        </Paper>
      </Box>
    </MainLayout>
  );
}
