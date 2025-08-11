import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Slider,
  InputAdornment,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StraightenIcon from '@mui/icons-material/Straighten';
import MoodIcon from '@mui/icons-material/Mood';
import { 
  ProgressCreate, 
  ProgressEntry, 
  ProgressUpdate, 
  MEASUREMENT_FIELDS, 
  COMMON_MEASUREMENTS, 
  COMMON_EXERCISES 
} from '@/types/progress';
import { createProgressEntry, updateProgressEntry, getProgressById } from '@/services/progressService';

interface ProgressFormProps {
  progressId?: number;
  onSuccess: () => void;
}

export default function ProgressForm({ progressId, onSuccess }: ProgressFormProps) {
  const [formData, setFormData] = useState<ProgressCreate>({
    weight: undefined,
    body_fat: undefined,
    measurements: {},
    workout_performance: {},
    energy_level: 5,
    mood: 5,
    sleep_quality: 5,
    notes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isEditMode = !!progressId;

  useEffect(() => {
    if (isEditMode) {
      fetchProgressEntry();
    }
  }, [progressId]);

  const fetchProgressEntry = async () => {
    if (!progressId) return;
    
    setIsFetching(true);
    setError(null);
    
    try {
      const entry = await getProgressById(progressId);
      
      setFormData({
        weight: entry.weight,
        body_fat: entry.body_fat,
        measurements: entry.measurements || {},
        workout_performance: entry.workout_performance || {},
        energy_level: entry.energy_level || 5,
        mood: entry.mood || 5,
        sleep_quality: entry.sleep_quality || 5,
        notes: entry.notes || ''
      });
    } catch (err) {
      console.error('Error fetching progress entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress entry');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: numValue
      }
    }));
  };

  const handleWorkoutChange = (key: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      workout_performance: {
        ...prev.workout_performance,
        [key]: numValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const cleanFormData = {
        ...formData,
        measurements: Object.fromEntries(
          Object.entries(formData.measurements || {}).filter(([_, v]) => v !== undefined)
        ),
        workout_performance: Object.fromEntries(
          Object.entries(formData.workout_performance || {}).filter(([_, v]) => v !== undefined)
        )
      };
      
      if (isEditMode && progressId) {
        await updateProgressEntry(progressId, cleanFormData as ProgressUpdate);
        setSuccess('Progress entry updated successfully!');
      } else {
        await createProgressEntry(cleanFormData);
        setSuccess('Progress entry created successfully!');
        
        if (!isEditMode) {
          setFormData({
            weight: undefined,
            body_fat: undefined,
            measurements: {},
            workout_performance: {},
            energy_level: 5,
            mood: 5,
            sleep_quality: 5,
            notes: ''
          });
        }
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving progress entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress entry');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Physical Metrics
        </Typography>
        
        <Grid container spacing={3}>
          {MEASUREMENT_FIELDS.filter(field => field.category === 'physical').map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <TextField
                label={field.label}
                type="number"
                fullWidth
                value={formData[field.key as keyof ProgressCreate] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: field.unit ? (
                    <InputAdornment position="end">{field.unit}</InputAdornment>
                  ) : null,
                  inputProps: {
                    step: field.step || 1,
                    min: field.min,
                    max: field.max
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <StraightenIcon sx={{ mr: 1 }} />
          Body Measurements
        </Typography>
        
        <Grid container spacing={3}>
          {COMMON_MEASUREMENTS.map((field) => {
            const key = field.key.split('.')[1];
            const value = formData.measurements?.[key] || '';
            
            return (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <TextField
                  label={field.label}
                  type="number"
                  fullWidth
                  value={value}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  InputProps={{
                    endAdornment: field.unit ? (
                      <InputAdornment position="end">{field.unit}</InputAdornment>
                    ) : null,
                    inputProps: {
                      step: field.step || 1
                    }
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          Workout Performance
        </Typography>
        
        <Grid container spacing={3}>
          {COMMON_EXERCISES.map((field) => {
            const key = field.key.split('.')[1];
            const value = formData.workout_performance?.[key] || '';
            
            return (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <TextField
                  label={field.label}
                  type="number"
                  fullWidth
                  value={value}
                  onChange={(e) => handleWorkoutChange(key, e.target.value)}
                  InputProps={{
                    endAdornment: field.unit ? (
                      <InputAdornment position="end">{field.unit}</InputAdornment>
                    ) : null,
                    inputProps: {
                      step: field.step || 1
                    }
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <MoodIcon sx={{ mr: 1 }} />
          Subjective Metrics
        </Typography>
        
        <Grid container spacing={4}>
          {MEASUREMENT_FIELDS.filter(field => field.category === 'subjective').map((field) => (
            <Grid item xs={12} key={field.key}>
              <Typography gutterBottom>
                {field.label}: {formData[field.key as keyof ProgressCreate]}
              </Typography>
              <Slider
                value={formData[field.key as keyof ProgressCreate] || field.min || 1}
                onChange={(_, value) => handleInputChange(field.key, value as number)}
                min={field.min || 1}
                max={field.max || 10}
                step={field.step || 1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Notes
        </Typography>
        
        <TextField
          label="Notes"
          multiline
          rows={4}
          fullWidth
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes about your progress..."
        />
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Progress' : 'Save Progress'}
        </Button>
      </Box>
    </Box>
  );
}
