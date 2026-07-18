import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  // Find the path to the JSON file
  const jsonDirectory = path.join(process.cwd(), 'data');
  // Read the JSON file
  const fileContents = await fs.readFile(jsonDirectory + '/exercises.json', 'utf8');
  // Parse the JSON file
  const exercises = JSON.parse(fileContents);

  const { searchParams } = new URL(request.url);
  const muscleGroup = searchParams.get('muscleGroup');

  if (muscleGroup) {
    const filteredExercises = exercises.filter(
      (exercise: any) => exercise.targetMuscleGroup.toLowerCase() === muscleGroup.toLowerCase()
    );
    return NextResponse.json(filteredExercises);
  }

  return NextResponse.json(exercises);
}
