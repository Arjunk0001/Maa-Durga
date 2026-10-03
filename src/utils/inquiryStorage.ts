import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface SamitiInquiry {
  id: string;
  memberName: string;
  memberRole: string;
  memberPhone?: string;
  senderName: string;
  senderPhone: string;
  purpose: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

const INQUIRIES_STORAGE_KEY = 'shree_shakti_inquiries_cache';

/**
 * Reads locally cached inquiries
 */
export function getLocalInquiries(): SamitiInquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves inquiries to local cache
 */
function setLocalInquiries(inquiries: SamitiInquiry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  } catch {
    // ignore
  }
}

/**
 * Submits a new inquiry to Firestore, local storage, and server API
 */
export async function submitInquiry(data: {
  memberName?: string;
  memberRole?: string;
  memberPhone?: string;
  senderName: string;
  senderPhone: string;
  purpose: string;
  message: string;
}): Promise<{ success: boolean; id: string; error?: string }> {
  const newInquiry: SamitiInquiry = {
    id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    memberName: data.memberName || 'समिति प्रबंधन (General Samiti)',
    memberRole: data.memberRole || 'प्रबंधन समिति',
    memberPhone: data.memberPhone || '+91 94500 23412',
    senderName: data.senderName.trim(),
    senderPhone: data.senderPhone.trim(),
    purpose: data.purpose || 'सामान्य पूछताछ',
    message: data.message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  // 1. Save to local cache immediately
  const existing = getLocalInquiries();
  const updatedList = [newInquiry, ...existing];
  setLocalInquiries(updatedList);

  // 2. Submit to Firestore
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...newInquiry,
      timestamp: serverTimestamp(),
    });
    newInquiry.id = docRef.id;
  } catch (fsErr) {
    console.warn('Firestore inquiry save fallback:', fsErr);
  }

  // 3. Submit to Server API
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInquiry),
    });
  } catch (apiErr) {
    console.warn('Server inquiry save fallback:', apiErr);
  }

  return { success: true, id: newInquiry.id };
}

/**
 * Subscribes in real-time to inquiries from Firestore with local fallback
 */
export function subscribeToInquiries(
  callback: (inquiries: SamitiInquiry[]) => void
): () => void {
  // Initial callback from local cache
  callback(getLocalInquiries());

  // Firestore real-time listener
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SamitiInquiry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          items.push({
            id: d.id,
            memberName: data.memberName || 'समिति प्रबंधन',
            memberRole: data.memberRole || 'प्रबंधन समिति',
            memberPhone: data.memberPhone,
            senderName: data.senderName || 'श्रद्धालु',
            senderPhone: data.senderPhone || '',
            purpose: data.purpose || 'पूछताछ',
            message: data.message || '',
            createdAt: data.createdAt || new Date().toISOString(),
            status: data.status || 'new',
          });
        });

        if (items.length > 0) {
          setLocalInquiries(items);
          callback(items);
        }
      },
      async (err) => {
        console.warn('Firestore snapshot error for inquiries, loading from server:', err);
        try {
          const res = await fetch('/api/inquiries');
          const data = await res.json();
          if (Array.isArray(data)) {
            setLocalInquiries(data);
            callback(data);
          }
        } catch {
          // keep local cache
        }
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach inquiries snapshot:', err);
    return () => {};
  }
}

/**
 * Updates status of an inquiry ('new' | 'contacted' | 'resolved')
 */
export async function updateInquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'resolved'
): Promise<void> {
  // 1. Update local
  const current = getLocalInquiries();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  setLocalInquiries(updated);

  // 2. Update Firestore
  try {
    const docRef = doc(db, 'inquiries', id);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Firestore updateDoc inquiry note:', err);
  }

  // 3. Update Server
  try {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch {
    // ignore
  }
}

/**
 * Deletes an inquiry
 */
export async function deleteInquiry(id: string): Promise<void> {
  // 1. Delete local
  const current = getLocalInquiries();
  const updated = current.filter((item) => item.id !== id);
  setLocalInquiries(updated);

  // 2. Delete Firestore
  try {
    const docRef = doc(db, 'inquiries', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteDoc inquiry note:', err);
  }

  // 3. Delete Server
  try {
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
  } catch {
    // ignore
  }
}
