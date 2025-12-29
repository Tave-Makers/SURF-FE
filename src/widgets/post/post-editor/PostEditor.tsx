'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent } from '@tiptap/react';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { Alert } from '@/shared/ui/alert/Alert';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';

import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageManager } from '@/features/image/model/useImageManager';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';

import { UploadImage } from '@/entities/image/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { PostPageMode } from '@/features/post/post-form/model/types';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { ActivityCategory } from '@/entities/calendar/model/types';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';

export type PostEditorProps = {
  mode: PostPageMode;
  initialContent: string;
  initialImages: UploadImage[];
  linkedSchedule: ScheduleFormData | null;
  onChange: (data: { content: string; images: UploadImage[] }) => void;
  onScheduleRemove: () => void;
  onReservationClick: () => void;
};

export const PostEditor = ({
  mode,
  initialContent,
  initialImages,
  linkedSchedule,
  onChange,
  onScheduleRemove,
  onReservationClick,
}: PostEditorProps) => {
  // 1. Hooks & Refs
  const {
    inputRef,
    images,
    setImages,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
    openPicker,
  } = useImageManager();

  const contentRef = useRef<string>(initialContent);
  const { isEditorInitialized: isInitialized, setIsEditorInitialized: setIsInitialized } =
    usePostFormStore();
  const [isDataSynced, setIsDataSynced] = useState(false);
  const keyboardOffset = useKeyboardOffset();
  const { MAX_IMAGES } = POST_VALIDATION;

  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);

  // 2. Editor Callbacks & Initialization

  // TipTap 내용 업데이트 핸들러
  const onUpdate = useCallback(
    (html: string) => {
      contentRef.current = html;
      // 초기화 완료 후에만 부모 컴포넌트의 상태를 업데이트
      if (isInitialized) {
        onChange({ content: html, images });
      }
    },
    [onChange, images, isInitialized],
  );

  const editor = usePostEditor(initialContent, onUpdate);

  // 외부 데이터(initialValue) 주입 및 초기화 세션 관리
  useEffect(() => {
    if (!editor || isInitialized) return;

    // 생성 모드: 데이터 주입을 기다리지 않고 즉시 활성화
    if (mode === 'create') {
      // 일정 페이지 등 외부에서 돌아온 경우: Zustand에 저장된 이미지를 복구
      if (initialImages && initialImages.length > 0) {
        setImages(initialImages);
      }
      setIsInitialized(true);
      return;
    }

    // 수정 모드: 서버에서 넘어온 데이터를 에디터 및 이미지 매니저에 주입
    const currentHtml = editor.getHTML();
    const hasNoContent = currentHtml === '' || currentHtml === '<p></p>';

    // 1) 본문 데이터 주입
    if (initialContent && hasNoContent) {
      editor.commands.setContent(initialContent);
      contentRef.current = initialContent;

      // 이미지가 없는 게시글인 경우 여기서 초기화 완료 처리
      if (!initialImages || initialImages.length === 0) {
        setIsInitialized(true);
      }
    }

    // 2) 이미지 데이터 주입 (최초 1회)
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
      setIsInitialized(true);
    }
  }, [editor, isInitialized, setIsInitialized, initialContent, initialImages, setImages, mode]);

  // 복귀 시 초기 이미지가 들어오면 로컬 상태에 동기화
  useEffect(() => {
    if (isDataSynced || !isInitialized || !initialImages) return;

    // 현재 로컬 images가 비어있고, initialImages가 있으면 동기화
    if (images.length === 0 && initialImages.length > 0) {
      setImages(initialImages);
      setIsDataSynced(true);
    }
  }, [isInitialized, initialImages, images.length, isDataSynced, setImages]);

  // 3. Side Effects

  // 이미지 리스트 변경 감지 (삭제/순서변경 등) 시 부모에게 알림
  useEffect(() => {
    if (!isInitialized) return;
    onChange({ content: contentRef.current, images });
  }, [images, onChange, isInitialized]);

  // 4. Handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      setShowImageLimitAlert(true);
      e.target.value = '';
      return;
    }

    await handleSelectAndUpload(e);
  };

  if (!editor) return null;

  // 5. Render Helpers
  const renderScheduleCard = () => {
    if (!linkedSchedule) return null;

    const categoryMap: Record<ScheduleCategory, ActivityCategory> = {
      regular: 'official',
      operation: 'operation',
      other: 'other',
    };

    return (
      <div className="p-13">
        <EventCard
          category={categoryMap[linkedSchedule.category]}
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

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 본문 에디터 영역 */}
      <div className="text-foreground-normal text-body-body7 relative flex flex-1 overflow-y-auto px-13 break-all">
        {/* 빈 공간 클릭 시 에디터 포커싱 */}
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
          onScheduleClick={onReservationClick}
        />
      </div>

      {/* 알림 모달 */}
      <Alert
        state="error"
        title="이미지 최대 장수 오류"
        infoText={`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있어요`}
        actions={[
          {
            type: 'text',
            label: '확인',
            variant: 'primary',
            onClick: () => setShowImageLimitAlert(false),
          },
        ]}
        isOpen={showImageLimitAlert}
        onClose={() => setShowImageLimitAlert(false)}
      />
    </div>
  );
};
