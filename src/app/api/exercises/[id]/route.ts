import { NextResponse } from "next/server";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 });
    }

    const exerciseRef = doc(db, "exercises", id);
    const docSnap = await getDoc(exerciseRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const exercise = { id: docSnap.id, ...docSnap.data() };
    return NextResponse.json(exercise);

  } catch (error) {
    console.error(`Error fetching exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 });
    }

    const exerciseRef = doc(db, "exercises", id);
    await deleteDoc(exerciseRef);

    return NextResponse.json({ message: "Exercise deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 });
    }

    const updatedExercise = await req.json();
    const exerciseRef = doc(db, "exercises", id);
    await updateDoc(exerciseRef, updatedExercise);

    return NextResponse.json({ message: "Exercise updated successfully" }, { status: 200 });

  } catch (error) {
    console.error(`Error updating exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}
