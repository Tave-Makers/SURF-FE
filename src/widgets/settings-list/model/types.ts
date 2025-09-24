export type SettingsItemType = {
  id: string;
  leftIconName: string;
  text: string;
  action: {
    type: 'NAVIGATE' | 'OPEN_ALERT';
    payload: string;
  };
};
