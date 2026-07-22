"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Exercise, UserLog, UserStats } from "@/lib/firestore-models";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Info } from "lucide-react";

type Set = { reps: number; weight: number; };

export default function ExercisePage() {
  const { user } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState<Set[]>([{ reps: 0, weight: 0 }]);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchExerciseData = async () => {
      setLoading(true);
      try {
        const [exerciseResponse, statsResponse] = await Promise.all([
          fetch(`/api/exercises/${id}`),
          fetch(`/api/user/stats`)
        ]);
        const exerciseData = await exerciseResponse.json();
        const statsData = await statsResponse.json();
        setExercise(exerciseData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch exercise data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && id) {
      fetchExerciseData();
    }
  }, [id, user]);

  const handleSetChange = (index: number, field: 'reps' | 'weight', value: string) => {
    const newSets = [...sets];
    newSets[index][field] = Number(value);
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { reps: 0, weight: 0 }]);
  };
  
  const handleLogWorkout = async () => {
    if (!user || !exercise || sets.every(s => s.reps === 0 || s.weight === 0)) {
       alert("Please enter at least one valid set (reps and weight > 0).");
       return;
    }
    
    const userLog = {
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets: sets.filter(s => s.reps > 0 && s.weight > 0),
    };
    
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLog),
      });

      if (!response.ok) {
        throw new Error('Failed to log workout.');
      }

      alert("Workout logged successfully!");
      setSets([{ reps: 0, weight: 0 }]);
      // Refetch stats to show new recommendation
      const statsResponse = await fetch(`/api/user/stats`);
      const statsData = await statsResponse.json();
      setStats(statsData);


    } catch (error) {
      console.error(error);
      alert("An error occurred while logging the workout.");
    }
  };

  if (loading) {
    return <p className="p-8">Loading exercise...</p>;
  }

  if (!exercise) {
    return <p className="p-8">Exercise not found.</p>;
  }

  const recommendation = stats?.progressiveOverload[exercise.id];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
            {exercise.primaryMuscles?.map(m => <span key={m} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">{m}</span>)}
            {exercise.secondaryMuscles?.map(m => <span key={m} className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm">{m}</span>)}
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <div dangerouslySetInnerHTML={{ __html: exercise.description }} className="prose dark:prose-invert max-w-none" />
        </div>
        
        <div className="flex flex-col gap-8">
          {recommendation && (
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                 <Info className="w-6 h-6 text-blue-500" />
                <CardTitle className="text-blue-900 dark:text-blue-300">Next Recommended Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                  {recommendation.recommendedWeight} lbs
                </p>
                <p className="text-sm text-muted-foreground">Last workout: {recommendation.lastWeight} lbs</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Log Your Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sets.map((set, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 items-center">
                    <span className="font-medium">Set {index + 1}</span>
                    <Input 
                      type="number" 
                      placeholder="Reps" 
                      value={set.reps || ''}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                    />
                    <Input 
                      type="number" 
                      placeholder="Weight" 
                      value={set.weight || ''}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                    />
                  </div>
                ))}
                <Button onClick={addSet} variant="outline">Add Set</Button>
                <Button onClick={handleLogWorkout}>Log Workout</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
