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
      <div
        role="textbox"
        tabIndex={0}
        aria-label="게시글 편집기"
        className="scrollbar-hide text-foreground-foreground-black text-body-body8 flex flex-1 cursor-text overflow-y-auto px-13"
        onClick={() => {
          if (!editor.isFocused) editor.commands.focus('end');
        }}
        onKeyDown={(e) => {
          if (!editor.isFocused && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            if (!editor.isFocused) editor.commands.focus('end');
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <PostEditorToolbar editor={editor} />
    </div>
  );
};
