

export const MEASUREMENT_FIELDS = [
  { key: 'weight', label: 'Weight', unit: 'kg', category: 'physical', min: 30, max: 300, step: 0.1 },
  { key: 'body_fat', label: 'Body Fat', unit: '%', category: 'physical', min: 3, max: 50, step: 0.1 },
  { key: 'energy_level', label: 'Energy Level', category: 'subjective', min: 1, max: 10, step: 1 },
  { key: 'mood', label: 'Mood', category: 'subjective', min: 1, max: 10, step: 1 },
  { key: 'sleep_quality', label: 'Sleep Quality', category: 'subjective', min: 1, max: 10, step: 1 }
];

export const COMMON_MEASUREMENTS = [
  { key: 'measurements.chest', label: 'Chest', unit: 'cm', step: 0.5 },
  { key: 'measurements.waist', label: 'Waist', unit: 'cm', step: 0.5 },
  { key: 'measurements.hips', label: 'Hips', unit: 'cm', step: 0.5 },
  { key: 'measurements.biceps', label: 'Biceps', unit: 'cm', step: 0.5 },
  { key: 'measurements.thighs', label: 'Thighs', unit: 'cm', step: 0.5 },
  { key: 'measurements.calves', label: 'Calves', unit: 'cm', step: 0.5 }
];

export const COMMON_EXERCISES = [
  { key: 'workout.bench_press', label: 'Bench Press', unit: 'kg', step: 2.5 },
  { key: 'workout.squat', label: 'Squat', unit: 'kg', step: 2.5 },
  { key: 'workout.deadlift', label: 'Deadlift', unit: 'kg', step: 2.5 },
  { key: 'workout.pull_ups', label: 'Pull-ups', unit: 'reps', step: 1 },
  { key: 'workout.push_ups', label: 'Push-ups', unit: 'reps', step: 1 },
  { key: 'workout.running', label: 'Running', unit: 'km', step: 0.5 }
];

// Base API URL from environment variable with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// All API endpoints used in the application
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/auth/token',
  REGISTER: '/api/v1/auth/register',
  
  // Chat endpoints
  CHAT_SEND: '/api/v1/chat/send',
  CHAT_HISTORY: '/api/v1/chat/history',
  CHAT_MARK_PLAN: '/api/v1/chat/message',  // Append /{id}/mark-plan when using
  
  // Plan endpoints
  PLANS: '/api/v1/plans',  // Append /{id} when needed for specific plan
  
  // Profile endpoints
  PROFILES: '/api/v1/profiles',
  
  // Progress endpoints
  PROGRESS: '/api/v1/progress',
  PROGRESS_ANALYSIS: '/api/v1/progress/analysis',
  ADAPTIVE_PLAN: '/api/v1/progress/adaptive-plan'
};
