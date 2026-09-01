/** 네이티브 SDK 로그인을 맡길 수 있는 소셜 로그인 수단. */
export type NativeSocialProvider = 'KAKAO' | 'APPLE';

/** 네이티브 앱 WebView 로 보내는 메시지. 앱의 parseBridgeMessage 가 받는 타입과 같아야 한다. */
export type NativeBridgeMessage =
  | {
      type: 'LOGGED_OUT';
      /** 앱은 로그인 오버레이가 웹 화면을 덮고 있어 웹 토스트가 보이지 않는다. 같은 문구를 대신 띄우라고 넘긴다 */
      message?: string;
    }
  | {
      /**
       * 소셜 로그인을 앱에 맡긴다.
       * 앱이 SDK 로 로그인한 뒤 세션 쿠키까지 심고 /login/callback 으로 보내준다.
       */
      type: 'SOCIAL_LOGIN';
      provider: NativeSocialProvider;
    };

declare global {
  interface Window {
    /** 네이티브 앱 WebView 에서만 주입된다. */
    ReactNativeWebView?: { postMessage: (message: string) => void };
    /**
     * 네이티브 앱 WebView 에서만 주입된다. 필드는 앱의 buildInitScript 가 정한다.
     * socialLogin 은 SOCIAL_LOGIN 메시지를 이해하는 앱 버전에만 있다.
     */
    __SURF_NATIVE__?: { platform: string; socialLogin?: boolean };
    __SURF_NATIVE_PUSH__?: unknown;
  }
}

/**
 * 앱이 소셜 로그인을 대신해 줄 수 있는지.
 *
 * 웹은 즉시 배포되지만 앱은 심사를 거쳐 천천히 올라간다.
 * 이 플래그가 없는 옛 앱에 SOCIAL_LOGIN 을 보내면 아무 일도 일어나지 않으므로,
 * 앱이 스스로 할 수 있다고 밝힌 경우에만 넘긴다.
 */
export const canNativeSocialLogin = () =>
  typeof window !== 'undefined' && window.__SURF_NATIVE__?.socialLogin === true;

/**
 * 네이티브 앱에 메시지를 보낸다.
 *
 * LOGGED_OUT: 앱은 URL 이 /login 이 된 것을 보고 로그아웃을 추측하는 경로도 함께 갖고 있다(세션 만료 등).
 * 사용자가 직접 끝낸 세션은 라우팅을 기다리지 않고 여기서 곧바로 알려 준다.
 * 일반 브라우저에는 ReactNativeWebView 가 없으므로 아무 일도 일어나지 않는다.
 */
export const postToNative = (message: NativeBridgeMessage) => {
  if (typeof window === 'undefined') return;

  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
};
