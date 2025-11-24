'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { type Editor } from '@tiptap/react';
import { useRouter } from 'next/navigation';

const baseItems: ToolBarItem[] = [
  { key: 'camera', label: '사진', icon: 'CameraSolid' },
  { key: 'alarm', label: '예약', icon: 'AlarmSolid' },
  { key: 'calendar', label: '일정', icon: 'CalendarSolid' },
  { key: 'bold', label: '굵게', icon: 'LetterBSolid' },
];

type Props = {
  editor: Editor; // 볼드체 버튼 클릭시 굵기를 조절하는 포스트 에디터
  onCameraClick: () => void; // 파일 탐색기 여는 콜백
  onScheduleClick: () => void; // 예약 버튼 클릭 시 예약 DateTimePicker 모달 오픈 콜백
};

export const PostEditorToolbar = ({ editor, onCameraClick, onScheduleClick }: Props) => {
  const router = useRouter();

  const handleItemClick = (key: string) => {
    switch (key) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'camera':
        onCameraClick();
        break;
      case 'alarm':
        onScheduleClick();
        break;
      case 'calendar':
        router.push('/post/schedule/create');
        break;
    }
  };

  // bold만 active 상태 추가
  const items: ToolBarItem[] = baseItems.map((item) =>
    item.key === 'bold' ? { ...item, active: editor.isActive('bold') } : item,
  );

  return <ToolBar items={items} onItemClick={handleItemClick} />;
};
