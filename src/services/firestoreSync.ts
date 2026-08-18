import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

// Helper to remove undefined values before Firestore writes
export function sanitizeForFirestore<T>(obj: T): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned;
  }
  return obj;
}

// LocalStorage cache helper
function getLocalCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`jnv_db_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Local cache read error for ${key}`, e);
  }
  return fallback;
}

function setLocalCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(`jnv_db_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Local cache write error for ${key}`, e);
  }
}

/**
 * Fetch all documents in a collection.
 * If collection is empty and seedData is provided, auto-seed to Firestore permanently.
 */
export async function syncCollectionWithFirestore<T extends { id?: string }>(
  collectionName: string,
  seedData: T[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const items = snap.docs.map(d => ({
        ...d.data(),
        id: d.id
      })) as T[];
      setLocalCache(collectionName, items);
      return items;
    }

    // Collection is empty on Firestore - auto-seed for permanent persistence
    if (seedData && seedData.length > 0) {
      const batch = writeBatch(db);
      seedData.forEach(item => {
        const docId = item.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docRef = doc(db, collectionName, docId);
        batch.set(docRef, sanitizeForFirestore({ ...item, id: docId }));
      });
      await batch.commit();
      setLocalCache(collectionName, seedData);
      return seedData;
    }

    return [];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    // Fallback to local cache or seed data
    return getLocalCache(collectionName, seedData);
  }
}

/**
 * Fetch a singleton document (e.g. settings, election status)
 * If document does not exist and seedData is provided, auto-seed to Firestore.
 */
export async function syncSingletonWithFirestore<T extends object>(
  collectionName: string,
  docId: string,
  seedData: T
): Promise<T> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as T;
      setLocalCache(`${collectionName}_${docId}`, data);
      return data;
    }

    // Auto-seed singleton doc
    if (seedData) {
      await setDoc(docRef, sanitizeForFirestore(seedData));
      setLocalCache(`${collectionName}_${docId}`, seedData);
      return seedData;
    }

    return seedData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${docId}`);
    return getLocalCache(`${collectionName}_${docId}`, seedData);
  }
}

/**
 * Save / Create a document in Firestore permanently
 */
export async function saveDocToFirestore<T extends object>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, sanitizeForFirestore({ ...(data as any), id: docId }), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    throw error;
  }
}

/**
 * Update document fields in Firestore permanently
 */
export async function updateDocInFirestore(
  collectionName: string,
  docId: string,
  updates: Record<string, any>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, sanitizeForFirestore(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${docId}`);
    // If document doesn't exist yet, fallback to setDoc with merge
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, sanitizeForFirestore(updates), { merge: true });
    } catch (setErr) {
      handleFirestoreError(setErr, OperationType.WRITE, `${collectionName}/${docId}`);
      throw setErr;
    }
  }
}

/**
 * Delete a document from Firestore permanently
 */
export async function deleteDocFromFirestore(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
    throw error;
  }
}
