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
    <div className="flex flex-col gap-10">
      {/* 에디터 본문 */}
      <div className="px-13">
        <EditorContent editor={editor} />
      </div>

      {/* 이미지 업로드 */}
      <ImageList files={files} />

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
