import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase Project Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyANSP72KfQ5bV7kuHZ8uHK5EWoE-gbHwyI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "syncflow-eb4b3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "syncflow-eb4b3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "syncflow-eb4b3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "933202576741",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:933202576741:web:55518a3bda160955d28d8c"
};

// Initialize Firebase App safely without throwing API key popup errors
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export default app;
