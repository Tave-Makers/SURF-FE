'use client';

import { useEditor } from '@tiptap/react';
import { POST_EDITOR_EXTENSIONS } from '../config/tiptap';

export const usePostEditor = (initialContent?: string, onUpdate?: (html: string) => void) => {
  return useEditor({
    extensions: POST_EDITOR_EXTENSIONS,
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: '',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': '게시글 편집기',
      },
    },
    onUpdate({ editor }) {
      onUpdate?.(editor.getHTML());
    },
    immediatelyRender: false,
  });
};
