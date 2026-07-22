"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Exercise } from "@/lib/firestore-models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

// Mock data for form options - in a real app, this might come from an API
const allMuscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Abs", "Calves", "Glutes",
];
const allEquipment = [
  "Barbell", "Dumbbell", "Kettlebell", "Machine",
  "Bodyweight", "Bands", "Cables",
];
const allCategories = ["Strength", "Hypertrophy", "Cardio", "Flexibility"];

export default function NewExercisePage() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Partial<Exercise>>({
    name: "",
    description: "",
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: [],
    category: "Strength",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExercise((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setExercise((prev) => ({ ...prev, [name]: value }));
  };
  
    const handleEquipmentSelectChange = (value: string) => {
    setExercise((prev) => ({ ...prev, equipment: [value] }));
  };

  const handleMuscleGroupChange = (
    type: "primaryMuscles" | "secondaryMuscles",
    muscle: string
  ) => {
    const currentMuscles = exercise[type] || [];
    const newMuscles = currentMuscles.includes(muscle)
      ? currentMuscles.filter((m) => m !== muscle)
      : [...currentMuscles, muscle];
    setExercise((prev) => ({ ...prev, [type]: newMuscles }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!exercise.name || !exercise.primaryMuscles?.length) {
      alert("Please fill out at least the name and primary muscles.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise.");
      }

      alert("Exercise created successfully!");
      router.push("/exercises");
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the exercise.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Create New Exercise</h1>
        <p className="text-muted-foreground">
          Add a custom exercise to your library.
        </p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Input
              name="name"
              placeholder="Exercise Name (e.g., Bench Press)"
              value={exercise.name}
              onChange={handleInputChange}
              required
              className="text-lg"
            />
            <Textarea
              name="description"
              placeholder="Instructions and description..."
              value={exercise.description}
              onChange={handleInputChange}
              rows={8}
            />
            <Select
              name="category"
              onValueChange={(value) => handleSelectChange("category", value)}
              defaultValue={exercise.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select
              name="equipment"
              onValueChange={handleEquipmentSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {allEquipment.map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Primary Muscles</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {allMuscleGroups.map((muscle) => (
                  <div key={muscle} className="flex items-center gap-2">
                    <Checkbox
                      id={`primary-${muscle}`}
                      checked={exercise.primaryMuscles?.includes(muscle)}
                      onCheckedChange={() =>
                        handleMuscleGroupChange("primaryMuscles", muscle)
                      }
                    />
                    <label htmlFor={`primary-${muscle}`}>{muscle}</label>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secondary Muscles</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {allMuscleGroups.map((muscle) => (
                  <div key={muscle} className="flex items-center gap-2">
                    <Checkbox
                      id={`secondary-${muscle}`}
                      checked={exercise.secondaryMuscles?.includes(muscle)}
                      onCheckedChange={() =>
                        handleMuscleGroupChange("secondaryMuscles", muscle)
                      }
                    />
                    <label htmlFor={`secondary-${muscle}`}>{muscle}</label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      </form>
    </div>
  );
}
