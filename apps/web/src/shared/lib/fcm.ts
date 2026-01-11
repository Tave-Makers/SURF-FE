import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '@/shared/config/firebase';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function getFcmToken() {
  const messaging = getMessagingInstance();
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const swUrl = '/firebase-messaging-sw.js';

    const registration = await navigator.serviceWorker.register(swUrl);
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error('FCM 토큰 발급 실패:', error);
    return null;
  }
}
