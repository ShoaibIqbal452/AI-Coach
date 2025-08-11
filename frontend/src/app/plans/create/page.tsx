'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { 
  Box, 
  Typography, 
  Stack, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ExerciseItem {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

interface MealItem {
  name: string;
  calories: string;
  ingredients: string;
  notes: string;
}

export default function CreatePlanPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'workout' | 'diet'>('workout');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState<ExerciseItem>({
    name: '',
    sets: 3,
    reps: '10-12',
    notes: ''
  });

  const [newMeal, setNewMeal] = useState<MealItem>({
    name: '',
    calories: '',
    ingredients: '',
    notes: ''
  });

  const handleAddExercise = () => {
    if (!newExercise.name) {
      setError('Please enter an exercise name');
      return;
    }
    
    setExercises([...exercises, { ...newExercise }]);
    setNewExercise({
      name: '',
      sets: 3,
      reps: '10-12',
      notes: ''
    });
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  const handleAddMeal = () => {
    if (!newMeal.name) {
      setError('Please enter a meal name');
      return;
    }
    
    setMeals([...meals, { ...newMeal }]);
    setNewMeal({
      name: '',
      calories: '',
      ingredients: '',
      notes: ''
    });
  };

  const handleRemoveMeal = (index: number) => {
    const updatedMeals = [...meals];
    updatedMeals.splice(index, 1);
    setMeals(updatedMeals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your plan');
      return;
    }
    
    if (type === 'workout' && exercises.length === 0) {
      setError('Please add at least one exercise to your workout plan');
      return;
    }
    
    if (type === 'diet' && meals.length === 0) {
      setError('Please add at least one meal to your diet plan');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const formattedContent = formatPlanContent();
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/plans/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          content: formattedContent,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create plan');
      }
      
      setSuccess('Plan created successfully!');
      
      setTimeout(() => {
        router.push(`/plans/${data.id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatPlanContent = (): string => {
    let content = `# ${title}\n\n`;
    
    if (description) {
      content += `${description}\n\n`;
    }
    
    if (type === 'workout') {
      content += `## Workout Plan\n\n`;
      
      exercises.forEach((exercise, index) => {
        content += `### ${index + 1}. ${exercise.name}\n`;
        content += `- Sets: ${exercise.sets}\n`;
        content += `- Reps: ${exercise.reps}\n`;
        if (exercise.notes) {
          content += `- Notes: ${exercise.notes}\n`;
        }
        content += '\n';
      });
    } else {
      content += `## Diet Plan\n\n`;
      
      meals.forEach((meal, index) => {
        content += `### ${index + 1}. ${meal.name}\n`;
        if (meal.calories) {
          content += `- Calories: ${meal.calories}\n`;
        }
        if (meal.ingredients) {
          content += `- Ingredients: ${meal.ingredients}\n`;
        }
        if (meal.notes) {
          content += `- Notes: ${meal.notes}\n`;
        }
        content += '\n';
      });
    }
    
    return content;
  };

  return (
    <MainLayout>
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={3000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      
      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
        <Button 
          variant="outline" 
          onClick={() => router.push('/plans')}
          sx={{ mb: 2 }}
        >
          ← Back to Plans
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New {type === 'workout' ? 'Workout' : 'Diet'} Plan</CardTitle>
          </CardHeader>
          <Divider />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Plan Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                
                <FormControl fullWidth>
                  <InputLabel id="plan-type-label">Plan Type</InputLabel>
                  <Select
                    labelId="plan-type-label"
                    value={type}
                    label="Plan Type"
                    onChange={(e) => setType(e.target.value as 'workout' | 'diet')}
                  >
                    <MenuItem value="workout">Workout Plan</MenuItem>
                    <MenuItem value="diet">Diet Plan</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description of your plan"
                />
                
                {type === 'workout' ? (
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Exercises
                    </Typography>
                    
                    {exercises.length > 0 && (
                      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <List>
                          {exercises.map((exercise, index) => (
                            <ListItem 
                              key={index}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveExercise(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemIcon>
                                <FitnessCenterIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={exercise.name}
                                secondary={
                                  <>
                                    <Typography component="span" variant="body2">
                                      {`${exercise.sets} sets × ${exercise.reps} reps`}
                                    </Typography>
                                    {exercise.notes && (
                                      <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                        Note: {exercise.notes}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                    
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Add New Exercise
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          label="Exercise Name"
                          fullWidth
                          value={newExercise.name}
                          onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                          placeholder="e.g., Bench Press"
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            label="Sets"
                            type="number"
                            InputProps={{ inputProps: { min: 1 } }}
                            value={newExercise.sets}
                            onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 1})}
                            sx={{ width: '50%' }}
                          />
                          <TextField
                            label="Reps"
                            value={newExercise.reps}
                            onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                            placeholder="e.g., 10-12 or 5"
                            sx={{ width: '50%' }}
                          />
                        </Box>
                        <TextField
                          label="Notes"
                          fullWidth
                          multiline
                          rows={2}
                          value={newExercise.notes}
                          onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
                          placeholder="Optional notes about this exercise"
                        />
                        <Button 
                          variant="outline" 
                          onClick={handleAddExercise}
                          startIcon={<AddIcon />}
                        >
                          Add Exercise
                        </Button>
                      </Stack>
                    </Paper>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Meals
                    </Typography>
                    
                    {meals.length > 0 && (
                      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <List>
                          {meals.map((meal, index) => (
                            <ListItem 
                              key={index}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveMeal(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemIcon>
                                <RestaurantIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={meal.name}
                                secondary={
                                  <>
                                    {meal.calories && (
                                      <Typography component="span" variant="body2">
                                        Calories: {meal.calories}
                                      </Typography>
                                    )}
                                    {meal.ingredients && (
                                      <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                        Ingredients: {meal.ingredients}
                                      </Typography>
                                    )}
                                    {meal.notes && (
                                      <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                        Note: {meal.notes}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                    
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Add New Meal
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          label="Meal Name"
                          fullWidth
                          value={newMeal.name}
                          onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                          placeholder="e.g., Breakfast"
                        />
                        <TextField
                          label="Calories"
                          value={newMeal.calories}
                          onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                          placeholder="e.g., 500 kcal"
                        />
                        <TextField
                          label="Ingredients"
                          fullWidth
                          multiline
                          rows={2}
                          value={newMeal.ingredients}
                          onChange={(e) => setNewMeal({...newMeal, ingredients: e.target.value})}
                          placeholder="List the ingredients"
                        />
                        <TextField
                          label="Notes"
                          fullWidth
                          multiline
                          rows={2}
                          value={newMeal.notes}
                          onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})}
                          placeholder="Optional notes about this meal"
                        />
                        <Button 
                          variant="outline" 
                          onClick={handleAddMeal}
                          startIcon={<AddIcon />}
                        >
                          Add Meal
                        </Button>
                      </Stack>
                    </Paper>
                  </>
                )}
                
                <CardFooter sx={{ p: 0, pt: 2 }}>
                  <Button 
                    variant="default" 
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ minWidth: 120 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Create Plan'}
                  </Button>
                </CardFooter>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
