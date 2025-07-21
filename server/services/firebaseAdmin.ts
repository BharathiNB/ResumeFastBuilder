import admin from 'firebase-admin';

let isInitialized = false;

// Initialize Firebase Admin SDK
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    isInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

// Mock implementations for development when Firebase Admin is not available
export const auth = isInitialized ? admin.auth() : {
  verifyIdToken: async (token: string) => {
    // Mock token verification for development
    if (token === 'mock-token') {
      return {
        uid: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User',
        picture: null,
      };
    }
    throw new Error('Invalid token');
  }
};

export const firestore = isInitialized ? admin.firestore() : null;

export async function verifyToken(token: string) {
  try {
    if (!isInitialized) {
      // For development without Firebase Admin, accept any token and return mock user
      return {
        uid: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User',
        picture: null,
      };
    }
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
