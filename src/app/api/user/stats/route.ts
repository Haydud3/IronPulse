import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserStats } from "@/lib/firestore-models";

async function getUserId() {
  return "mock-user-id";
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statsRef = doc(db, "userStats", userId);
    const docSnap = await getDoc(statsRef);

    let stats: UserStats;
    if (docSnap.exists()) {
      stats = docSnap.data() as UserStats;
    } else {
      stats = { userId, muscleRecovery: {}, progressiveOverload: {} };
    }

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
