'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { UploadImage } from '@surf/utils';
import { EditorContent } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import '@/features/post/post-editor/ui/PostEditor.style.css';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { useImageManager } from '@/features/image/model/useImageManager';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';

import { PostPageMode } from '@/features/post/post-form/model/types';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

export type PostEditorProps = {
  mode: PostPageMode;
  content: string; // Store에서 내려오는 전역 본문 데이터
  images: UploadImage[]; // Store에서 내려오는 전역 이미지 데이터
  linkedSchedule: ScheduleFormData | null;
  onScheduleRemove: () => void;
  onReservationClick: () => void;
  isPublished: boolean;
};

export const PostEditor = ({
  linkedSchedule,
  onScheduleRemove,
  onReservationClick,
  isPublished,
}: PostEditorProps) => {
  /**
   * isInitialized (전역): 서버 데이터가 스토어에 최초 저장 되었는지 나타내는 플래그
   */
  const { isInitialized, setField, initialSnapshot } = usePostFormStore();

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const { inputRef, images, handleSelectAndUpload, handleRemove, handleReorder, openPicker } =
    useImageManager();

  const keyboardOffset = useKeyboardOffset();
  const { MAX_IMAGES } = POST_VALIDATION;

  // --- 3. Side Effects ---

  const onContentChange = useCallback(
    (html: string) => {
      setField('content', html);
    },
    [setField],
  );

  const editor = usePostEditor(initialSnapshot?.content, onContentChange);

  /**
   * [이미지 변경 감지 및 부모 전파]
   * 변경 사항을 전역 스토어로 전달
   */
  useEffect(() => {
    if (!isInitialized) return;

    setField('images', images);
  }, [images, setField, isInitialized]);

  // --- 4. Handlers & Render Helpers ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      openAlert({
        state: 'error',
        title: '이미지 최대 장수 오류',
        infoText: `이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있어요`,
        actions: [
          {
            type: 'text',
            label: '확인',
            variant: 'primary',
            onClick: () => closeAlert(),
          },
        ],
      });
      e.target.value = '';
      return;
    }
    await handleSelectAndUpload(e);
  };

  const renderScheduleCard = () => {
    if (!linkedSchedule) return null;

    return (
      <div className="p-13">
        <EventCard
          category={linkedSchedule.category}
          title={linkedSchedule.title}
          startDate={linkedSchedule.startDate}
          endDate={linkedSchedule.endDate}
          location={linkedSchedule.location}
          mode="reservation"
          isAdmin={true}
          onDeleteSchedule={onScheduleRemove}
        />
      </div>
    );
  };

  if (!editor) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 본문 에디터 영역 */}
      <div className="text-foreground-normal text-body-body7 relative flex flex-1 overflow-y-auto px-13 break-all">
        {/* PostEditor.style.css에서 placeholder 및 focusing 스타일 정의 */}
        <button
          type="button"
          aria-label="본문"
          className="absolute inset-0 z-0 cursor-text"
          onClick={() => {
            if (!editor.isFocused) editor.commands.focus('end');
          }}
        />
        <EditorContent editor={editor} />
      </div>

      {/* 이미지 리스트 영역 */}
      {images.length > 0 && (
        <div className="overflow-x-auto">
          <ImageList images={images} onRemove={handleRemove} onReorder={handleReorder} />
        </div>
      )}

      {/* 숨겨진 파일 업로드 Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleImageUpload(e);
        }}
      />

      {/* 연동된 일정 카드 */}
      {renderScheduleCard()}

      {/* 하단 툴바 (키보드 대응 포함) */}
      <div style={{ paddingBottom: keyboardOffset }}>
        <PostEditorToolbar
          editor={editor}
          onCameraClick={openPicker}
          onReservationClick={onReservationClick}
          isReservationDisabled={isPublished}
        />
      </div>
    </div>
  );
};
