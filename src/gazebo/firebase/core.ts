import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, User } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

export { CollectionReference, DocumentReference, QuerySnapshot, Timestamp } from "firebase/firestore";
export type { DocumentData } from "firebase/firestore";

export type FirebaseUser = User;

// Basic config
// ------------
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const firebaseApp = initializeApp(FIREBASE_CONFIG);

// Start firestore
// ---------------
export const firestore = getFirestore(firebaseApp)

const NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST

if (NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST) {
  const [host, port] = NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST.split(':')
  connectFirestoreEmulator(firestore, host, parseInt(port));
}


// Start auth
// ----------
export const auth = getAuth(firebaseApp);

if (process.env.NODE_ENV === "test") {
  console.log("disabling persistence.");
  // auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
}

const NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST

if (NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST!) {
  connectAuthEmulator(auth, NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST);
}


export const signout = () => auth.signOut();