import { API_ENDPOINTS } from '@/config/constants';
import { ProgressAnalysis, AdaptivePlanRequest, AdaptivePlanResponse } from '@/types/progress';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Get AI analysis of user progress data
 * @param days Number of days of progress data to analyze
 * @returns Promise with analysis results
 */
export const getProgressAnalysis = async (days: number = 30): Promise<ProgressAnalysis> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}${API_ENDPOINTS.PROGRESS_ANALYSIS}?days=${days}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to get progress analysis');
  }
  
  return response.json();
};

/**
 * Generate an adaptive plan based on user's progress data
 * @param request Plan generation request parameters
 * @returns Promise with the generated plan
 */
export const generateAdaptivePlan = async (request: AdaptivePlanRequest): Promise<AdaptivePlanResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}${API_ENDPOINTS.ADAPTIVE_PLAN}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate adaptive plan');
  }
  
  return response.json();
};
