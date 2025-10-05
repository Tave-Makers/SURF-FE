import type { IconName } from '@/shared/ui/icon/SurfIcon';
// Alert 종류 정의
export type AlertType = 'logout' | 'withdraw' | null;

// action 타입 정의
export type Action =
  | { type: 'NAVIGATE'; payload: string } // 페이지 이동
  | { type: 'OPEN_ALERT'; payload: AlertType }; // Alert 창 열림

// SettingsItemType
export type SettingsItemType = {
  id: string;
  leftIconName: IconName;
  text: string;
  action: Action;
};
