import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot 
} from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  User
} from "firebase/auth";

// Direct initialization with credentials from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0609711546",
  appId: "1:981014495380:web:98ed88f6f37d7c6c81b481",
  apiKey: "AIzaSyA-a0yrkg9iABtjwqQu9bzfxZ1zCp_t_hY",
  authDomain: "gen-lang-client-0609711546.firebaseapp.com",
  databaseId: "ai-studio-d20e616c-d293-4cac-a051-661c699b0d2b",
  storageBucket: "gen-lang-client-0609711546.firebasestorage.app",
  messagingSenderId: "981014495380"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

// Service to manage cloud synchronization of ANJAB-ABK data
export interface CloudData {
  settings: any;
  unitKerja: any[];
  jabatan: any[];
  jenisPerkaraList: any[];
  dataPerkaraList: any[];
  role?: "admin" | "editor" | "viewer";
}

/**
 * Save user data to Firestore
 * @param userId Unique identifier of the user (from Firebase Auth)
 * @param data Data object containing all simulation structures
 */
export async function saveUserData(userId: string, data: CloudData): Promise<void> {
  const userDocRef = doc(db, "users_anjab_abk", userId);
  await setDoc(userDocRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Fetch user data from Firestore
 * @param userId Unique identifier of the user
 */
export async function getUserData(userId: string): Promise<CloudData | null> {
  const userDocRef = doc(db, "users_anjab_abk", userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    return {
      settings: docData.settings || null,
      unitKerja: docData.unitKerja || [],
      jabatan: docData.jabatan || [],
      jenisPerkaraList: docData.jenisPerkaraList || [],
      dataPerkaraList: docData.dataPerkaraList || [],
      role: docData.role || "viewer"
    };
  }
  return null;
}
