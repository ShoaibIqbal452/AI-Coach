const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export interface Plan {
  id: number;
  user_id: number;
  type: string;
  content: string;
  created_at: string;
  title?: string;
}

export interface PlanAnalysis {
  analysis_id: string;
  plan_id: number;
  analysis: string;
  timestamp: string;
}

/**
 * Get a specific plan by ID
 */
export const getPlanById = async (planId: string | number): Promise<Plan> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/${planId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch plan');
  }

  return response.json();
};

/**
 * Get all plans for the current user
 */
export const getAllPlans = async (): Promise<Plan[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch plans');
  }

  const data = await response.json();
  return data.plans;
};

/**
 * Delete a plan by ID
 */
export const deletePlan = async (planId: string | number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/${planId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete plan');
  }

  return response.json();
};

/**
 * Analyze a plan using AI
 */
export const analyzePlan = async (planId: string | number): Promise<PlanAnalysis> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/${planId}/analyze`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze plan');
  }

  return response.json();
};

/**
 * Create a new plan
 */
export const createPlan = async (token: string, planData: { type: string; content: string }): Promise<Plan> => {
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(planData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create plan');
  }

  return response.json();
};

/**
 * Update an existing plan
 */
export const updatePlan = async (planId: string | number, planData: { title?: string; content?: string; type?: string }): Promise<Plan> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/plans/${planId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(planData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update plan');
  }

  return response.json();
};
