'use client';

import './PostEditor.style.css';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '../lib/usePostEditor';
import { PostEditorToolbar } from './PostEditorToolbar';

export const PostEditor = ({ initialContent }: { initialContent?: string }) => {
  const editor = usePostEditor(initialContent);

  if (!editor) return null;

  return (
    <div>
      <div className={['px-13 py-8'].join(' ')}>
        <EditorContent editor={editor} />
      </div>
      <PostEditorToolbar editor={editor} />
    </div>
  );
};
