"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Exercise, UserPreferences } from "@/lib/firestore-models";
import {
  generateWorkout,
  getWorkoutTypesForSplit,
  workoutSplits,
} from "@/lib/workout-generator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthProvider";

export default function WorkoutPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [workout, setWorkout] = useState<Exercise[]>([]);
  const [workoutType, setWorkoutType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data (all exercises and user preferences)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [exercisesResponse, prefsResponse] = await Promise.all([
          fetch("/api/exercises"),
          fetch("/api/user/preferences"),
        ]);
        const exercisesData = await exercisesResponse.json();
        const prefsData = await prefsResponse.json();
        
        setAllExercises(exercisesData);
        setPreferences(prefsData.preferences);

        // Set default workout type
        if (prefsData.preferences) {
          const availableTypes = getWorkoutTypesForSplit(prefsData.preferences.workoutSplit);
          setWorkoutType(availableTypes[0]);
        }

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  // Generate workout when workoutType changes
  useEffect(() => {
    if (preferences && allExercises.length > 0 && workoutType) {
      const muscleGroups = (workoutSplits[preferences.workoutSplit] as any)[workoutType];
      const newWorkout = generateWorkout(
        allExercises,
        preferences.availableEquipment,
        muscleGroups
      );
      setWorkout(newWorkout);
    }
  }, [preferences, allExercises, workoutType]);
  
  const handleGenerateWorkout = () => {
     if (preferences && allExercises.length > 0 && workoutType) {
      const muscleGroups = (workoutSplits[preferences.workoutSplit] as any)[workoutType];
      const newWorkout = generateWorkout(
        allExercises,
        preferences.availableEquipment,
        muscleGroups
      );
      setWorkout(newWorkout);
    }
  };


  if (loading) {
    return <p className="p-8">Loading your workout dashboard...</p>;
  }

  if (!preferences) {
    return <p className="p-8">Please set your preferences in your profile first!</p>;
  }
  
  const workoutTypes = getWorkoutTypesForSplit(preferences.workoutSplit);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Daily Workout</h1>
        <p className="text-muted-foreground">
          Here is a workout generated based on your preferences.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
         <Select onValueChange={setWorkoutType} defaultValue={workoutType || undefined}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Workout" />
          </SelectTrigger>
          <SelectContent>
            {workoutTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
  
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateWorkout} className="w-full md:w-auto">
          Regenerate Workout
        </Button>
      </div>

      {workout.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workout.map((exercise) => (
             <Link key={exercise.id} href={`/workout/exercise/${exercise.id}`}>
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {exercise.primaryMuscles.join(', ')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>Could not generate a workout. Try adjusting your preferences or equipment.</p>
      )}
    </div>
  );
}
