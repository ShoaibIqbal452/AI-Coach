import { ProgressCreate, ProgressEntry, ProgressList, ProgressTrend, ProgressUpdate } from '@/types/progress';
import { API_ENDPOINTS } from '@/config/constants';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Create a new progress entry
 */
export const createProgressEntry = async (progressData: ProgressCreate): Promise<ProgressEntry> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(progressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create progress entry');
  }

  return await response.json();
};

/**
 * Get all progress entries for the current user
 */
export const getProgressEntries = async (days?: number): Promise<ProgressList> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = days 
    ? `${API_URL}${API_ENDPOINTS.PROGRESS}?days=${days}` 
    : `${API_URL}${API_ENDPOINTS.PROGRESS}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch progress entries');
  }

  return await response.json();
};

/**
 * Get a specific progress entry by ID
 */
export const getProgressById = async (progressId: number): Promise<ProgressEntry> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS}/${progressId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch progress entry');
  }

  return await response.json();
};

/**
 * Update a progress entry
 */
export const updateProgressEntry = async (progressId: number, progressData: ProgressUpdate): Promise<ProgressEntry> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS}/${progressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(progressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update progress entry');
  }

  return await response.json();
};

/**
 * Delete a progress entry
 */
export const deleteProgressEntry = async (progressId: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS}/${progressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete progress entry');
  }

  return await response.json();
};

/**
 * Get trends for a specific metric
 */
export const getMetricTrends = async (metric: string, days: number = 90): Promise<ProgressTrend> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS}/trends/${metric}?days=${days}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch metric trends');
  }

  return await response.json();
};
