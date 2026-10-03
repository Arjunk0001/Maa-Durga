/**
 * Cloudinary Secure Upload Utility
 * Handles CDN image upload, auto-compression, and format conversion
 */

import { getStoredAdminPin } from './adminAuth';

export interface UploadResult {
  success: boolean;
  url: string;
  error?: string;
  publicId?: string;
}

export async function uploadImageToCloudinary(
  fileOrBase64: File | string,
  folder = 'durga_puja_2026'
): Promise<UploadResult> {
  const currentPin = getStoredAdminPin();

  // Convert File to base64 if needed
  let base64Data: string;
  if (fileOrBase64 instanceof File) {
    try {
      base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(fileOrBase64);
      });
    } catch (e: any) {
      return { success: false, url: '', error: 'फ़ाइल पढ़ने में त्रुटि: ' + (e?.message || '') };
    }
  } else {
    base64Data = fileOrBase64;
  }

  // 1. Try server-side secure upload proxy with Admin PIN
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': currentPin,
      },
      body: JSON.stringify({
        image: base64Data,
        folder,
        adminPin: currentPin,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return {
          success: true,
          url: data.url,
          publicId: data.publicId,
        };
      }
    } else {
      const errData = await res.json().catch(() => null);
      if (errData?.message && res.status === 401) {
        return { success: false, url: '', error: errData.message };
      }
    }
  } catch (err) {
    console.warn('Backend proxy upload skipped, trying client fallback...', err);
  }

  // 2. Client-side fallback to Cloudinary Direct Unsigned Upload
  // Uses user provided Cloud Name 'aoa1bada' and Preset 'Durga_puja'
  try {
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', 'Durga_puja');
    formData.append('folder', folder);

    const directRes = await fetch(
      'https://api.cloudinary.com/v1_1/aoa1bada/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const directData = await directRes.json();
    if (directRes.ok && directData.secure_url) {
      let optimized = directData.secure_url;
      if (optimized.includes('/upload/')) {
        optimized = optimized.replace('/upload/', '/upload/f_auto,q_auto/');
      }
      return {
        success: true,
        url: optimized,
        publicId: directData.public_id,
      };
    } else {
      return {
        success: false,
        url: '',
        error: directData.error?.message || 'Cloudinary पर अपलोड विफल रहा।',
      };
    }
  } catch (directErr: any) {
    return {
      success: false,
      url: '',
      error: 'इंटरनेट कनेक्शन या Cloudinary रिस्पॉन्स में समस्या: ' + (directErr?.message || ''),
    };
  }
}
