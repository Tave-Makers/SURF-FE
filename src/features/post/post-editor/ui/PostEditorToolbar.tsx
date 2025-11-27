'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { type Editor } from '@tiptap/react';

const baseItems: ToolBarItem[] = [
  { key: 'camera', label: '사진', icon: 'CameraSolid' },
  { key: 'alarm', label: '예약', icon: 'AlarmSolid' },
  { key: 'calendar', label: '일정', icon: 'CalendarSolid' },
  { key: 'bold', label: '굵게', icon: 'LetterBSolid' },
];

type Props = {
  editor: Editor;
  onCameraClick: () => void; // 파일 탐색기 여는 콜백
};

export const PostEditorToolbar = ({ editor, onCameraClick }: Props) => {
  const handleItemClick = (key: string) => {
    switch (key) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'camera':
        onCameraClick();
        break;
      case 'alarm':
        console.log('예약 버튼 클릭');
        break;
      case 'calendar':
        console.log('일정 버튼 클릭');
        break;
    }
  };

  // bold만 active 상태 추가
  const items: ToolBarItem[] = baseItems.map((item) =>
    item.key === 'bold' ? { ...item, active: editor.isActive('bold') } : item,
  );

  return <ToolBar items={items} onItemClick={handleItemClick} />;
};
