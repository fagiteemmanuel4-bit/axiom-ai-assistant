import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJpreFC27ip6fhyAJNvIQ3D5TaqAOm1fk",
  authDomain: "axiom-official-1f0b5.firebaseapp.com",
  projectId: "axiom-official-1f0b5",
  storageBucket: "axiom-official-1f0b5.firebasestorage.app",
  messagingSenderId: "104312014465",
  appId: "1:104312014465:web:6994e00719155d61372f80",
  measurementId: "G-QYTQPC28JH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// Only init analytics in browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch {
    // analytics may fail in some environments
  }
}
export { analytics };
export default app;
