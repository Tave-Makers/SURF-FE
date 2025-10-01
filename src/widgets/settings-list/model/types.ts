import type { ComponentProps } from 'react';
import type { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type SettingsItemType = {
  id: string;
  leftIconName: SurfIconName;
  text: string;
  action:
    | { type: 'NAVIGATE'; payload: string /* 페이지 이동 */ }
    | { type: 'OPEN_ALERT'; payload: string /* Alert 창 열림 */ };
};
