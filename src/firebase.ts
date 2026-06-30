import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7emkY7yQjWf7rWt_vblXe_VcHCHskNmc",
  authDomain: "gen-lang-client-0654376496.firebaseapp.com",
  projectId: "gen-lang-client-0654376496",
  storageBucket: "gen-lang-client-0654376496.firebasestorage.app",
  messagingSenderId: "959237168719",
  appId: "1:959237168719:web:728bb043a779a43a8c943a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-pasayaflagshipex-3ec756c5-8d47-42aa-a740-8dd88c8a0443");

// Generic helpers for our app to read/write global state and stores directly to Firestore!
export async function getStoreDataFromFirestore() {
  try {
    // We can save all stores into a single document or multiple documents.
    // Saving to a document named 'main' inside a collection 'appConfig' or similar is extremely simple and avoids complex subcollection querying,
    // keeping it robust and perfectly in sync!
    const docRef = doc(db, "appConfig", "storeData");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error reading from Firestore:", error);
    return null;
  }
}

export async function saveStoreDataToFirestore(data: { activeStoreId: string; stores: any }) {
  try {
    const docRef = doc(db, "appConfig", "storeData");
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    return false;
  }
}
