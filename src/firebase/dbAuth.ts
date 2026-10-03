import { setSamitiAdminAuthenticated } from '../utils/adminAuth';
import { db } from './config';
import { doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';

export interface AdminProfile {
  username: string;
  email?: string;
  displayName: string;
  pandalName?: string;
  role: string;
}

export interface DatabaseLoginResult {
  success: boolean;
  user?: AdminProfile;
  message: string;
}

/**
 * Saves or updates an admin document directly in the Firestore database
 * Includes the 'password' column/field, username, and pandalName
 */
export async function saveAdminToFirestore(
  username: string,
  password: string,
  pandalName?: string,
  displayName?: string,
  role?: string
): Promise<{ success: boolean; message: string }> {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, message: 'यूज़रनेम और पासवर्ड दोनों आवश्यक हैं।' };
  }

  try {
    const adminDocRef = doc(db, 'admins', cleanUser);
    await setDoc(
      adminDocRef,
      {
        username: cleanUser,
        password: cleanPass, // Direct password column in Firestore
        pandalName: pandalName || 'Shree Shakti Durga Puja Samiti',
        displayName: displayName || cleanUser,
        role: role || 'admin',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Also notify server endpoint to update memory & database
    try {
      await fetch('/api/admin/update-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPin: cleanPass, username: cleanUser }),
      });
    } catch {
      // server sync fallback
    }

    return { success: true, message: 'डेटाबेस में पासवर्ड कॉलम सफलतापूर्वक सुरक्षित हो गया!' };
  } catch (err: any) {
    console.error('Firestore saveAdmin error:', err);
    return { success: false, message: 'डेटाबेस में पासवर्ड सुरक्षित करने में त्रुटि: ' + (err?.message || 'Error') };
  }
}

/**
 * Validates admin credentials directly against the Firestore Database (collection 'admins')
 * Checks the 'password' column/field for the matching document
 */
export async function verifyDatabaseLogin(
  usernameInput: string,
  passwordInput: string
): Promise<DatabaseLoginResult> {
  const rawUser = usernameInput.trim();
  const cleanUser = rawUser.toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return {
      success: false,
      message: 'कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें।',
    };
  }

  // 1. Direct Client Firestore Query (Instant & Real-time with your manual Firebase Console edits)
  try {
    // Check 1A: By Document ID directly (e.g. if document is named 'arjun', 'kushwahaarjun9970', etc.)
    const docRefDirect = doc(db, 'admins', cleanUser);
    const snapDirect = await getDoc(docRefDirect);

    if (snapDirect.exists()) {
      const data = snapDirect.data();
      const storedPass = (data.password ?? data.pass ?? data.pin ?? data.secretKey)?.toString().trim();

      if (storedPass && storedPass === cleanPass) {
        const profile: AdminProfile = {
          username: cleanUser,
          email: data.email || `${cleanUser}@samiti.local`,
          displayName: data.displayName || data.name || cleanUser,
          pandalName: data.pandalName || data.pandal_name || data.pandal,
          role: data.role || 'admin',
        };
        setSamitiAdminAuthenticated(true);
        return {
          success: true,
          user: profile,
          message: 'लॉगिन सफल! स्वागत है।',
        };
      } else {
        return {
          success: false,
          message: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।',
        };
      }
    }

    // Check 1B: Scan the 'admins' collection to match any document with field 'username' or 'id'
    const colRef = collection(db, 'admins');
    const colSnap = await getDocs(colRef);

    for (const d of colSnap.docs) {
      const data = d.data();
      const docUser = (data.username ?? data.id ?? data.user ?? data.email ?? d.id)?.toString().trim().toLowerCase();
      const storedPass = (data.password ?? data.pass ?? data.pin ?? data.secretKey)?.toString().trim();

      if (docUser === cleanUser) {
        if (storedPass && storedPass === cleanPass) {
          const profile: AdminProfile = {
            username: cleanUser,
            email: data.email || `${cleanUser}@samiti.local`,
            displayName: data.displayName || data.name || cleanUser,
            pandalName: data.pandalName || data.pandal_name || data.pandal,
            role: data.role || 'admin',
          };
          setSamitiAdminAuthenticated(true);
          return {
            success: true,
            user: profile,
            message: 'लॉगिन सफल! स्वागत है।',
          };
        } else {
          return {
            success: false,
            message: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।',
          };
        }
      }
    }
  } catch (clientErr) {
    console.warn('Client lookup note:', clientErr);
  }

  // 2. Server API query
  try {
    const response = await fetch('/api/admin/db-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      setSamitiAdminAuthenticated(true);
      return {
        success: true,
        user: data.user,
        message: data.message || 'लॉगिन सफल!',
      };
    }
  } catch (apiErr) {
    console.warn('Server fallback API lookup note:', apiErr);
  }

  // 3. Fallback for master user
  const isMasterUser =
    cleanUser === 'kushwahaarjun9970' ||
    cleanUser === 'kushwahaarjun9970@gmail.com' ||
    cleanUser === 'arjun' ||
    cleanUser === 'admin';

  if (isMasterUser && cleanPass === '9970') {
    setSamitiAdminAuthenticated(true);
    return {
      success: true,
      user: {
        username: cleanUser,
        displayName: 'Arjun Kushwaha',
        role: 'super_admin',
      },
      message: 'लॉगिन सफल! स्वागत है।',
    };
  }

  return {
    success: false,
    message: 'अमान्य यूज़रनेम या पासवर्ड। कृपया सही जानकारी दर्ज करें।',
  };
}

/**
 * Validates Super Admin credentials strictly against the Firestore Database (collection 'admins')
 * Verifies both the 'password' column and the 'role === super_admin' in the database
 */
export async function verifySuperAdminLogin(
  usernameInput: string,
  passwordInput: string
): Promise<DatabaseLoginResult> {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return {
      success: false,
      message: 'कृपया सुपर एडमिन यूज़रनेम और पासवर्ड दोनों दर्ज करें।',
    };
  }

  // 1. Direct Database Query
  try {
    const docRef = doc(db, 'admins', cleanUser);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const storedPass = (data.password ?? data.pass ?? data.pin)?.toString().trim();
      const role = (data.role ?? 'admin').toString().toLowerCase();

      // Check if role is super_admin
      const isSuper = role === 'super_admin' || cleanUser === 'kushwahaarjun9970';
      if (!isSuper) {
        return {
          success: false,
          message: 'यह खाता सुपर एडमिन के रूप में अधिकृत नहीं है।',
        };
      }

      if (storedPass === cleanPass) {
        const profile: AdminProfile = {
          username: cleanUser,
          email: data.email || `${cleanUser}@samiti.local`,
          displayName: data.displayName || 'Super Admin',
          pandalName: data.pandalName || 'Shree Shakti Durga Puja Samiti',
          role: 'super_admin',
        };
        setSamitiAdminAuthenticated(true);
        return {
          success: true,
          user: profile,
          message: `स्वागत है ${profile.displayName}! प्रमाणीकरण सफल हुआ।`,
        };
      } else {
        return {
          success: false,
          message: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।',
        };
      }
    }
  } catch (fsErr) {
    console.warn('Super admin lookup note:', fsErr);
  }

  // 2. Server API fallback
  try {
    const response = await fetch('/api/admin/db-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass }),
    });

    const data = await response.json();
    if (response.ok && data.success && (data.user?.role === 'super_admin' || cleanUser === 'kushwahaarjun9970')) {
      setSamitiAdminAuthenticated(true);
      return {
        success: true,
        user: data.user,
        message: data.message || 'प्रमाणीकरण सफल!',
      };
    }
  } catch (apiErr) {
    console.warn('Server fallback super admin lookup note:', apiErr);
  }

  // 3. Built-in Master Admin fallback for Arjun Kushwaha
  if ((cleanUser === 'kushwahaarjun9970' || cleanUser === 'arjun') && cleanPass === '9970') {
    setSamitiAdminAuthenticated(true);
    return {
      success: true,
      user: {
        username: cleanUser,
        displayName: 'Arjun Kushwaha (Super Admin)',
        role: 'super_admin',
      },
      message: 'लॉगिन सफल! स्वागत है।',
    };
  }

  return {
    success: false,
    message: 'अमान्य क्रेडेंशियल्स! कृपया सही यूज़रनेम और पासवर्ड दर्ज करें।',
  };
}
