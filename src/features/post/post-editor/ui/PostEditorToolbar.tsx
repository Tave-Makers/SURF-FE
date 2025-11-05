'use client';

import { useEditorState, type Editor } from '@tiptap/react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import React from 'react';

type Props = {
  editor: Editor;
};

export const PostEditorToolbar = ({ editor }: Props) => {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
    }),
  });

  const active = '';
  const inactive = '';

  const buttonStyle = 'flex items-center gap-5';
  const textStyle = 'text-foreground-foreground-normal text-body-body9';

  return (
    <div className="flex gap-11 gap-15 px-13 py-8">
      <button className={buttonStyle}>
        <SurfIcon name="Camera" size="m" className="" />
        <span className={textStyle}>사진</span>
      </button>

      <button className={buttonStyle}>
        <SurfIcon name="Alarm" size="m" />
        <span className={textStyle}>예약</span>
      </button>

      <button className={buttonStyle}>
        <SurfIcon name="Calendar" size="m" />
        <span className={textStyle}>일정</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={[buttonStyle, state.isBold ? active : inactive].join(' ')}
      >
        <span className="flex h-[1.25rem] w-[1.25rem] items-center justify-center">B</span>
        <span className={textStyle}>굵게</span>
      </button>
    </div>
  );
};
