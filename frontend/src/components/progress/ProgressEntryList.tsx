import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ProgressEntry, MEASUREMENT_FIELDS } from '@/types/progress';
import { deleteProgressEntry } from '@/services/progressService';
import { format } from 'date-fns';

interface ProgressEntryListProps {
  entries: ProgressEntry[];
  onRefresh: () => void;
}

export default function ProgressEntryList({ entries, onRefresh }: ProgressEntryListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleViewEntry = (entry: ProgressEntry) => {
    router.push(`/progress/${entry.id}`);
  };

  const handleEditEntry = (entry: ProgressEntry) => {
    router.push(`/progress/edit/${entry.id}`);
  };

  const handleDeleteClick = (entry: ProgressEntry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEntry) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteProgressEntry(selectedEntry.id);
      setDeleteDialogOpen(false);
      setSelectedEntry(null);
      onRefresh();
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

  const getMetricValue = (entry: ProgressEntry, key: string) => {
    if (key === 'weight' && entry.weight !== undefined) {
      return `${entry.weight} kg`;
    } else if (key === 'body_fat' && entry.body_fat !== undefined) {
      return `${entry.body_fat}%`;
    } else if (key === 'energy_level' && entry.energy_level !== undefined) {
      return `${entry.energy_level}/10`;
    } else if (key === 'mood' && entry.mood !== undefined) {
      return `${entry.mood}/10`;
    } else if (key === 'sleep_quality' && entry.sleep_quality !== undefined) {
      return `${entry.sleep_quality}/10`;
    }
    return null;
  };

  const getEntryHighlights = (entry: ProgressEntry) => {
    const highlights = [];
    
    for (const field of MEASUREMENT_FIELDS) {
      const value = getMetricValue(entry, field.key);
      if (value) {
        highlights.push({ label: field.label, value });
      }
    }
    
    if (entry.measurements && Object.keys(entry.measurements).length > 0) {
      highlights.push({ 
        label: 'Measurements', 
        value: `${Object.keys(entry.measurements).length} recorded` 
      });
    }
    
    if (entry.workout_performance && Object.keys(entry.workout_performance).length > 0) {
      highlights.push({ 
        label: 'Workout Performance', 
        value: `${Object.keys(entry.workout_performance).length} exercises` 
      });
    }
    
    return highlights;
  };

  return (
    <Box>
      {entries.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No progress entries found.
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {entries.map((entry) => {
            const highlights = getEntryHighlights(entry);
            
            return (
              <Paper 
                key={entry.id} 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="view"
                        onClick={() => handleViewEntry(entry)}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => handleEditEntry(entry)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteClick(entry)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {formatDate(entry.date)}
                      </Typography>
                    }
                    secondary={
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {highlights.map((highlight, index) => (
                          <Grid item key={index}>
                            <Chip 
                              label={`${highlight.label}: ${highlight.value}`} 
                              variant="outlined" 
                              size="small"
                            />
                          </Grid>
                        ))}
                        {entry.notes && (
                          <Grid item xs={12}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                mt: 1,
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                              }}
                            >
                              {entry.notes}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    }
                  />
                </ListItem>
              </Paper>
            );
          })}
        </List>
      )}

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
    </Box>
  );
}
