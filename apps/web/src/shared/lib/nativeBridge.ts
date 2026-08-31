/** 네이티브 앱 WebView 로 보내는 메시지. 앱의 parseBridgeMessage 가 받는 타입과 같아야 한다. */
export type NativeBridgeMessage = {
  type: 'LOGGED_OUT';
  /** 앱은 로그인 오버레이가 웹 화면을 덮고 있어 웹 토스트가 보이지 않는다. 같은 문구를 대신 띄우라고 넘긴다 */
  message?: string;
};

declare global {
  interface Window {
    /** 네이티브 앱 WebView 에서만 주입된다. */
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

/**
 * 세션이 끝났음을 네이티브 앱에 알린다.
 *
 * 앱은 URL 이 /login 이 된 것을 보고 로그아웃을 추측하는 경로도 함께 갖고 있다(세션 만료 등).
 * 사용자가 직접 끝낸 세션은 라우팅을 기다리지 않고 여기서 곧바로 알려 준다.
 * 일반 브라우저에는 ReactNativeWebView 가 없으므로 아무 일도 일어나지 않는다.
 */
export const postToNative = (message: NativeBridgeMessage) => {
  if (typeof window === 'undefined') return;

  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
};
