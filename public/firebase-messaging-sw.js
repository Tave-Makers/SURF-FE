// Firebase 서비스 워커 스크립트
importScripts('/firebasejs/firebase-app-compat.js');
importScripts('/firebasejs/firebase-messaging-compat.js');

// URL 쿼리 파라미터 파싱 함수
const getQueryParam = (key) => {
  return new URL(self.location.href).searchParams.get(key);
};

// 파라미터에서 설정값 가져오기
const firebaseConfig = {
  apiKey: getQueryParam('apiKey'),
  authDomain: getQueryParam('authDomain'),
  projectId: getQueryParam('projectId'),
  storageBucket: getQueryParam('storageBucket'),
  messagingSenderId: getQueryParam('messagingSenderId'),
  appId: getQueryParam('appId'),
};

const requiredKeys = ['apiKey', 'projectId', 'messagingSenderId', 'appId'];
const isValidConfig = requiredKeys.every((key) => !!firebaseConfig[key]);

// 설정값이 있을 때만 초기화
if (isValidConfig) {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // 백그라운드 메시지 수신 핸들러
    messaging.onBackgroundMessage((payload) => {
      console.log('[SW] 백그라운드 알림 수신:', payload);

      const notificationTitle = 
        payload.notification?.title || 
        payload.data?.title || 
        '알림';
      
      const notificationBody = 
        payload.notification?.body || 
        payload.data?.body || 
        '';

      let targetUrl = payload.data?.deepLink || '/';
      
      try {
        const urlObj = new URL(targetUrl, self.location.origin);
        if (urlObj.origin !== self.location.origin) {
            console.warn('[SW] 허용되지 않은 외부 URL입니다. 홈으로 리다이렉트합니다.', targetUrl);
            targetUrl = '/';
        }
      } catch (e) {
        targetUrl = '/';
      }

      const notificationOptions = {
        body: notificationBody,
        icon: '/icons/icon-192x192.png',  // TODO: 경로 수정 필요
        data: {
          url: targetUrl
        }
      };

      return self.registration.showNotification(notificationTitle, notificationOptions)
        .catch((err) => {
          console.error('[SW] 알림 표시 실패:', err);
        });
    });
  } catch (error) {
    console.error('[SW] Firebase 초기화 중 에러 발생:', error);
  }
} else {
  console.error('[SW] 필수 Firebase 설정값이 누락되었습니다.');
}
