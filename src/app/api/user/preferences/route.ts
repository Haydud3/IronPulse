import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

// Mock implementation for getting user.
// In a real app, this would involve validating a session cookie or auth token.
async function getUserId() {
  // For now, we'll use a hardcoded mock user ID.
  // This should be replaced with actual auth handling.
  return "mock-user-id";
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefRef = doc(db, "userPreferences", userId);
    const docSnap = await getDoc(prefRef);

    let preferences;
    if (docSnap.exists()) {
      preferences = docSnap.data();
    } else {
      // Default preferences
      preferences = {
        workoutSplit: 'full-body',
        availableEquipment: ['Bodyweight', 'Dumbbell'],
      };
    }

    // Also return all possible equipment choices
    // For now, hardcoding a list. A better approach would be to get this from the exercises collection.
    const allEquipment = ['Barbell', 'Dumbbell', 'Kettlebell', 'Machine', 'Bodyweight', 'Cables', 'Bands'];

    return NextResponse.json({ preferences, allEquipment });

  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { preferences } = body;

    if (!preferences || !preferences.workoutSplit || !preferences.availableEquipment) {
      return NextResponse.json({ error: "Invalid preferences data" }, { status: 400 });
    }

    const prefRef = doc(db, "userPreferences", userId);
    await setDoc(prefRef, preferences);

    return NextResponse.json({ message: "Preferences updated successfully" });

  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}
