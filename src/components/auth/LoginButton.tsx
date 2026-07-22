"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GoogleIcon from "./GoogleIcon";

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
    <button 
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 px-4 py-2 text-black bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors"
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
}
