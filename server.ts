import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bcrypt from 'bcryptjs';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { pandalData } from './src/data/pandalData';

const app = express();

const PORT = Number(process.env.PORT || 3000);

// ======================================================
// ENVIRONMENT VARIABLES
// ======================================================

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const ADMIN_PIN = process.env.ADMIN_PIN;

const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME || 'kushwahaarjun9970';

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || '';

const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.CLOUDINARY_UPLOAD_PRESET;


// ======================================================
// FIREBASE ADMIN INITIALIZATION
// ======================================================

let db: FirebaseFirestore.Firestore | null = null;

try {
  if (
    FIREBASE_PROJECT_ID &&
    FIREBASE_CLIENT_EMAIL &&
    FIREBASE_PRIVATE_KEY
  ) {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY,
        }),
      });
    }

    db = getFirestore();

    console.log('Firebase Admin SDK initialized.');
  } else {
    console.warn(
      'Firebase Admin environment variables are missing.'
    );
  }
} catch (error) {
  console.error(
    'Firebase Admin initialization failed:',
    error
  );
}


// ======================================================
// EXPRESS MIDDLEWARE
// ======================================================

app.use(
  express.json({
    limit: '25mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '25mb',
  })
);


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function normalizeUsername(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase();
}


function getAdminDocRef(username: string) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  return db.collection('admins').doc(username);
}


async function getAdmin(username: string) {
  if (!db) return null;

  const doc = await getAdminDocRef(username).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as any;
}


async function saveAdmin(
  username: string,
  data: Record<string, any>
) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  await getAdminDocRef(username).set(
    data,
    {
      merge: true,
    }
  );
}


/**
 * Password verification.
 *
 * New records:
 *     bcrypt hash
 *
 * Old records:
 *     plain text password
 *
 * If an old plain text password is found and matches,
 * it is automatically converted to bcrypt hash.
 */
async function verifyPassword(
  admin: any,
  password: string
): Promise<boolean> {

  if (!admin?.password || !password) {
    return false;
  }

  const storedPassword = String(admin.password);

  // New bcrypt password
  if (
    storedPassword.startsWith('$2a$') ||
    storedPassword.startsWith('$2b$') ||
    storedPassword.startsWith('$2y$')
  ) {
    return bcrypt.compare(
      password,
      storedPassword
    );
  }

  // Legacy plain-text password
  if (storedPassword === password) {

    // Automatically upgrade old password
    // to bcrypt hash.
    if (db && admin.id) {
      try {
        const hash = await bcrypt.hash(
          password,
          12
        );

        await getAdminDocRef(admin.id).set(
          {
            password: hash,
            updatedAt: new Date().toISOString(),
          },
          {
            merge: true,
          }
        );
      } catch (error) {
        console.warn(
          'Could not upgrade old password:',
          error
        );
      }
    }

    return true;
  }

  return false;
}


async function isAdminAuthorized(
  req: Request
): Promise<boolean> {

  const providedPin =
    req.headers['x-admin-pin'] ||
    req.body?.adminPin ||
    req.body?.pin;

  if (!providedPin) {
    return false;
  }

  const pin = String(providedPin).trim();

  const username =
    normalizeUsername(
      req.body?.username ||
      req.headers['x-admin-username'] ||
      ADMIN_USERNAME
    );

  const admin = await getAdmin(username);

  if (admin) {
    return verifyPassword(admin, pin);
  }

  // First-time bootstrap.
  // ADMIN_PIN exists ONLY in Vercel environment variables.
  if (
    username === normalizeUsername(ADMIN_USERNAME) &&
    ADMIN_PIN &&
    pin === ADMIN_PIN
  ) {
    return true;
  }

  return false;
}


// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    server: 'online',
    firestore: Boolean(db),
    timestamp: new Date().toISOString(),
  });
});


// ======================================================
// ADMIN LOGIN
// ======================================================

app.post(
  '/api/admin/db-login',
  async (req: Request, res: Response) => {

    try {

      const {
        username,
        password,
      } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message:
            'यूज़रनेम और पासवर्ड दोनों दर्ज करना अनिवार्य है।',
        });
      }

      const cleanUser =
        normalizeUsername(username);

      const cleanPass =
        String(password).trim();

      let admin =
        await getAdmin(cleanUser);

      // --------------------------------------------------
      // Existing Firestore admin
      // --------------------------------------------------

      if (admin) {

        const valid =
          await verifyPassword(
            admin,
            cleanPass
          );

        if (!valid) {
          return res.status(401).json({
            success: false,
            authorized: false,
            message:
              'अमान्य यूज़रनेम या पासवर्ड।',
          });
        }

        return res.json({
          success: true,
          authorized: true,
          user: {
            username: cleanUser,
            email: admin.email || '',
            displayName:
              admin.displayName ||
              cleanUser,
            role:
              admin.role ||
              'admin',
          },
          message:
            `स्वागत है ${
              admin.displayName || cleanUser
            }! प्रमाणीकरण सफल हुआ।`,
        });
      }


      // --------------------------------------------------
      // First-time master admin bootstrap
      // --------------------------------------------------

      const allowedMasterUsers = [
        normalizeUsername(ADMIN_USERNAME),
        'admin',
        'arjun',
      ];

      const isMasterUser =
        allowedMasterUsers.includes(
          cleanUser
        );

      if (
        isMasterUser &&
        ADMIN_PIN &&
        cleanPass === ADMIN_PIN
      ) {

        if (!db) {
          return res.status(500).json({
            success: false,
            message:
              'Firestore connection उपलब्ध नहीं है।',
          });
        }

        const passwordHash =
          await bcrypt.hash(
            cleanPass,
            12
          );

        await saveAdmin(
          normalizeUsername(
            ADMIN_USERNAME
          ),
          {
            username:
              normalizeUsername(
                ADMIN_USERNAME
              ),

            email:
              ADMIN_EMAIL,

            password:
              passwordHash,

            displayName:
              'Super Admin',

            role:
              'super_admin',

            isActive:
              true,

            updatedAt:
              new Date().toISOString(),
          }
        );

        return res.json({
          success: true,
          authorized: true,

          user: {
            username:
              normalizeUsername(
                ADMIN_USERNAME
              ),

            email:
              ADMIN_EMAIL,

            displayName:
              'Super Admin',

            role:
              'super_admin',
          },

          message:
            'Super Admin login successful.',
        });
      }


      return res.status(401).json({
        success: false,
        authorized: false,
        message:
          'अमान्य यूज़रनेम या पासवर्ड।',
      });

    } catch (error) {

      console.error(
        'Admin login error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Login के दौरान server error आया।',
      });
    }
  }
);


// ======================================================
// ADMIN PIN VERIFY
// ======================================================

app.post(
  '/api/admin/verify-pin',
  async (req: Request, res: Response) => {

    try {

      const {
        pin,
        username,
      } = req.body;

      if (!pin) {
        return res.status(400).json({
          success: false,
          message:
            'पिन दर्ज करना अनिवार्य है।',
        });
      }

      const cleanUser =
        normalizeUsername(
          username ||
          ADMIN_USERNAME
        );

      const admin =
        await getAdmin(cleanUser);

      if (admin) {

        const valid =
          await verifyPassword(
            admin,
            String(pin).trim()
          );

        if (valid) {
          return res.json({
            success: true,
            authorized: true,
            message:
              'प्रमाणीकरण सफल! स्वागत है।',
          });
        }

      } else if (
        cleanUser ===
          normalizeUsername(ADMIN_USERNAME) &&
        ADMIN_PIN &&
        String(pin).trim() === ADMIN_PIN
      ) {

        return res.json({
          success: true,
          authorized: true,
          message:
            'प्रमाणीकरण सफल! स्वागत है।',
        });
      }

      return res.status(401).json({
        success: false,
        authorized: false,
        message:
          'अमान्य सुरक्षा पिन।',
      });

    } catch (error) {

      console.error(
        'PIN verification error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'PIN verification failed.',
      });
    }
  }
);


// ======================================================
// ADMIN PIN UPDATE
// ======================================================

app.post(
  '/api/admin/update-pin',
  async (req: Request, res: Response) => {

    try {

      const {
        newPin,
        username,
      } = req.body;

      const currentPin =
        req.headers['x-admin-pin'] ||
        req.body?.currentPin;

      if (!newPin) {
        return res.status(400).json({
          success: false,
          message:
            'नया पासवर्ड दर्ज करें।',
        });
      }

      const cleanNew =
        String(newPin).trim();

      if (cleanNew.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            'नया पासवर्ड कम से कम 6 characters का होना चाहिए।',
        });
      }

      if (!currentPin) {
        return res.status(401).json({
          success: false,
          message:
            'Current PIN required.',
        });
      }

      const cleanUser =
        normalizeUsername(
          username ||
          ADMIN_USERNAME
        );

      const admin =
        await getAdmin(cleanUser);

      let authorized = false;

      if (admin) {

        authorized =
          await verifyPassword(
            admin,
            String(currentPin).trim()
          );

      } else if (
        cleanUser ===
          normalizeUsername(ADMIN_USERNAME) &&
        ADMIN_PIN &&
        String(currentPin).trim() === ADMIN_PIN
      ) {

        authorized = true;
      }

      if (!authorized) {
        return res.status(401).json({
          success: false,
          message:
            'Current PIN गलत है।',
        });
      }

      const newPasswordHash =
        await bcrypt.hash(
          cleanNew,
          12
        );

      await saveAdmin(
        cleanUser,
        {
          username: cleanUser,
          password: newPasswordHash,
          updatedAt:
            new Date().toISOString(),
        }
      );

      return res.json({
        success: true,
        message:
          'नया पासवर्ड सुरक्षित रूप से Firestore में save हो गया।',
      });

    } catch (error) {

      console.error(
        'Update PIN error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Password update failed.',
      });
    }
  }
);


// ======================================================
// CLOUDINARY IMAGE UPLOAD
// ======================================================

app.post(
  '/api/upload-image',
  async (req: Request, res: Response) => {

    try {

      if (
        !CLOUDINARY_CLOUD_NAME ||
        !CLOUDINARY_UPLOAD_PRESET
      ) {
        return res.status(500).json({
          success: false,
          message:
            'Cloudinary environment variables missing.',
        });
      }

      const authorized =
        await isAdminAuthorized(req);

      if (!authorized) {
        return res.status(401).json({
          success: false,
          message:
            'अनधिकृत पहुंच।',
        });
      }

      const {
        image,
        folder = 'durga_puja_2026',
      } = req.body;

      if (!image) {
        return res.status(400).json({
          success: false,
          message:
            'कृपया image data प्रदान करें।',
        });
      }

      const cloudinaryEndpoint =
        `https://api.cloudinary.com/v1_1/` +
        `${CLOUDINARY_CLOUD_NAME}/image/upload`;

      const response =
        await fetch(
          cloudinaryEndpoint,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                file: image,
                upload_preset:
                  CLOUDINARY_UPLOAD_PRESET,
                folder,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        console.error(
          'Cloudinary API error:',
          data
        );

        return res.status(
          response.status
        ).json({
          success: false,
          message:
            data?.error?.message ||
            'Cloudinary upload failed.',
        });
      }

      let optimizedUrl =
        data.secure_url;

      if (
        optimizedUrl &&
        optimizedUrl.includes('/upload/')
      ) {

        optimizedUrl =
          optimizedUrl.replace(
            '/upload/',
            '/upload/f_auto,q_auto/'
          );
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
      });

    } catch (error: any) {

      console.error(
        'Cloudinary upload error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          'Image upload failed.',
      });
    }
  }
);


// ======================================================
// PANDAL DATA
// ======================================================

let currentLivePandalData = {
  ...pandalData,
};


// Get current pandal data
app.get(
  '/api/pandal/current',
  async (_req, res) => {

    try {

      if (db) {

        const doc =
          await db
            .collection('pandal_config')
            .doc('current')
            .get();

        if (doc.exists) {

          const firestoreData =
            doc.data();

          if (
            firestoreData?.dataJson
          ) {

            try {

              currentLivePandalData =
                JSON.parse(
                  String(
                    firestoreData.dataJson
                  )
                );

            } catch {
              // Keep current data
            }
          }
        }
      }

      return res.json({
        success: true,
        data:
          currentLivePandalData,
      });

    } catch (error) {

      console.error(
        'Get pandal error:',
        error
      );

      return res.json({
        success: true,
        data:
          currentLivePandalData,
      });
    }
  }
);


// Save pandal data
app.post(
  '/api/pandal/save',
  async (req: Request, res: Response) => {

    try {

      const authorized =
        await isAdminAuthorized(req);

      if (!authorized) {
        return res.status(401).json({
          success: false,
          message:
            'केवल authorized admin pandal data save कर सकता है।',
        });
      }

      const {
        data,
      } = req.body;

      if (
        !data ||
        typeof data !== 'object'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'अमान्य डेटा।',
        });
      }

      currentLivePandalData = {
        ...currentLivePandalData,
        ...data,
      };

      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            'Firestore उपलब्ध नहीं है।',
        });
      }

      await db
        .collection('pandal_config')
        .doc('current')
        .set(
          {
            dataJson:
              JSON.stringify(
                currentLivePandalData
              ),

            updatedAt:
              new Date().toISOString(),
          },
          {
            merge: true,
          }
        );

      return res.json({
        success: true,
        message:
          'डेटाबेस में पंडाल डेटा सुरक्षित हो गया।',
      });

    } catch (error: any) {

      console.error(
        'Pandal save error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          'Pandal save failed.',
      });
    }
  }
);


// ======================================================
// PANDAL ROUTES
// ======================================================

app.get(
  '/api/pandal/:slug',
  async (_req, res) => {

    try {

      if (db) {

        const doc =
          await db
            .collection('pandal_config')
            .doc('current')
            .get();

        if (doc.exists) {

          const data =
            doc.data();

          if (data?.dataJson) {

            try {
              currentLivePandalData =
                JSON.parse(
                  String(data.dataJson)
                );
            } catch {}
          }
        }
      }

      return res.json({
        success: true,
        data:
          currentLivePandalData,
      });

    } catch {

      return res.json({
        success: true,
        data:
          currentLivePandalData,
      });
    }
  }
);


app.get(
  '/api/pandal/:slug/events',
  (_req, res) => {

    res.json({
      success: true,
      data:
        currentLivePandalData.events,
    });

  }
);


app.get(
  '/api/pandal/:slug/gallery',
  (_req, res) => {

    res.json({
      success: true,
      data:
        currentLivePandalData.galleryImages,
    });

  }
);


app.get(
  '/api/pandal/:slug/members',
  (_req, res) => {

    res.json({
      success: true,

      data: {
        keyMembers:
          currentLivePandalData.keyMembers,

        allCommittee:
          currentLivePandalData.allCommittee,
      },
    });

  }
);


app.get(
  '/api/pandal/:slug/volunteers',
  (_req, res) => {

    res.json({
      success: true,
      data:
        currentLivePandalData.volunteers,
    });

  }
);


app.get(
  '/api/pandal/:slug/updates',
  (_req, res) => {

    res.json({
      success: true,
      data:
        pandalData.liveUpdates,
    });

  }
);


// ======================================================
// DONATIONS
// ======================================================

app.post(
  '/api/donations',
  async (req: Request, res: Response) => {

    try {

      const {
        donorName,
        amount,
        paymentMethod,
      } = req.body;

      const receiptId =
        `DP2026${Date.now()}`;

      const donation = {
        receiptId,
        donorName:
          donorName || 'Devotee',
        amount:
          amount || 501,
        paymentMethod:
          paymentMethod || 'UPI',
        status:
          'RECEIVED',
        date:
          new Date().toISOString(),
      };

      if (db) {

        await db
          .collection('donations')
          .doc(receiptId)
          .set(donation);
      }

      return res.json({
        success: true,
        message:
          'Donation successfully registered',
        data: donation,
      });

    } catch (error) {

      console.error(
        'Donation error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Donation save failed.',
      });
    }
  }
);


// ======================================================
// INQUIRIES
// ======================================================

app.get(
  '/api/inquiries',
  async (_req, res) => {

    try {

      if (!db) {
        return res.json([]);
      }

      const snapshot =
        await db
          .collection('inquiries')
          .orderBy(
            'createdAt',
            'desc'
          )
          .limit(100)
          .get();

      const inquiries =
        snapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      return res.json(inquiries);

    } catch (error) {

      console.error(
        'Get inquiries error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Could not load inquiries.',
      });
    }
  }
);


app.post(
  '/api/inquiries',
  async (req: Request, res: Response) => {

    try {

      const inq =
        req.body;

      if (!inq) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid inquiry data.',
        });
      }

      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            'Firestore unavailable.',
        });
      }

      const id =
        String(
          inq.id ||
          `${Date.now()}`
        );

      await db
        .collection('inquiries')
        .doc(id)
        .set(
          {
            ...inq,
            id,
            createdAt:
              new Date().toISOString(),
          },
          {
            merge: true,
          }
        );

      return res.json({
        success: true,
        inquiry: {
          ...inq,
          id,
        },
      });

    } catch (error) {

      console.error(
        'Create inquiry error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Could not save inquiry.',
      });
    }
  }
);


app.patch(
  '/api/inquiries/:id',
  async (req: Request, res: Response) => {

    try {

      const authorized =
        await isAdminAuthorized(req);

      if (!authorized) {
        return res.status(401).json({
          success: false,
          message:
            'Unauthorized.',
        });
      }

      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            'Firestore unavailable.',
        });
      }

      await db
        .collection('inquiries')
        .doc(req.params.id)
        .set(
          {
            ...req.body,
            updatedAt:
              new Date().toISOString(),
          },
          {
            merge: true,
          }
        );

      return res.json({
        success: true,
      });

    } catch (error) {

      console.error(
        'Update inquiry error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Could not update inquiry.',
      });
    }
  }
);


app.delete(
  '/api/inquiries/:id',
  async (req: Request, res: Response) => {

    try {

      const authorized =
        await isAdminAuthorized(req);

      if (!authorized) {
        return res.status(401).json({
          success: false,
          message:
            'Unauthorized.',
        });
      }

      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            'Firestore unavailable.',
        });
      }

      await db
        .collection('inquiries')
        .doc(req.params.id)
        .delete();

      return res.json({
        success: true,
      });

    } catch (error) {

      console.error(
        'Delete inquiry error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Could not delete inquiry.',
      });
    }
  }
);


// ======================================================
// VOLUNTEERS
// ======================================================

app.post(
  '/api/volunteers',
  async (req: Request, res: Response) => {

    try {

      const {
        name,
        phone,
        area,
        availability,
      } = req.body;

      const volunteerBadgeId =
        `SEVAK-${Math.floor(
          100000 + Math.random() * 900000
        )}`;

      const volunteer = {
        badgeId:
          volunteerBadgeId,

        name,
        phone,
        area,
        availability,

        status:
          'PENDING_COORDINATION',

        createdAt:
          new Date().toISOString(),
      };

      if (db) {

        await db
          .collection('volunteers')
          .doc(volunteerBadgeId)
          .set(volunteer);
      }

      return res.json({
        success: true,
        message:
          'Volunteer application submitted successfully',
        data: volunteer,
      });

    } catch (error) {

      console.error(
        'Volunteer error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Volunteer submission failed.',
      });
    }
  }
);


// ======================================================
// CONTACT
// ======================================================

app.post(
  '/api/contact',
  async (req: Request, res: Response) => {

    try {

      const {
        name,
        phone,
        purpose,
        message,
      } = req.body;

      const contactId =
        `CONTACT-${Date.now()}`;

      const contact = {
        id: contactId,
        name,
        phone,
        purpose,
        message,
        receivedAt:
          new Date().toISOString(),
      };

      if (db) {

        await db
          .collection('contacts')
          .doc(contactId)
          .set(contact);
      }

      return res.json({
        success: true,
        message:
          'Inquiry received. Samiti member will respond shortly.',
        data: contact,
      });

    } catch (error) {

      console.error(
        'Contact error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Contact submission failed.',
      });
    }
  }
);


// ======================================================
// LOCAL DEVELOPMENT
// ======================================================

async function startLocalServer() {

  if (
    process.env.NODE_ENV === 'production'
  ) {

    const distPath =
      path.resolve(
        process.cwd(),
        'dist'
      );

    app.use(
      express.static(distPath)
    );

    app.get(
      '*',
      (_req, res) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      }
    );

  } else {

    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: 'spa',
      });

    app.use(
      vite.middlewares
    );
  }

  app.listen(
    PORT,
    () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    }
  );
}


// ======================================================
// START ONLY LOCALLY
// ======================================================

if (
  process.env.NODE_ENV !== 'test' &&
  !process.env.VERCEL
) {
  startLocalServer();
}


// ======================================================
// VERCEL / EXPRESS EXPORT
// ======================================================

export default app;
