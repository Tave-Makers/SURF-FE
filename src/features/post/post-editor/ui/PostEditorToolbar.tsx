'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { type Editor } from '@tiptap/react';

const items: ToolBarItem[] = [
  { key: 'camera', label: '사진', icon: 'CameraSolid' },
  { key: 'alarm', label: '예약', icon: 'AlarmSolid' },
  { key: 'calendar', label: '일정', icon: 'CalendarSolid' },
  { key: 'bold', label: '굵게', icon: 'LetterBSolid' },
];

type Props = {
  editor: Editor;
};

export const PostEditorToolbar = ({ editor }: Props) => {
  const handleItemClick = (key: string) => {
    switch (key) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'camera':
        console.log('사진 업로드 클릭');
        break;
      case 'alarm':
        console.log('예약 버튼 클릭');
        break;
      case 'calendar':
        console.log('일정 버튼 클릭');
        break;
    }
  };

  return <ToolBar items={items} onItemClick={handleItemClick} />;
};
