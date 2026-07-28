'use client';

import { type Editor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar';

export const TOOLBAR_KEY = {
  CAMERA: 'camera',
  ALARM: 'alarm',
  CALENDAR: 'calendar',
  BOLD: 'bold',
  FILE: 'file',
} as const;

export type ToolbarKey = (typeof TOOLBAR_KEY)[keyof typeof TOOLBAR_KEY];

export const ALL_TOOLBAR_ITEMS: ToolBarItem<ToolbarKey>[] = [
  { key: TOOLBAR_KEY.CAMERA, label: '사진', icon: 'CameraSolid' },
  { key: TOOLBAR_KEY.ALARM, label: '예약', icon: 'AlarmSolid' },
  { key: TOOLBAR_KEY.CALENDAR, label: '일정', icon: 'CalendarSolid' },
  { key: TOOLBAR_KEY.BOLD, label: '굵게', icon: 'LetterBSolid' },
  { key: TOOLBAR_KEY.FILE, label: '파일', icon: 'FilePlusSolid' },
];

type Props = {
  editor: Editor;
  items: ToolBarItem<ToolbarKey>[];
  onCameraClick: () => void;
  onReservationClick: () => void;
  onFileClick: () => void;
  isReservationDisabled: boolean;
};

export const PostEditorToolbar = ({
  editor,
  items,
  onCameraClick,
  onReservationClick,
  onFileClick,
  isReservationDisabled,
}: Props) => {
  const router = useRouter();

  const actionMap: Record<ToolbarKey, () => void> = {
    [TOOLBAR_KEY.BOLD]: () => editor.chain().focus().toggleBold().run(),
    [TOOLBAR_KEY.CAMERA]: onCameraClick,
    [TOOLBAR_KEY.ALARM]: () => {
      onReservationClick();
    },
    [TOOLBAR_KEY.CALENDAR]: () => {
      router.push(PAGE_ROUTES.BOARD.POST_SCHEDULE);
    },
    [TOOLBAR_KEY.FILE]: onFileClick,
  };

  const handleItemClick = (key: ToolbarKey) => {
    if (key === TOOLBAR_KEY.ALARM && isReservationDisabled) return;
    actionMap[key]?.();
  };

  const resolvedItems: ToolBarItem<ToolbarKey>[] = items.map((item) => ({
    ...item,
    active: item.key === TOOLBAR_KEY.BOLD ? editor.isActive('bold') : false,
    disabled: item.key === TOOLBAR_KEY.ALARM && isReservationDisabled,
  }));

  return <ToolBar items={resolvedItems} onItemClick={handleItemClick} />;
};
