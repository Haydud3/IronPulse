import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exercise } from "@/lib/firestore-models";

export async function GET() {
  try {
    const exercisesCollection = collection(db, "exercises");
    const snapshot = await getDocs(exercisesCollection);
    const exercises: Exercise[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      // The document ID is not part of the data, so we add it separately
      return {
        id: doc.id,
        ...data,
      } as Exercise;
    });
    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newExercise = await request.json();
    
    // Basic validation
    if (!newExercise.name || !newExercise.primaryMuscles) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exercisesCollection = collection(db, "exercises");
    const docRef = await addDoc(exercisesCollection, newExercise);

    return NextResponse.json({ id: docRef.id, ...newExercise }, { status: 201 });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}
