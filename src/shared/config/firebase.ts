// firebase 초기화 및 설정
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 중복 초기화 방지
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messagingInstance: Messaging | null = null;

/**
 * Firebase Messaging 인스턴스를 반환합니다.
 * 클라이언트 환경에서만 호출 가능합니다.
 */
export function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(app);
  }

  return messagingInstance;
}
