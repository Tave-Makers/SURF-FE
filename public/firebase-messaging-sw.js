
importScripts('/firebasejs/firebase-app-compat.js');
importScripts('/firebasejs/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAayTPxtppeBq3fQZnN80uwstXncEhXh0M",
  authDomain: "tave-surf-dev.firebaseapp.com",
  projectId: "tave-surf-dev",
  storageBucket: "tave-surf-dev.firebasestorage.app",
  messagingSenderId: "669088616704",
  appId: "1:669088616704:web:32531f3ea58816db8a23e5",
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
