// Firebase 서비스 워커 스크립트
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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

// 설정값이 있을 때만 초기화
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  
  const messaging = firebase.messaging();

  // 백그라운드 메시지 수신 핸들러
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] 백그라운드 알림 수신:', payload);

    // 알림 내용 추출   
    const notificationTitle = payload.data.body || '알림';
    const notificationOptions = {
      body: payload.data.body || '',
      icon: '/icons/icon-192x192.png', // TODO: 앱 아이콘 경로로 변경
      data: {
        url: payload.data.deepLink || '/' // 클릭 시 이동할 주소
      }
    };

    // 브라우저 알림 표시
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.error('[SW] Firebase Config가 전달되지 않았습니다.');
}
