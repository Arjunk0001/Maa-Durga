import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './config';
import { setSamitiAdminAuthenticated } from '../utils/adminAuth';

export const SUPER_ADMIN_EMAIL = 'kushwahaarjun9970@gmail.com';

export interface AdminUserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'super_admin' | 'admin' | 'tech_lead';
  isAuthorized: boolean;
}

/**
 * Checks if a user is an authorized admin in Firestore
 */
export async function checkAdminAuthorization(user: User): Promise<AdminUserData> {
  const isSuperAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  // If super admin, ensure document in /admins/{uid} exists and grant access
  if (isSuperAdmin) {
    try {
      const adminRef = doc(db, 'admins', user.uid);
      await setDoc(
        adminRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Arjun Kushwaha (Tech Lead)',
          photoURL: user.photoURL || '',
          role: 'super_admin',
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Superadmin doc sync error:', e);
    }

    setSamitiAdminAuthenticated(true);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Arjun Kushwaha (Tech Lead)',
      photoURL: user.photoURL || '',
      role: 'super_admin',
      isAuthorized: true,
    };
  }

  // For other users, check if registered in Firestore 'admins' collection
  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const docSnap = await getDoc(adminDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setSamitiAdminAuthenticated(true);
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Committee Admin',
        photoURL: user.photoURL || '',
        role: data.role || 'admin',
        isAuthorized: true,
      };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `admins/${user.uid}`);
  }

  // Not authorized
  setSamitiAdminAuthenticated(false);
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'Devotee',
    photoURL: user.photoURL || '',
    role: 'admin',
    isAuthorized: false,
  };
}

/**
 * Sign in with Google Popup and verify Firestore Admin role
 */
export async function loginWithGoogleAdmin(): Promise<{
  success: boolean;
  user?: AdminUserData;
  message: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const adminInfo = await checkAdminAuthorization(result.user);

    if (!adminInfo.isAuthorized) {
      await signOut(auth);
      setSamitiAdminAuthenticated(false);
      return {
        success: false,
        message: `पहुंच अस्वीकृत: ${result.user.email} अधिकृत एडमिन सूची में नहीं है। केवल समिति व्यवस्थापक ही लॉगिन कर सकते हैं।`,
      };
    }

    return {
      success: true,
      user: adminInfo,
      message: `प्रणाम ${adminInfo.displayName}! आप सफलतापूर्वक Firebase Firestore द्वारा प्रमाणित हो गए हैं।`,
    };
  } catch (err: any) {
    console.error('Google Sign-in error:', err);
    return {
      success: false,
      message: err?.message?.includes('popup-closed-by-user')
        ? 'लॉगिन पॉपअप बंद कर दिया गया।'
        : 'Firebase प्रमाणीकरण त्रुटि: ' + (err?.message || 'अज्ञात त्रुटि'),
    };
  }
}

/**
 * Logout admin from Firebase
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Sign out error:', e);
  }
  setSamitiAdminAuthenticated(false);
}

/**
 * Listen to Firebase Auth state
 */
export function subscribeToFirebaseAuthState(
  callback: (user: User | null, adminData: AdminUserData | null) => void
) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const adminData = await checkAdminAuthorization(firebaseUser);
      callback(firebaseUser, adminData.isAuthorized ? adminData : null);
    } else {
      callback(null, null);
    }
  });
}
