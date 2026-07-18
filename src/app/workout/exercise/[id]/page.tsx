"use client";

import { useState, useEffect } from "react";
import { Exercise, UserLog } from "@/lib/firestore-models";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";

type SetLog = {
  reps: number;
  weight: number;
  notes?: string;
};

export default function LiveWorkoutPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  // State for the logging form, now using numbers
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(20);
  const [loggedSets, setLoggedSets] = useState<SetLog[]>([]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) throw new Error("Exercise not found");
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
        setExercise(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExercise();
  }, [id]);

  const handleLogSet = () => {
    const newSet: SetLog = { reps, weight };
    setLoggedSets([...loggedSets, newSet]);
  };
  
  const handleFinishExercise = async () => {
    // Save the last log if it's not empty
    if (loggedSets.length > 0) {
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        console.log('[Mock Mode] Pretending to save exercise log:', { userId: user?.uid, exerciseId: exercise?.id!, date: new Date(), sets: loggedSets });
      } else if (user) {
        try {
          const userLog: Omit<UserLog, "id" | "workoutId"> = { userId: user.uid, exerciseId: exercise?.id!, date: new Date(), sets: loggedSets };
          await addDoc(collection(db, "user-logs"), userLog);
        } catch (e) { console.error("Error adding document: ", e); }
      }
    }
    router.push("/workout");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!exercise) return <div className="flex items-center justify-center min-h-screen">Exercise not found.</div>;

  const getYouTubeID = (url: string) => url.split('v=')[1]?.substring(0, 11) || '';
  const videoId = getYouTubeID(exercise.videoUrl);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-background text-foreground overflow-y-auto">
      {/* Background Video */}
      {videoId && (
        <div className="absolute top-0 left-0 w-full h-1/2 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`}
            title={exercise.name}
            className="w-full h-full object-cover"
            allow="autoplay; encrypted-media"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="pt-24 text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-bold">{exercise.name}</motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground">{exercise.targetMuscleGroup}</motion.p>
        </div>

        {/* Logging UI */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-8">
          {/* Reps */}
          <div className="text-center">
            <label className="text-sm text-muted-foreground">REPS</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setReps(r => Math.max(0, r - 1))} className="p-4 rounded-full bg-secondary"><Minus className="h-6 w-6" /></button>
              <span className="text-6xl font-bold w-24 text-center">{reps}</span>
              <button onClick={() => setReps(r => r + 1)} className="p-4 rounded-full bg-secondary"><Plus className="h-6 w-6" /></button>
            </div>
          </div>
          {/* Weight */}
          <div className="text-center">
            <label className="text-sm text-muted-foreground">WEIGHT (KG)</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setWeight(w => Math.max(0, w - 2.5))} className="p-4 rounded-full bg-secondary"><Minus className="h-6 w-6" /></button>
              <span className="text-6xl font-bold w-24 text-center">{weight}</span>
              <button onClick={() => setWeight(w => w + 2.5)} className="p-4 rounded-full bg-secondary"><Plus className="h-6 w-6" /></button>
            </div>
          </div>
        </div>

        {/* Log Set Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleLogSet}
            whileTap={{ scale: 0.95 }}
            className="w-48 h-16 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full text-lg font-semibold"
          >
            <Check className="h-6 w-6" /> Log Set
          </motion.button>
        </div>

         {/* Logged Sets & Finish Button */}
        <div className="mt-auto pt-8">
           <div className="h-24 overflow-y-auto text-center text-sm space-y-1">
             <AnimatePresence>
              {loggedSets.map((set, index) => (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={index} className="text-muted-foreground">
                  Set {index + 1}: {set.reps} reps at {set.weight} kg
                </motion.p>
              ))}
             </AnimatePresence>
           </div>
          <button onClick={handleFinishExercise} className="w-full mt-4 p-4 font-semibold bg-secondary text-secondary-foreground rounded-lg">Finish Exercise</button>
        </div>
      </div>
    </motion.div>
  );
}
