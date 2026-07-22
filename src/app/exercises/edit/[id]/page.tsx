"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

// Mock data for form options
const allMuscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Abs", "Calves", "Glutes",
];
const allEquipment = [
  "Barbell", "Dumbbell", "Kettlebell", "Machine",
  "Bodyweight", "Bands", "Cables",
];
const allCategories = ["Strength", "Hypertrophy", "Cardio", "Flexibility"];

export default function EditExercisePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [exercise, setExercise] = useState<Partial<Exercise> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exercise data.");
        }
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load exercise data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExercise((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setExercise((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleEquipmentSelectChange = (value: string) => {
    setExercise((prev) => (prev ? { ...prev, equipment: [value] } : null));
  };

  const handleMuscleGroupChange = (
    type: "primaryMuscles" | "secondaryMuscles",
    muscle: string
  ) => {
    if (!exercise) return;
    const currentMuscles = exercise[type] || [];
    const newMuscles = currentMuscles.includes(muscle)
      ? currentMuscles.filter((m) => m !== muscle)
      : [...currentMuscles, muscle];
    setExercise((prev) => (prev ? { ...prev, [type]: newMuscles } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;
    setIsSubmitting(true);
    
    if (!exercise.name || !exercise.primaryMuscles?.length) {
      alert("Please fill out at least the name and primary muscles.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        throw new Error("Failed to update exercise.");
      }

      alert("Exercise updated successfully!");
      router.push("/exercises");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the exercise.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-8">Loading exercise form...</p>;
  }

  if (!exercise) {
    return <p className="p-8">Could not load exercise data to edit.</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Edit Exercise</h1>
        <p className="text-muted-foreground">
          Update the details for your custom exercise.
        </p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Input
              name="name"
              placeholder="Exercise Name"
              value={exercise.name || ""}
              onChange={handleInputChange}
              required
              className="text-lg"
            />
            <Textarea
              name="description"
              placeholder="Instructions..."
              value={exercise.description || ""}
              onChange={handleInputChange}
              rows={8}
            />
            <Select
              name="category"
              onValueChange={(value) => handleSelectChange("category", value)}
              value={exercise.category}
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
              value={exercise.equipment ? exercise.equipment[0] : ""}
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
            {isSubmitting ? "Updating..." : "Update Exercise"}
          </Button>
        </div>
      </form>
    </div>
  );
}
