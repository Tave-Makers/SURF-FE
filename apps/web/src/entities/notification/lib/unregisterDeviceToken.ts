import { getNativePushToken } from '@/shared/lib/nativePush';
import { deleteDeviceToken } from '../api/deleteDeviceToken';
import { clearDeviceTokenRegistration, readRegisteredDeviceToken } from './deviceTokenStorage';

/**
 * 이 기기의 FCM 토큰 등록을 해제한다.
 *
 * access token이 살아있을 때만 삭제할 수 있으므로 `/auth/logout` **전에** 호출한다.
 * 지우지 않으면 로그아웃한 뒤에도 이 기기로 푸시가 계속 가고,
 * 기기를 공유하거나 다른 계정으로 재로그인하면 남의 알림이 뜬다.
 *
 * 삭제에 실패해도 로그아웃은 막지 않는다 — 푸시가 잠시 더 오는 편이 로그아웃 실패보다 낫다.
 */
export async function unregisterDeviceToken(): Promise<void> {
  // 네이티브는 저장소가 비어 있어도 주입된 토큰을 바로 읽을 수 있다
  const token = readRegisteredDeviceToken() ?? getNativePushToken()?.token ?? null;

  try {
    if (token) await deleteDeviceToken({ token });
  } catch (error) {
    console.error('디바이스 토큰 삭제 실패:', error);
  } finally {
    clearDeviceTokenRegistration();
  }
}
