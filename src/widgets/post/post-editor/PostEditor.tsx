'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { EditorContent } from '@tiptap/react';

export const PostEditor = ({ initialContent }: { initialContent?: string }) => {
  const editor = usePostEditor(initialContent);
  if (!editor) return null;

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div className="scrollbar-hide text-foreground-foreground-black text-body-body8 flex flex-1 overflow-y-auto px-13">
        <EditorContent editor={editor} />
      </div>
      <PostEditorToolbar editor={editor} />
    </div>
  );
};
