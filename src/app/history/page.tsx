"use client";

import { useState, useEffect } from "react";
import { UserLog } from "@/lib/firestore-models";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { groupBy } from "lodash";

type GroupedLogs = { [date: string]: UserLog[] };

// A type guard to check if the date is a Timestamp
function isTimestamp(date: any): date is Timestamp {
  return date && typeof date.toDate === 'function';
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [groupedLogs, setGroupedLogs] = useState<GroupedLogs>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchAndGroupLogs = async () => {
        setLoading(true);
        let userLogs: UserLog[] = [];

        if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
          console.log('[Mock Mode] Using mock data for history page.');
          userLogs = [
            { id: 'mock-1', userId: user.uid, workoutId: 'mock-workout-1', exerciseId: 'Bench Press', date: new Date('2024-01-15T10:00:00Z'), sets: [{ reps: 8, weight: 60, notes: "Felt good" }] },
            { id: 'mock-2', userId: user.uid, workoutId: 'mock-workout-1', exerciseId: 'Tricep Extension', date: new Date('2024-01-15T10:30:00Z'), sets: [{ reps: 12, weight: 20 }] },
            { id: 'mock-3', userId: user.uid, workoutId: 'mock-workout-2', exerciseId: 'Squat', date: new Date('2024-01-13T11:00:00Z'), sets: [{ reps: 10, weight: 100 }, { reps: 10, weight: 100 }] },
          ];
        } else {
          const q = query(
            collection(db, "user-logs"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
          );
          const querySnapshot = await getDocs(q);
          userLogs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              date: isTimestamp(data.date) ? data.date.toDate() : new Date() 
            } as UserLog
          });
        }

        const grouped = groupBy(userLogs, (log: UserLog) => new Date(log.date).toLocaleDateString());
        setGroupedLogs(grouped);
        setLoading(false);
      };
      fetchAndGroupLogs();
    }
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Loading history...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Review your past workout sessions.
        </p>
      </header>
      
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No workout history found.</p>
          <p className="text-sm">Complete a workout to see your progress here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle>{date}</CardTitle>
                <CardDescription>{logs.length} exercises performed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {logs.map(log => (
                  <div key={log.id} className="p-3 bg-secondary rounded-lg">
                    <h4 className="font-semibold">{log.exerciseId}</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {log.sets.map((set, index) => (
                        <li key={index}>
                          Set {index + 1}: {set.reps} reps at {set.weight} kg {set.notes ? `(${set.notes})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
