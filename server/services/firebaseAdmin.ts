import admin from "firebase-admin";

let isInitialized = false;

// Initialize Firebase Admin SDK
if (!admin.apps.length ) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: "resumefast-b7163",
        private_key_id: "dbab91b64f97df85ad01cb3482ff617dfc4f28c9",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDcF+7vjQrlF7eR\nb6ZKLQi/gY+31UH2u0aZV/S3AD9oo0ynAleSMomCt/ae6c4/qR5DWikTU91fcJu/\noZcVqFsN79U5b+V28K2/rgtKmNIJkhv144IQgFjqx+T1JDbuSWG3alJzySAOaEjc\nTqyQyO7QUtUbbNbzDVcXTFPov3A/XssrEmtPZXMV5AYf4En/GtqowzZgZqWgDfDY\nepB4W9hGXnozyPR9SeN8tv1XMF61N4ZJZVhGrtNKNhbtYGKhHX0CEZA9J39qmY7i\nmNGO0uhJp7N0aRTd1aKAmiw6Er1/+7eE/tQ/ETLa6Un2B0/LT7ldrU1YuCtLIW2T\nG9rxXMbDAgMBAAECggEAUhZPFGNba+Rzn7evory3JY3yB1NvndFtXGX0rIhYHfPB\n9AwokytsJCfuwIhdV1sBIYewCDhgOWdrf4aKLhazlzgbI6f7QmgztWj5ZyImPFGV\nQhlPek4UW8SgPVn7btZJrrnl9K9P2G/GtPxW2k1G3MX4G5l1dgNEtzjNluJHwCou\ngzNkbzYDUXwD+UimP/IEgiwBJbJyozKRolIYLXcgKFBojW1ZEwZovZk/G6HO007z\npN6kRLjZVtLV+pg3J/3eN03902WjeMxl5eCgbUKX+mwnYn71pcVx5tyIoRiKIHvW\nbf1P1fPzYQBoSD/STaqzE0A45EkXG1KadYvMrYIq2QKBgQD458MIb7iIUYAdvPPl\nWj1/8oweMLwAPtz+nx8Z8MOhg+Zzavf//Cqw77LXcRKf6w24xL2+thwF9qKaDBzg\neEsM7xfF/nbFCws6lExs5fov3Wf+WaojLLRI7RXuSaeh0jFTTqnapyS4qX5kLTtJ\ne/vyiWr1IVxKcKRh1NqcH9PnvwKBgQDiXe8xPqSgiY7X+2X4/iL8o2D2rLOeQELG\nCcTspGdRW3p/5mIvCTfKlPSDsGDaivguOx5K+AyDHaL1gebf0gd2UH53CmGv4obK\nrDfHScpOfBqnnlRS7eVJ56elrndJSkCVhcZkhgbrRjWbMmCwIUv/aBu3p49fJbCr\n2QBG4TcB/QKBgQCrSmuIqcHXZicB0CAUbUa3f4Z33Ff0304cmArCQlOPGoOEWE/1\nRWdnvn1YEEOd9BfMWPCvhwm//NwnoUBaJc6YRw4YPqcjsRb4KEh0BMxpFjhT7QbO\nEBy9txMJmnyXO1yglRkFFVOLFXGapRoQ1xcq8PC/Y0btH5mwjdgn6ytcZwKBgQCc\nxmvbkkQYP0zj/uQf73qxuEF2diOsTVsxpyBwuGgp645KuHd1lg/CySkTb3uUwDyk\nYCNZzrNzt3neSMpqZx7t7U+5CEKhuuSZx26WIl/vvXoEbt591O9BISR11gAdjURv\nigfeJQjzt1t3Egvu0BC/Yg4YQv9D6WmTiyXq8R3UzQKBgQDBEpJH80gZLP97kRFn\nNArxStXHCxv3v+s7s1kcwL2qBprKf093jekdlTmukqcy9jCt0BZOzIOrfKIX7Dsz\nA5UxJAsAfrB9DetEdIUZPDRmarjY8+GBe8M9jWPRdbzvH93rqUkou3m4a1Luz0Gd\ncH0+fXzhz7mvSn0tVo2sCY45cg==\n-----END PRIVATE KEY-----\n",
        client_email:
          "firebase-adminsdk-fbsvc@resumefast-b7163.iam.gserviceaccount.com",
        client_id: "113194152961949226398",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40resumefast-b7163.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      }),
      projectId: 'resumefast-b7163',
    });
    isInitialized = true;
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.warn("Firebase Admin initialization failed:", error);
  }
}

// Mock implementations for development when Firebase Admin is not available
export const auth = isInitialized
  ? admin.auth()
  : {
      verifyIdToken: async (token: string) => {
        // Mock token verification for development
        if (token === "mock-token") {
          return {
            uid: "demo-user-123",
            email: "demo@example.com",
            name: "Demo User",
            picture: null,
          };
        }
        throw new Error("Invalid token");
      },
    };

export const firestore = isInitialized ? admin.firestore() : null;

export async function verifyToken(token: string) {
  try {
    if (!isInitialized) {
      // For development without Firebase Admin, accept any token and return mock user
      return {
        uid: "demo-user-123",
        email: "demo@example.com",
        name: "Demo User",
        picture: null,
      };
    }
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
