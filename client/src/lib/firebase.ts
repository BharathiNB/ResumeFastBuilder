import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Check if we have Firebase credentials

// Use development Firebase config or real credentials
const firebaseConfig = {
  // Development fallback config - these are safe placeholder values
  // apiKey: "AIzaSyAGXTI92E1m8f_wRTEIjENQWv9GL1fVguo",
  // authDomain: "resumefast-b7163.firebaseapp.com",
  // projectId: "resumefast-b7163",
  // storageBucket: "resumefast-b7163.firebasestorage.app",
  // appId: "1:625209414521:web:785f17a72d76669bb8d5a8",

  apiKey: "AIzaSyAGXTI92E1m8f_wRTEIjENQWv9GL1fVguo",
  authDomain: "resumefast-b7163.firebaseapp.com",
  projectId: "resumefast-b7163",
  storageBucket: "resumefast-b7163.firebasestorage.app",
  messagingSenderId: "625209414521",
  appId: "1:625209414521:web:785f17a72d76669bb8d5a8",
  measurementId: "G-LEQ8DZ2GJR",
};

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase not available in development mode:", error);
  // Create a mock auth object for development
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signOut: () => Promise.resolve(),
  };
}

export { auth };
export default app;
