export interface Exercise {
  id?: string;
  name: string;
  targetMuscleGroup: string;
  videoUrl: string;
  description: string;
}

export interface Workout {
  id?: string;
  userId: string;
  date: Date;
  exercises: Exercise[];
}

export interface UserLog {
  id?: string;
  userId: string;
  exerciseId: string;
  workoutId: string;
  date: Date;
  sets: {
    reps: number;
    weight: number;
    notes?: string;
  }[];
}

export interface UserStats {
  userId: string;
  muscleRecovery: {
    [muscleGroup: string]: Date; // Date of last workout for this muscle group
  };
  progressiveOverload: {
    [exerciseId: string]: {
      lastWeight: number;
      recommendedWeight: number;
    };
  };
}
