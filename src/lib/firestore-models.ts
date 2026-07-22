export interface Exercise {
  id: string; // WGER id or our own UUID
  name: string;
  description: string; // HTML content from WGER
  primaryMuscles: string[]; // e.g., ['Chest', 'Shoulders']
  secondaryMuscles: string[]; // e.g., ['Triceps']
  equipment: string[]; // e.g., ['Barbell', 'Dumbbell']
  category: string; // e.g., 'Strength'
  videoUrl?: string; // A direct link to a demonstration video
  thumbnailUrl?: string; // A preview image
}

export interface UserPreferences {
  workoutSplit: 'full-body' | 'upper-lower' | 'ppl' | 'body-part';
  availableEquipment: string[]; // Matches the 'equipment' field in the Exercise model
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
