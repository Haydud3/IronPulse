import { UserLog, UserStats } from "./firestore-models";
import _ from 'lodash';

const WEIGHT_INCREASE_AMOUNT = 5; // e.g., 5 lbs or 2.5 kg
const REP_THRESHOLD = 5; // The minimum number of reps to trigger a weight increase

export function updateUserStats(
  allUserLogs: UserLog[],
  currentUserStats: UserStats
): UserStats {
  
  // Group logs by exercise
  const logsByExercise = _.groupBy(allUserLogs, 'exerciseId');

  const newProgressiveOverload = { ...currentUserStats.progressiveOverload };

  for (const exerciseId in logsByExercise) {
    const exerciseLogs = logsByExercise[exerciseId];
    
    // Get the most recent log for this exercise
    const latestLog = _.orderBy(exerciseLogs, 'date', 'desc')[0];

    if (!latestLog || latestLog.sets.length === 0) {
      continue;
    }

    // Check if all sets in the latest log are above the rep threshold
    const allSetsAboveThreshold = latestLog.sets.every(set => set.reps >= REP_THRESHOLD);
    const lastWeight = latestLog.sets[0].weight;

    if (allSetsAboveThreshold) {
      // If so, recommend a weight increase
      newProgressiveOverload[exerciseId] = {
        lastWeight: lastWeight,
        recommendedWeight: lastWeight + WEIGHT_INCREASE_AMOUNT,
      };
    } else {
      // Otherwise, recommend the same weight
      newProgressiveOverload[exerciseId] = {
        lastWeight: lastWeight,
        recommendedWeight: lastWeight,
      };
    }
  }

  return {
    ...currentUserStats,
    progressiveOverload: newProgressiveOverload,
  };
}
