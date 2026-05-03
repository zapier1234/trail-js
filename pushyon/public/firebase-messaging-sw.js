/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBMk9ZfMQRlbHm5ATQUw-4GC0-HljOthwI",
  authDomain: "pushnotif-53932.firebaseapp.com",
  projectId: "pushnotif-53932",
  storageBucket: "pushnotif-53932.firebasestorage.app",
  messagingSenderId: "746061387270",
  appId: "1:746061387270:web:d4208c201cacfa6af55587",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "PushyOn Notification";
  const options = {
    body: payload.notification?.body || payload.data?.message || "You have a new notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/dashboard"));
});
