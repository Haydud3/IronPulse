"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Exercise } from "@/lib/firestore-models";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Pencil, Video } from "lucide-react";

const ExerciseBrowser = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/exercises");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleDelete = async (exerciseId: string) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        const response = await fetch(`/api/exercises/${exerciseId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete exercise.");
        }
        setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
        setSelectedExercise(null); // Close the dialog
        alert("Exercise deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the exercise.");
      }
    }
  };

  const muscleGroups = useMemo(() => {
    const allMuscles = exercises.flatMap((ex) => ex.primaryMuscles).filter(Boolean);
    return ["all", ...Array.from(new Set(allMuscles))];
  }, [exercises]);

  const equipment = useMemo(() => {
    const allEquipment = exercises
      .flatMap((ex) => ex.equipment)
      .filter(Boolean);
    return ["all", ...Array.from(new Set(allEquipment))];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMuscle =
        selectedMuscle === "all" || ex.primaryMuscles?.includes(selectedMuscle);
      const matchesEquipment =
        selectedEquipment === "all" ||
        ex.equipment?.includes(selectedEquipment);
      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [exercises, searchTerm, selectedMuscle, selectedEquipment]);

  return (
    <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
      <div className="p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Exercise Library
            </h1>
            <p className="text-muted-foreground">
              Browse, search, and filter all available exercises.
            </p>
          </div>
          <Link href="/exercises/new">
            <Button>Add New Exercise</Button>
          </Link>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search exercises..."
            className="w-full md:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by muscle" />
            </SelectTrigger>
            <SelectContent>
              {muscleGroups.map((muscle) => (
                <SelectItem key={muscle} value={muscle}>
                  {typeof muscle === 'string' && muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by equipment" />
            </SelectTrigger>
            <SelectContent>
              {equipment.map((equip) => (
                <SelectItem key={equip} value={equip}>
                  {typeof equip === 'string' && equip.charAt(0).toUpperCase() + equip.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading exercises...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredExercises.map((exercise) => (
              <DialogTrigger asChild key={exercise.id} onClick={() => setSelectedExercise(exercise)}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>{exercise.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {exercise.primaryMuscles?.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Equipment: {exercise.equipment?.join(", ")}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            ))}
          </div>
        )}
        {filteredExercises.length === 0 && !loading && (
          <p>No exercises match your criteria.</p>
        )}
      </div>

      <DialogContent className="sm:max-w-[600px]">
        {selectedExercise && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedExercise.name}</DialogTitle>
              <DialogDescription>
                {selectedExercise.primaryMuscles?.join(", ")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center bg-muted/50 aspect-video rounded-lg">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <div dangerouslySetInnerHTML={{ __html: selectedExercise.description }} className="prose dark:prose-invert max-w-none text-sm" />
              </div>
            </div>
            <DialogFooter className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedExercise(null)}>Close</Button>
              <Link href={`/exercises/edit/${selectedExercise.id}`}>
                <Button variant="ghost">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => handleDelete(selectedExercise.id)}>
                <X className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseBrowser;
