import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/lib/firebase';
import { collection, getDocs, writeBatch, deleteDoc, doc } from 'firebase/firestore';
import type { Exercise } from '../src/lib/firestore-models';

const WGER_API_URL = 'https://wger.de/api/v2';

interface WgerApiResponse {
  results: any[];
  next: string | null;
}

// Helper function to clear a collection
async function clearCollection(collectionPath: string) {
  const collectionRef = collection(db, collectionPath);
  const snapshot = await getDocs(collectionRef);
  
  if (snapshot.empty) {
    console.log(`Collection ${collectionPath} is already empty.`);
    return;
  }

  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Successfully cleared ${snapshot.size} documents from ${collectionPath}.`);
}


async function seedExercises() {
  try {
    // 1. Clear the existing 'exercises' collection
    console.log('Clearing existing exercises...');
    await clearCollection('exercises');

    // 2. Fetch all exercises from the WGER API
    let exercises: any[] = [];
    let nextUrl: string | null = `${WGER_API_URL}/exerciseinfo/?language=2&limit=100`; // language=2 is for English

    console.log('Fetching exercises from WGER API...');
    while (nextUrl) {
      const response: Response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data: WgerApiResponse = await response.json();
      exercises = exercises.concat(data.results);
      nextUrl = data.next;
      console.log(`Fetched ${data.results.length} exercises, next page: ${data.next}`);
    }
    console.log(`Total exercises fetched: ${exercises.length}`);

    // 3. Transform the API data into our Exercise model
    const mappedExercises = exercises.map(ex => {
      const englishTranslation = ex.translations?.find((t: any) => t.language === 2);

      if (!englishTranslation || !englishTranslation.name || !englishTranslation.description) {
        return null;
      }

      const exercise: Omit<Exercise, 'videoUrl' | 'thumbnailUrl'> & { thumbnailUrl?: string } = {
        id: String(ex.id),
        name: englishTranslation.name,
        description: englishTranslation.description,
        category: ex.category?.name || 'N/A',
        primaryMuscles: ex.muscles?.map((m: any) => m.name_en || m.name).filter(Boolean) || [],
        secondaryMuscles: ex.muscles_secondary?.map((m: any) => m.name_en || m.name).filter(Boolean) || [],
        equipment: ex.equipment?.map((e: any) => e.name).filter(Boolean) || [],
      };

      const thumbnailUrl = ex.images?.find((img: any) => img.is_main)?.image || ex.images?.[0]?.image;
      if (thumbnailUrl) {
        exercise.thumbnailUrl = thumbnailUrl;
      }

      return exercise;
    });

    const transformedExercises: Exercise[] = mappedExercises.filter((ex): ex is Exercise => ex !== null);

    console.log(`Successfully transformed ${transformedExercises.length} exercises.`);

    // 4. Batch write the new exercises to Firestore
    const exerciseCollection = collection(db, 'exercises');
    const batch = writeBatch(db);

    transformedExercises.forEach(exercise => {
      // The API provides `id` which we can use for the document ID, but for simplicity
      // and consistency with `addDoc` we let firestore generate it.
      // We will store the WGER id in the document body.
      const docRef = doc(exerciseCollection); // Create a new doc with a generated ID
      batch.set(docRef, exercise);
    });

    await batch.commit();

    console.log(`Seeding complete! Successfully added ${transformedExercises.length} exercises to Firestore.`);

  } catch (error) {
    console.error('Error seeding exercises:', error);
  }
}

seedExercises();
