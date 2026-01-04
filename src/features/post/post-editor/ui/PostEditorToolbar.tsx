'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { type Editor } from '@tiptap/react';
import { useRouter } from 'next/navigation';

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
  onReservationClick: () => void; // 예약 버튼 클릭 시 예약 DateTimePicker 모달 오픈 콜백
  isReservationDisabled: boolean; // 예약 비활성화 여부
};

export const PostEditorToolbar = ({
  editor,
  onCameraClick,
  onReservationClick,
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
      router.push('/post/schedule');
    },
  };

  const handleItemClick = (key: ToolbarKey) => {
    if (key === TOOLBAR_KEY.ALARM && isReservationDisabled) return;
    actionMap[key]?.();
  };

  const items: ToolBarItem<ToolbarKey>[] = baseItems.map((item) => {
    const isBold = item.key === TOOLBAR_KEY.BOLD;
    const isAlarm = item.key === TOOLBAR_KEY.ALARM;

    return {
      ...item,
      active: isBold ? editor.isActive('bold') : false,
      disabled: isAlarm && isReservationDisabled,
    };
  });

  return <ToolBar items={items} onItemClick={handleItemClick} />;
};
