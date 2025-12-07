'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { type Editor } from '@tiptap/react';

export const TOOLBAR_KEY = {
  CAMERA: 'camera',
  ALARM: 'alarm',
  CALENDAR: 'calendar',
  BOLD: 'bold',
} as const;

export type ToolbarKey = (typeof TOOLBAR_KEY)[keyof typeof TOOLBAR_KEY];

const baseItems: ToolBarItem<ToolbarKey>[] = [
  { key: TOOLBAR_KEY.CAMERA, label: '사진', icon: 'CameraSolid' },
  { key: TOOLBAR_KEY.ALARM, label: '예약', icon: 'AlarmSolid' },
  { key: TOOLBAR_KEY.CALENDAR, label: '일정', icon: 'CalendarSolid' },
  { key: TOOLBAR_KEY.BOLD, label: '굵게', icon: 'LetterBSolid' },
];

type Props = {
  editor: Editor; // 볼드체 버튼 클릭시 굵기를 조절하는 포스트 에디터
  onCameraClick: () => void; // 파일 탐색기 여는 콜백
};

export const PostEditorToolbar = ({ editor, onCameraClick }: Props) => {
  const actionMap: Record<ToolbarKey, () => void> = {
    [TOOLBAR_KEY.BOLD]: () => editor.chain().focus().toggleBold().run(),
    [TOOLBAR_KEY.CAMERA]: onCameraClick,
    [TOOLBAR_KEY.ALARM]: () => {
      // TODO: 예약 기능
    },
    [TOOLBAR_KEY.CALENDAR]: () => {
      // TODO: 일정 기능
    },
  };

  const handleItemClick = (key: ToolbarKey) => {
    actionMap[key]?.();
  };

  // bold만 active 상태 추가
  const items: ToolBarItem<ToolbarKey>[] = baseItems.map((item) =>
    item.key === TOOLBAR_KEY.BOLD ? { ...item, active: editor.isActive('bold') } : item,
  );

  return <ToolBar items={items} onItemClick={handleItemClick} />;
};
