export interface UserProfile {
  id?: number;
  user_id?: number;
  height?: number;
  weight?: number;
  age?: number;
  fitness_level?: string;
  fitness_goal?: string;
  dietary_preferences?: string;
  workout_preferences?: string;
  available_equipment?: string;
  health_conditions?: string;
}

export enum FitnessLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}

export enum FitnessGoal {
  WEIGHT_LOSS = "weight_loss",
  MUSCLE_GAIN = "muscle_gain",
  ENDURANCE = "endurance",
  GENERAL_FITNESS = "general_fitness",
  STRENGTH = "strength",
  FLEXIBILITY = "flexibility"
}

export const fitnessLevelOptions = [
  { value: FitnessLevel.BEGINNER, label: "Beginner" },
  { value: FitnessLevel.INTERMEDIATE, label: "Intermediate" },
  { value: FitnessLevel.ADVANCED, label: "Advanced" }
];

export const fitnessGoalOptions = [
  { value: FitnessGoal.WEIGHT_LOSS, label: "Weight Loss" },
  { value: FitnessGoal.MUSCLE_GAIN, label: "Muscle Gain" },
  { value: FitnessGoal.ENDURANCE, label: "Endurance" },
  { value: FitnessGoal.GENERAL_FITNESS, label: "General Fitness" },
  { value: FitnessGoal.STRENGTH, label: "Strength" },
  { value: FitnessGoal.FLEXIBILITY, label: "Flexibility" }
];
