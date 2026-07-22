"use client";

import { onAuthStateChanged, User, Auth } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth as firebaseAuth } from "@/lib/firebase";

export const AuthContext = createContext<{ user: User | null; auth: Auth | null }>({ user: null, auth: null });

export const useAuth = () => useContext(AuthContext);

const mockUser: User = {
  uid: "mock-user-id",
  displayName: "Mock User",
  email: "mock.user@example.com",
  providerId: "mock",
  photoURL: null,
  phoneNumber: null,
  emailVerified: true,
  isAnonymous: false,
  tenantId: null,
  providerData: [],
  metadata: {},
  toJSON: () => ({}),
  refreshToken: "mock-refresh-token",
  delete: async () => { console.log("mock user deleted"); },
  getIdToken: async () => "mock-id-token",
  getIdTokenResult: async () => (({ token: "mock-id-token" }) as any),
  reload: async () => { console.log("mock user reloaded"); },
};

// A mock auth object for mock mode
const mockAuth = {
  signOut: () => {
    console.log("[Mock Mode] signOut called");
    // In a more complex mock, this would update the user state to null
  }
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<any>(null); // Use 'any' for simplicity with mock

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
      console.log("[Mock Mode] Using mock user for AuthProvider.");
      setUser(mockUser);
      setAuth(mockAuth);
    } else {
      setAuth(firebaseAuth);
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth }}>{children}</AuthContext.Provider>
  );
}
