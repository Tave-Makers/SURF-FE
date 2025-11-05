'use client';

import { ToolBar, type ToolBarItem } from '@/shared/ui/toolbar/ToolBar';
import { useEditorState, type Editor } from '@tiptap/react';
import { useState } from 'react';

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
  // 현재 클릭된 버튼 상태
  const [activeKey, setActiveKey] = useState<string>('');

  // Tiptap 상태 구독 — 굵게 여부 감지
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
    }),
  });

  const handleItemClick = (key: string) => {
    setActiveKey(key);

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

  return (
    <ToolBar
      items={items}
      activeKey={
        // Bold 버튼은 editor 상태로, 나머지는 클릭 상태로 구분
        // TODO : 굵게 버튼만 강조 불가능, 일단 스킵
        activeKey === 'bold' ? (state.isBold ? 'bold' : '') : state.isBold ? 'bold' : activeKey
      }
      onItemClick={handleItemClick}
    />
  );
};
