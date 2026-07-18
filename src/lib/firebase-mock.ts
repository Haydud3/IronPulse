// A mock user
const mockUser = {
  uid: "mock-user-id",
  displayName: "Mock User",
  email: "mock.user@example.com",
};

// --- Mock Auth ---
// This will hold the auth state and listeners
let mockAuthUser: any = null;
let authListeners: ((user: any) => void)[] = [];

const notifyAuthListeners = () => {
    authListeners.forEach(listener => listener(mockAuthUser));
}

// Simulate login after a short delay
setTimeout(() => {
    mockAuthUser = mockUser;
    notifyAuthListeners();
}, 500);


export const auth = {
  onAuthStateChanged: (callback: (user: any) => void) => {
    authListeners.push(callback);
    // Immediately call back with the current state
    callback(mockAuthUser);
    
    // Return an unsubscribe function
    return () => {
        authListeners = authListeners.filter(listener => listener !== callback);
    };
  },
  signOut: () => {
    console.log("[Mock Auth] Signing out...");
    mockAuthUser = null;
    notifyAuthListeners();
    return Promise.resolve();
  },
};

// This is needed for the LoginButton
export const GoogleAuthProvider = function() {};
export const signInWithPopup = (auth: any, provider: any) => {
    console.log("[Mock Auth] Signing in with popup...");
    mockAuthUser = mockUser;
    notifyAuthListeners();
    return Promise.resolve({ user: mockUser });
}


// --- Mock Firestore ---
export const db = {}; // The db object itself is often not used directly

export const collection = (db: any, path: string) => {
  console.log(`[Mock Firestore] Reference to collection: ${path}`);
  return { path }; // Return a descriptor
};

export const addDoc = (collectionRef: any, data: any) => {
  console.log(`[Mock Firestore] addDoc to '${collectionRef.path}':`, data);
  return Promise.resolve({ id: "mock-doc-id-" + Math.random() });
};

export const query = (collectionRef: any, ...constraints: any[]) => {
    console.log(`[Mock Firestore] query on '${collectionRef.path}' with constraints:`, constraints);
    return { collection: collectionRef, constraints };
};

export const where = (field: string, op: string, value: any) => ({ type: 'where', field, op, value });
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });

export const getDocs = (query: any) => {
  console.log("[Mock Firestore] getDocs for query:", query);

  // Specifically mock the response for the history page's query
  if (query.collection.path === 'user-logs') {
    return Promise.resolve({
      docs: [
        {
          id: "mock-log-1",
          data: () => ({
            userId: "mock-user-id",
            exerciseId: "Bench Press",
            date: { toDate: () => new Date('2024-01-15T10:00:00Z') },
            sets: [{ reps: 8, weight: 60, notes: "Felt good" }],
          }),
        },
        {
          id: "mock-log-2",
          data: () => ({
            userId: "mock-user-id",
            exerciseId: "Squat",
            date: { toDate: () => new Date('2024-01-13T11:00:00Z') },
            sets: [{ reps: 10, weight: 100 }, { reps: 10, weight: 100 }],
          }),
        },
      ],
    });
  }

  return Promise.resolve({ docs: [] }); // Default to empty result
};

export const terminate = (db: any) => { 
    console.log("[Mock Firestore] Terminate connection (no-op)");
};

export const Timestamp = {
    now: () => ({
        toDate: () => new Date()
    })
}
