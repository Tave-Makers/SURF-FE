'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { useImageSelector } from '@/shared/hooks/useImageSelector';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageUploader } from '@/shared/hooks/useImageUploader';

export type PostEditorProps = {
  initialContent?: string;
};

export const PostEditor = ({ initialContent }: PostEditorProps) => {
  const editor = usePostEditor(initialContent);
  const { inputRef, images, handleSelect, handleRemove, handleReorder, openPicker } =
    useImageSelector();
  const { uploadImages } = useImageUploader();

  if (!editor) return null;

  const handleUploadTest = async () => {
    if (process.env.NODE_ENV === 'development') console.log('업로드 시작...');
    const result = await uploadImages(images);
    if (process.env.NODE_ENV === 'development') console.log('업로드 완료 결과:', result);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 에디터 본문 */}
      <div
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        aria-label="게시글 편집기"
        aria-placeholder="글, 제목, 내용을 입력해주세요."
        className="text-foreground-foreground-black text-body-body8 flex flex-1 cursor-text overflow-y-auto px-13 break-all"
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
        onChange={handleSelect}
      />

      {/* 툴바 */}
      <PostEditorToolbar editor={editor} onCameraClick={openPicker} />
      <button className="bg-blue-500" onClick={() => void handleUploadTest()}>
        이미지 업로드 테스트 버튼
      </button>
    </div>
  );
};
