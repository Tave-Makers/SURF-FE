export type SettingsItemType = {
  id: string;
  leftIconName: string;
  text: string;
  action:
    | { type: 'NAVIGATE'; payload: string /* 페이지 이동 */ }
    | { type: 'OPEN_ALERT'; payload: string /* Alert 창 열림 */ };
};
