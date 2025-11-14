'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageManager } from '@/shared/hooks/useImageManager';

export type PostEditorProps = {
  initialContent?: string;
};

export const PostEditor = ({ initialContent }: PostEditorProps) => {
  const editor = usePostEditor(initialContent);
  const { inputRef, images, handleSelectAndUpload, handleRemove, handleReorder, openPicker } =
    useImageManager();

  if (!editor) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 에디터 본문 */}
      <div className="text-foreground-foreground-black text-body-body8 flex flex-1 cursor-text overflow-y-auto px-13 break-all">
        <EditorContent
          editor={editor}
          onClick={() => {
            if (!editor.isFocused) editor.commands.focus('end');
          }}
        />
      </div>

      {/* 이미지 리스트 */}
      {images.length > 0 && (
        <div className="overflow-x-auto">
          <ImageList
            key="image-list"
            images={images}
            onRemove={handleRemove}
            onReorder={handleReorder}
          />
        </div>
      )}

      {/* 숨겨진 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleSelectAndUpload(e);
        }}
      />

      {/* 툴바 */}
      <PostEditorToolbar editor={editor} onCameraClick={openPicker} />
    </div>
  );
};
