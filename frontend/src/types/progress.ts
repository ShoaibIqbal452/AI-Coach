export interface ProgressEntry {
  id: number;
  user_id: number;
  date: string;
  weight?: number;
  body_fat?: number;
  measurements?: Record<string, number>;
  workout_performance?: Record<string, number>;
  energy_level?: number;
  mood?: number;
  sleep_quality?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressCreate {
  weight?: number;
  body_fat?: number;
  measurements?: Record<string, number>;
  workout_performance?: Record<string, number>;
  energy_level?: number;
  mood?: number;
  sleep_quality?: number;
  notes?: string;
}

export interface ProgressUpdate extends ProgressCreate {}

export interface ProgressList {
  progress: ProgressEntry[];
}

export interface ProgressTrendData {
  date: string;
  value: number;
}

export interface ProgressTrend {
  metric: string;
  data: ProgressTrendData[];
  change?: number;
  period_days: number;
}

export type MeasurementType = 'weight' | 'body_fat' | 'energy_level' | 'mood' | 'sleep_quality' | string;

export interface MeasurementField {
  key: MeasurementType;
  label: string;
  unit?: string;
  type: 'number' | 'slider';
  min?: number;
  max?: number;
  step?: number;
  category?: 'physical' | 'performance' | 'subjective' | 'custom';
}

export const MEASUREMENT_FIELDS: MeasurementField[] = [
  { key: 'weight', label: 'Weight', unit: 'kg', type: 'number', step: 0.1, category: 'physical' },
  { key: 'body_fat', label: 'Body Fat', unit: '%', type: 'number', step: 0.1, category: 'physical' },
  { key: 'energy_level', label: 'Energy Level', type: 'slider', min: 1, max: 10, step: 1, category: 'subjective' },
  { key: 'mood', label: 'Mood', type: 'slider', min: 1, max: 10, step: 1, category: 'subjective' },
  { key: 'sleep_quality', label: 'Sleep Quality', type: 'slider', min: 1, max: 10, step: 1, category: 'subjective' },
];

export const COMMON_MEASUREMENTS: MeasurementField[] = [
  { key: 'measurement.chest', label: 'Chest', unit: 'cm', type: 'number', step: 0.1, category: 'physical' },
  { key: 'measurement.waist', label: 'Waist', unit: 'cm', type: 'number', step: 0.1, category: 'physical' },
  { key: 'measurement.hips', label: 'Hips', unit: 'cm', type: 'number', step: 0.1, category: 'physical' },
  { key: 'measurement.thighs', label: 'Thighs', unit: 'cm', type: 'number', step: 0.1, category: 'physical' },
  { key: 'measurement.arms', label: 'Arms', unit: 'cm', type: 'number', step: 0.1, category: 'physical' },
];

export const COMMON_EXERCISES: MeasurementField[] = [
  { key: 'workout.bench_press', label: 'Bench Press', unit: 'kg', type: 'number', step: 1, category: 'performance' },
  { key: 'workout.squat', label: 'Squat', unit: 'kg', type: 'number', step: 1, category: 'performance' },
  { key: 'workout.deadlift', label: 'Deadlift', unit: 'kg', type: 'number', step: 1, category: 'performance' },
  { key: 'workout.pull_ups', label: 'Pull-ups', unit: 'reps', type: 'number', step: 1, category: 'performance' },
  { key: 'workout.push_ups', label: 'Push-ups', unit: 'reps', type: 'number', step: 1, category: 'performance' },
];

export interface ProgressInsight {
  title: string;
  description: string;
}

export interface ProgressRecommendation {
  title: string;
  description: string;
}

export interface PlanAdjustment {
  workout?: string[];
  diet?: string[];
}

export interface ProgressAnalysis {
  success: boolean;
  message?: string;
  analysis_summary?: string;
  insights: ProgressInsight[];
  recommendations: ProgressRecommendation[];
  plan_adjustments?: PlanAdjustment;
}

export interface AdaptivePlanRequest {
  plan_type: string;
  original_plan_id?: number;
}

export interface AdaptivePlanResponse {
  success: boolean;
  message?: string;
  plan?: any;
}
