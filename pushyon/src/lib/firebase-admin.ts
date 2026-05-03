import admin from "firebase-admin";

function getFirebaseAdmin(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<string> {
  const app = getFirebaseAdmin();

  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    data: data || {},
    webpush: {
      notification: {
        title,
        body,
        icon: "/icon-192.png",
      },
    },
  };

  return app.messaging().send(message);
}

export async function sendPushToMultiple(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<admin.messaging.BatchResponse> {
  const app = getFirebaseAdmin();

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title, body },
    data: data || {},
    webpush: {
      notification: {
        title,
        body,
        icon: "/icon-192.png",
      },
    },
  };

  return app.messaging().sendEachForMulticast(message);
}

export default admin;
