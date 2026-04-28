import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Achievement, UserProfile } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  }
  const errorString = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorString);
  // Only throw if it's not a permissions error during normal subscription cleanup or similar
  if (errInfo.error.includes('Missing or insufficient permissions')) {
    console.warn('Silent permission error - likely unauthorized role for current view');
  }
  throw new Error(errorString);
}

// Connection test
export async function testConnection() {
  try {
    // Just a basic attempt to see if we're online
    await getDocFromServer(doc(db, 'system', 'config')).catch(() => {});
  } catch (error) {
    // Ignore, just a connectivity probe
  }
}

// User Services
export async function createUserProfile(profile: UserProfile) {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>) {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Achievement Services
export async function createAchievement(achievement: Omit<Achievement, 'id'>) {
  const path = 'achievements';
  try {
    const newDocRef = doc(collection(db, 'achievements'));
    const data = { ...achievement, id: newDocRef.id };
    await setDoc(newDocRef, data);
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getStudentAchievements(userId: string): Promise<Achievement[]> {
  const path = 'achievements';
  try {
    const q = query(
      collection(db, 'achievements'), 
      where('userId', '==', userId),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Achievement);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function getPendingVerifications(): Promise<Achievement[]> {
  const path = 'achievements';
  try {
    const q = query(
      collection(db, 'achievements'), 
      where('status', '==', 'pending'),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Achievement);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function verifyAchievement(id: string, status: 'verified' | 'rejected', verifierId: string) {
  const path = `achievements/${id}`;
  try {
    await updateDoc(doc(db, 'achievements', id), {
      status,
      verifiedBy: verifierId,
      verificationDate: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToAchievements(userId: string, callback: (achievements: Achievement[]) => void) {
  const path = 'achievements';
  const q = query(
    collection(db, 'achievements'), 
    where('userId', '==', userId),
    limit(100)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Achievement));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}
