import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBMk9ZfMQRlbHm5ATQUw-4GC0-HljOthwI",
  authDomain: "pushnotif-53932.firebaseapp.com",
  projectId: "pushnotif-53932",
  storageBucket: "pushnotif-53932.firebasestorage.app",
  messagingSenderId: "746061387270",
  appId: "1:746061387270:web:d4208c201cacfa6af55587",
  measurementId: "G-J4B8JHYJ1C",
};

const VAPID_KEY = "BIl16lrXl3ShUY1YnEy86SiR9u1PwbxlQSRbA8JYYshfxhhBV97iFjCUcxj3J3kCvryhEBj8aIchOTo0hgSPChU";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messagingInstance: Messaging | null = null;

async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;
  if (!messagingInstance) {
    messagingInstance = getMessaging(app);
  }
  return messagingInstance;
}

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"),
    });

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export async function onForegroundMessage(callback: (payload: { title?: string; body?: string; data?: Record<string, string> }) => void) {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback({
      title: payload.notification?.title,
      body: payload.notification?.body,
      data: payload.data,
    });
  });
}
