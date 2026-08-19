import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  signOut as fbSignOut
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error caught: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection safely on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (
      (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) ||
      error?.code === 'unavailable'
    ) {
      // Client operates in resilient offline mode if network is connecting or disconnected
    }
  }
}
setTimeout(() => {
  testConnection().catch(() => {});
}, 1000);

export interface AuthErrorDetails {
  code: string;
  message: string;
}

export const loginWithEmailPassword = async (email: string, password: string) => {
  return await fbSignInWithEmailAndPassword(auth, email.trim(), password);
};

export const registerUserWithEmailPassword = async (email: string, password: string, displayName?: string) => {
  const userCredential = await fbCreateUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && userCredential.user) {
    await fbUpdateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const sendPasswordReset = async (email: string) => {
  return await fbSendPasswordResetEmail(auth, email.trim());
};

export const logoutUser = async () => {
  return await fbSignOut(auth);
};

