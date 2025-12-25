import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envConfig = dotenv.config({ path: '.env.local' }).parsed || {};
const defaultConfig = dotenv.config({ path: '.env' }).parsed || {};
const env = { ...defaultConfig, ...envConfig, ...process.env };

const swContent = `
importScripts('/firebasejs/firebase-app-compat.js');
importScripts('/firebasejs/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "${env.NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${env.NEXT_PUBLIC_FIREBASE_APP_ID}",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 백그라운드 알림 수신:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || '알림';
  const notificationBody = payload.notification?.body || payload.data?.body || '';
  let targetUrl = payload.data?.deepLink || '/';

  try {
    const urlObj = new URL(targetUrl, self.location.origin);
    if (urlObj.origin !== self.location.origin) {
      targetUrl = '/';
    }
  } catch (e) {
    targetUrl = '/';
  }

  const notificationOptions = {
    body: notificationBody,
    icon: '/icons/icon-192x192.png', // TODO: 수정 필요
    data: { url: targetUrl }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
`;

const publicDir = path.join(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'firebase-messaging-sw.js'), swContent);
