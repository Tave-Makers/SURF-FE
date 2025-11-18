'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageManager } from '@/shared/hooks/useImageManager';
import { UploadImage } from '@/shared/types/image';
import { useEffect } from 'react';
import { ImageItemResponse } from '@/entities/post/api/types';

export type PostEditorProps = {
  initialContent?: string;
  initialImages?: ImageItemResponse[];
  onChange?: (data: { content: string; images: UploadImage[] }) => void;
};

export const PostEditor = ({ initialContent, initialImages, onChange }: PostEditorProps) => {
  const editor = usePostEditor(initialContent, (html) => {
    onChange?.({ content: html, images });
  });
  const {
    inputRef,
    images,
    setImages,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
    openPicker,
  } = useImageManager();

  const mapInitialImages = (images: ImageItemResponse[]): UploadImage[] => {
    return images.map((img) => ({
      id: crypto.randomUUID(),
      file: null,
      preview: img.originalUrl,
      uploadedUrl: img.originalUrl,
      status: 'uploaded', // 이미 서버에 업로드된 이미지
    }));
  };

  /** 수정 모드시 초기 본문 데이터 반영 */
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  /** 수정 모드시 초기 이미지 데이터 반영 */
  useEffect(() => {
    if (!initialImages) return;
    setImages(mapInitialImages(initialImages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImages]);

  /** 이미지 변경 시에만 부모에게 전달 (본문 변경은 TipTap onUpdate에서 처리됨) */
  useEffect(() => {
    if (!editor) return;
    onChange?.({
      content: editor.getHTML(), // TipTap content
      images,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

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
