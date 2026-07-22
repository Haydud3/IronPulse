import { Exercise, UserPreferences } from "./firestore-models";
import _, { sample } from 'lodash';

// A map to define which muscle groups are targeted on which day for each split.
export const workoutSplits = {
  "full-body": {
    "Full Body": ["Chest", "Back", "Quadriceps", "Hamstrings", "Shoulders", "Biceps", "Triceps"],
  },
  "upper-lower": {
    "Upper": ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
    "Lower": ["Quadriceps", "Hamstrings", "Calves"],
  },
  "ppl": {
    "Push": ["Chest", "Shoulders", "Triceps"],
    "Pull": ["Back", "Biceps"],
    "Legs": ["Quadriceps", "Hamstrings", "Calves"],
  },
  "body-part": {
    "Chest": ["Chest"],
    "Back": ["Back"],
    "Legs": ["Quadriceps", "Hamstrings", "Calves"],
    "Shoulders": ["Shoulders"],
    "Arms": ["Biceps", "Triceps"],
  },
};

// A helper function to get the possible workout types for a given split
export const getWorkoutTypesForSplit = (split: UserPreferences['workoutSplit']) => {
  return Object.keys(workoutSplits[split]);
};


// Main function to generate a workout
export function generateWorkout(
  allExercises: Exercise[],
  availableEquipment: string[],
  muscleGroups: string[],
  numberOfExercises: number = 5
): Exercise[] {
  
  // Filter exercises that match the muscle groups and available equipment
  const eligibleExercises = allExercises.filter(exercise => {
    const targetsPrimaryMuscle = exercise.primaryMuscles.some(muscle => muscleGroups.includes(muscle));
    
    // An exercise is usable if it requires no equipment, or if the user has at least one of the required pieces of equipment.
    const hasRequiredEquipment = exercise.equipment.length === 0 || exercise.equipment.some(eq => availableEquipment.includes(eq) || eq === 'Bodyweight');

    return targetsPrimaryMuscle && hasRequiredEquipment;
  });

  // For now, a simple random selection of exercises.
  // A more advanced implementation would balance compound vs isolation, etc.
  return _.sampleSize(eligibleExercises, numberOfExercises);
}
