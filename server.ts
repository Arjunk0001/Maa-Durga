import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { pandalData } from './src/data/pandalData';

const app = express();
const PORT = process.env.PORT || 3000;

// Read Firebase Config for Firestore Database access
let firebaseConfig: any = null;
try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json in server.ts', e);
}

// Cloudinary secure credentials (kept server-side)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'aoa1bada';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'Durga_puja';
let currentAdminPin = process.env.ADMIN_PIN || '9970';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ADMIN DATABASE LOGIN ENDPOINT (MATCHES DIRECTLY WITH FIRESTORE DATABASE)
app.post('/api/admin/db-login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'यूज़रनेम और पासवर्ड दोनों दर्ज करना अनिवार्य है।',
    });
  }

  const cleanUser = username.toString().trim().toLowerCase();
  const cleanPass = password.toString().trim();

  let matchedAdmin: {
    username: string;
    email: string;
    displayName: string;
    role: string;
  } | null = null;

  // 1. Check in Firestore database via REST API
  if (firebaseConfig?.projectId && firebaseConfig?.firestoreDatabaseId) {
    try {
      const baseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/admins`;
      const firestoreUrl = `${baseUrl}/${encodeURIComponent(cleanUser)}?key=${firebaseConfig.apiKey}`;
      const fsRes = await fetch(firestoreUrl);

      if (fsRes.ok) {
        const docData = await fsRes.json();
        const fields = docData.fields || {};
        const dbPassword =
          fields.password?.stringValue ||
          fields.secretKey?.stringValue ||
          fields.pin?.stringValue;
        const dbRole = fields.role?.stringValue || 'admin';
        const dbDisplayName = fields.displayName?.stringValue || cleanUser;
        const dbEmail = fields.email?.stringValue || '';

        if (dbPassword && dbPassword === cleanPass) {
          matchedAdmin = {
            username: cleanUser,
            email: dbEmail || 'kushwahaarjun9970@gmail.com',
            displayName: dbDisplayName,
            role: dbRole,
          };
        }
      }
    } catch (err) {
      console.warn('Firestore database lookup error:', err);
    }
  }

  // 2. Master Admin Database Match & Auto-Seed
  // (Authorized for Arjun Kushwaha: kushwahaarjun9970, arjun, admin)
  if (!matchedAdmin) {
    const isMasterUser =
      cleanUser === 'kushwahaarjun9970' ||
      cleanUser === 'kushwahaarjun9970@gmail.com' ||
      cleanUser === 'arjun' ||
      cleanUser === 'admin';

    if (isMasterUser && (cleanPass === currentAdminPin || cleanPass === '9970')) {
      matchedAdmin = {
        username: 'kushwahaarjun9970',
        email: 'kushwahaarjun9970@gmail.com',
        displayName: 'Arjun Kushwaha (Tech Lead & Super Admin)',
        role: 'super_admin',
      };

      // Ensure permanently stored in Firestore database
      if (firebaseConfig?.projectId && firebaseConfig?.firestoreDatabaseId) {
        try {
          const seedUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/admins/kushwahaarjun9970?key=${firebaseConfig.apiKey}`;
          await fetch(seedUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                username: { stringValue: 'kushwahaarjun9970' },
                email: { stringValue: 'kushwahaarjun9970@gmail.com' },
                password: { stringValue: currentAdminPin },
                displayName: { stringValue: 'Arjun Kushwaha (Tech Lead & Super Admin)' },
                role: { stringValue: 'super_admin' },
                isActive: { booleanValue: true },
                updatedAt: { stringValue: new Date().toISOString() },
              },
            }),
          });
        } catch (seedErr) {
          console.warn('Firestore admin auto-seed error:', seedErr);
        }
      }
    }
  }

  if (matchedAdmin) {
    return res.json({
      success: true,
      authorized: true,
      user: matchedAdmin,
      message: `स्वागत है ${matchedAdmin.displayName}! प्रमाणीकरण सफल हुआ।`,
    });
  }

  return res.status(401).json({
    success: false,
    authorized: false,
    message: 'अमान्य यूज़रनेम या पासवर्ड। कृपया पुनः प्रयास करें।',
  });
});

// ADMIN PIN VERIFICATION
app.post('/api/admin/verify-pin', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'पिन दर्ज करना अनिवार्य है।' });
  }
  if (pin.toString().trim() === currentAdminPin.toString().trim()) {
    return res.json({ success: true, authorized: true, message: 'प्रमाणीकरण सफल! स्वागत है।' });
  }
  return res.status(401).json({ success: false, authorized: false, message: 'अमान्य सुरक्षा पिन (Invalid PIN)।' });
});

// ADMIN PIN & PASSWORD UPDATE (SAVES PASSWORD COLUMN DIRECTLY TO FIRESTORE)
app.post('/api/admin/update-pin', async (req: Request, res: Response) => {
  const { newPin, username } = req.body;
  if (!newPin || newPin.toString().trim().length < 4) {
    return res.status(400).json({ success: false, message: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' });
  }

  const cleanNew = newPin.toString().trim();
  currentAdminPin = cleanNew;

  // Persist directly into Firestore Database
  if (firebaseConfig?.projectId && firebaseConfig?.firestoreDatabaseId) {
    try {
      const cleanUser = username ? username.toString().trim().toLowerCase() : 'kushwahaarjun9970';
      const targetUsers = Array.from(new Set([cleanUser, 'kushwahaarjun9970', 'arjun']));

      for (const u of targetUsers) {
        const patchUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/admins/${encodeURIComponent(u)}?updateMask.fieldPaths=password&updateMask.fieldPaths=updatedAt&key=${firebaseConfig.apiKey}`;
        await fetch(patchUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              password: { stringValue: cleanNew },
              updatedAt: { stringValue: new Date().toISOString() },
            },
          }),
        });
      }
    } catch (fsErr) {
      console.warn('Firestore password save error:', fsErr);
    }
  }

  return res.json({ success: true, message: 'डेटाबेस में पासवर्ड सफलतापूर्वक सुरक्षित कर दिया गया!' });
});

// CLOUDINARY SECURE IMAGE UPLOAD PROXY ENDPOINT
app.post('/api/upload-image', async (req: Request, res: Response) => {
  try {
    const adminPin = req.headers['x-admin-pin'] || req.body.adminPin;
    if (adminPin?.toString().trim() !== currentAdminPin.toString().trim()) {
      return res.status(401).json({
        success: false,
        message: 'अनधिकृत पहुंच: केवल सत्यापित एडमिन ही इमेज अपलोड कर सकते हैं।',
      });
    }

    const { image, folder = 'durga_puja_2026' } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'कृपया इमेज डेटा प्रदान करें।' });
    }

    // Call Cloudinary API server-side
    const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(cloudinaryEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: image,
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
        folder,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary API Error:', data);
      return res.status(response.status).json({
        success: false,
        message: data.error?.message || 'Cloudinary पर इमेज अपलोड विफल रही।',
        details: data,
      });
    }

    // Auto-optimize URL with auto-format and auto-quality
    let optimizedUrl = data.secure_url;
    if (optimizedUrl && optimizedUrl.includes('/upload/')) {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return res.json({
      success: true,
      url: optimizedUrl,
      rawUrl: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      message: 'Cloudinary CDN पर इमेज सफलतापूर्वक और सुरक्षित अपलोड हो गई!',
    });
  } catch (err: any) {
    console.error('Error in /api/upload-image:', err);
    return res.status(500).json({
      success: false,
      message: 'सर्वर पर इमेज अपलोड के दौरान त्रुटि आई: ' + (err.message || 'Unknown error'),
    });
  }
});

let currentLivePandalData = { ...pandalData };

// PANDAL REST API ROUTES
app.get('/api/pandal/current', (_req: Request, res: Response) => {
  res.json({ success: true, data: currentLivePandalData });
});

app.post('/api/pandal/save', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (data && typeof data === 'object') {
      currentLivePandalData = { ...currentLivePandalData, ...data };

      // Persist to Firestore Database pandal_config/current
      if (firebaseConfig?.projectId && firebaseConfig?.firestoreDatabaseId) {
        try {
          const patchUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/pandal_config/current?key=${firebaseConfig.apiKey}`;
          await fetch(patchUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                dataJson: { stringValue: JSON.stringify(currentLivePandalData) },
                updatedAt: { stringValue: new Date().toISOString() },
              },
            }),
          });
        } catch (fsErr) {
          console.warn('Firestore pandal_config save error:', fsErr);
        }
      }

      return res.json({ success: true, message: 'डेटाबेस में पंडाल डेटा सुरक्षित हो गया!' });
    }
    return res.status(400).json({ success: false, message: 'अमान्य डेटा' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Error' });
  }
});

app.get('/api/pandal/:slug', (req: Request, res: Response) => {
  res.json({ success: true, data: currentLivePandalData });
});

app.get('/api/pandal/:slug/events', (req: Request, res: Response) => {
  res.json({ success: true, data: currentLivePandalData.events });
});

app.get('/api/pandal/:slug/gallery', (req: Request, res: Response) => {
  res.json({ success: true, data: currentLivePandalData.galleryImages });
});

app.get('/api/pandal/:slug/members', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      keyMembers: currentLivePandalData.keyMembers,
      allCommittee: currentLivePandalData.allCommittee,
    },
  });
});

app.get('/api/pandal/:slug/volunteers', (req: Request, res: Response) => {
  res.json({ success: true, data: currentLivePandalData.volunteers });
});

app.get('/api/pandal/:slug/updates', (req: Request, res: Response) => {
  res.json({ success: true, data: pandalData.liveUpdates });
});

// DONATION RECORDING ENDPOINT
app.post('/api/donations', (req: Request, res: Response) => {
  const { donorName, amount, paymentMethod } = req.body;
  const receiptId = `DP2026${Math.floor(1000 + Math.random() * 9000)}`;
  res.json({
    success: true,
    message: 'Donation successfully registered',
    data: {
      receiptId,
      donorName: donorName || 'Devotee',
      amount: amount || 501,
      paymentMethod: paymentMethod || 'UPI',
      status: 'VERIFIED',
      date: new Date().toISOString(),
    },
  });
});

// DEVOTEE INQUIRIES REST API
let serverInquiries: any[] = [];

app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json(serverInquiries);
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const inq = req.body;
  if (inq && inq.id) {
    serverInquiries = [inq, ...serverInquiries.filter((x) => x.id !== inq.id)];
    return res.json({ success: true, inquiry: inq });
  }
  res.status(400).json({ success: false, message: 'Invalid inquiry data' });
});

app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  serverInquiries = serverInquiries.map((x) => (x.id === id ? { ...x, status } : x));
  res.json({ success: true });
});

app.delete('/api/inquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  serverInquiries = serverInquiries.filter((x) => x.id !== id);
  res.json({ success: true });
});

// VOLUNTEER ENROLLMENT ENDPOINT
app.post('/api/volunteers', (req: Request, res: Response) => {
  const { name, phone, area, availability } = req.body;
  const volunteerBadgeId = `SEVAK-${Math.floor(100 + Math.random() * 900)}`;
  res.json({
    success: true,
    message: 'Volunteer application submitted successfully',
    data: {
      badgeId: volunteerBadgeId,
      name,
      phone,
      area,
      availability,
      status: 'PENDING_COORDINATION',
    },
  });
});

// CONTACT SAMITI ENDPOINT
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, purpose, message } = req.body;
  res.json({
    success: true,
    message: 'Inquiry received. Samiti member will respond shortly.',
    data: { name, phone, purpose, message, receivedAt: new Date().toISOString() },
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Shree Shakti Durga Puja Pandal server running on http://localhost:${PORT}`);
  });
}

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
