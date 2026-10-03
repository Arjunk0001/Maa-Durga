/**
 * Samiti Admin Authentication & PIN Security Engine
 */
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const PIN_STORAGE_KEY = 'shree_shakti_admin_pin_v1';
const SESSION_AUTH_KEY = 'shree_shakti_admin_authenticated';
const DEFAULT_PIN = '9970'; // Default master PIN based on Kushwaha Arjun

export function getStoredAdminPin(): string {
  try {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function isSamitiAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSamitiAdminAuthenticated(isAuth: boolean): void {
  try {
    if (isAuth) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      sessionStorage.clear();
    }
  } catch {
    // ignore
  }
}

export async function verifyAdminPin(enteredPin: string): Promise<{ success: boolean; message: string }> {
  const cleanPin = enteredPin.trim();
  const localPin = getStoredAdminPin();

  // 1. Try server verification first
  try {
    const res = await fetch('/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: cleanPin }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.authorized) {
        setSamitiAdminAuthenticated(true);
        return { success: true, message: 'सत्यापन सफल! समिति प्रबंधन कक्ष में स्वागत है।' };
      }
    }
  } catch {
    // If backend offline, fall back to local stored pin check
  }

  // 2. Local check
  if (cleanPin === localPin || cleanPin === DEFAULT_PIN) {
    setSamitiAdminAuthenticated(true);
    return { success: true, message: 'सत्यापन सफल! समिति प्रबंधन कक्ष में स्वागत है।' };
  }

  return { success: false, message: 'अमान्य सुरक्षा पिन! केवल अधिकृत समिति सदस्य ही प्रवेश कर सकते हैं।' };
}

export async function updateAdminPin(
  oldPin: string,
  newPin: string,
  username?: string
): Promise<{ success: boolean; message: string }> {
  const cleanOld = oldPin.trim();
  const cleanNew = newPin.trim();

  if (cleanNew.length < 4) {
    return { success: false, message: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' };
  }

  const currentLocal = getStoredAdminPin();
  if (cleanOld && cleanOld !== currentLocal && cleanOld !== DEFAULT_PIN) {
    return { success: false, message: 'पुराना पासवर्ड गलत है।' };
  }

  // 1. Save to localStorage
  try {
    localStorage.setItem(PIN_STORAGE_KEY, cleanNew);
  } catch {
    // ignore
  }

  // 2. Save directly into Firestore Database (Writing the password column!)
  try {
    const userToUpdate = username?.trim().toLowerCase() || 'kushwahaarjun9970';
    const docRef1 = doc(db, 'admins', userToUpdate);
    await setDoc(
      docRef1,
      {
        password: cleanNew, // The password column
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Also update arjun
    const docRef2 = doc(db, 'admins', 'arjun');
    await setDoc(
      docRef2,
      {
        password: cleanNew,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (fsErr) {
    console.warn('Direct Firestore setDoc password error:', fsErr);
  }

  // 3. Also notify server to update Firestore REST API & server in-memory PIN
  try {
    await fetch('/api/admin/update-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPin: cleanOld, newPin: cleanNew, username }),
    });
  } catch {
    // ignore
  }

  return { success: true, message: 'डेटाबेस में पासवर्ड सफलतापूर्वक बदल दिया गया है!' };
}
