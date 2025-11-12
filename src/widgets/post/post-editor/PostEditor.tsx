'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { useImageUpload } from '@/shared/hooks/useImageUpload';
import { ImageList } from '@/features/post/post-image/ui/ImageList';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { EditorContent } from '@tiptap/react';

export const PostEditor = () => {
  const editor = usePostEditor();
  const { inputRef, files, openPicker, handleSelect } = useImageUpload();

  if (!editor) return null;

  return (
    <div className="flex min-w-0 flex-col gap-10">
      {/* 에디터 본문 */}
      <div
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        aria-label="게시글 편집기"
        aria-placeholder="글, 제목, 내용을 입력해주세요."
        className="scrollbar-hide text-foreground-foreground-black text-body-body8 flex flex-1 cursor-text overflow-y-auto px-13 break-all"
        onClick={() => {
          if (!editor.isFocused) editor.commands.focus('end');
        }}
        onKeyDown={(e) => {
          if (!editor.isFocused && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            editor.commands.focus('end');
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* 이미지 업로드 */}
      <div className="overflow-x-auto">
        <ImageList files={files} />
      </div>

      {/* 파일 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {/* 툴바 */}
      <PostEditorToolbar editor={editor} onCameraClick={openPicker} />
    </div>
  );
};
