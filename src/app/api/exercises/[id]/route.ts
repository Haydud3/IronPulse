import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  const jsonDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(jsonDirectory + '/exercises.json', 'utf8');
  const exercises = JSON.parse(fileContents);

  const exercise = exercises.find((ex: any) => ex.id === id);

  if (exercise) {
    return NextResponse.json(exercise);
  } else {
    return new NextResponse('Exercise not found', { status: 404 });
  }
}
