'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageManager } from '@/shared/hooks/useImageManager';
import { UploadImage } from '@/shared/types/image';
import { useEffect } from 'react';

export type PostEditorProps = {
  initialContent?: string;
  onChange?: (data: { content: string; images: UploadImage[] }) => void;
};

export const PostEditor = ({ initialContent, onChange }: PostEditorProps) => {
  const editor = usePostEditor(initialContent);
  const { inputRef, images, handleSelectAndUpload, handleRemove, handleReorder, openPicker } =
    useImageManager();

  // 본문 or 이미지가 바뀔 때마다 부모에게 전달
  useEffect(() => {
    if (!editor) return;
    onChange?.({
      content: editor.getHTML(), // TipTap content
      images,
    });
  }, [editor, images, onChange]);

  if (!editor) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 에디터 본문 */}
      <div className="text-foreground-foreground-black text-body-body8 relative flex flex-1 overflow-y-auto px-13 break-all">
        {/* 클릭 확장 오버레이 */}
        <button
          type="button"
          aria-label="본문 클릭 영역"
          className="absolute inset-0 z-0 cursor-text"
          onClick={() => {
            if (!editor.isFocused) editor.commands.focus('end');
          }}
        />
        <EditorContent editor={editor} />
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
