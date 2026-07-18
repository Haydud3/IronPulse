"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginButton() {
  const handleLogin = async () => {
    if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
      console.log('[Mock Mode] Login button clicked, but we are in mock mode.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
}
