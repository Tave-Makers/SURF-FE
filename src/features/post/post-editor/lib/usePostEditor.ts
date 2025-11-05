'use client';

import { useEditor } from '@tiptap/react';
import { POST_EDITOR_EXTENSIONS } from '../config/tiptap';

export const usePostEditor = (initialContent?: string) => {
  return useEditor({
    extensions: POST_EDITOR_EXTENSIONS,
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: '',
      },
    },
  });
};
