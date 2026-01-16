'use client';

import { Alert } from '@surf/ui/alert';
import { EditorContent } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { ActivityCategory } from '@/entities/calendar/model/types';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { UploadImage } from '@/entities/image/model/types';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { useImageManager } from '@/features/image/model/useImageManager';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';

import { PostPageMode } from '@/features/post/post-form/model/types';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';

export type PostEditorProps = {
  mode: PostPageMode;
  initialContent: string; // Store에서 내려오는 전역 본문 데이터
  initialImages: UploadImage[]; // Store에서 내려오는 전역 이미지 데이터
  linkedSchedule: ScheduleFormData | null;
  onChange: (data: { content: string; images: UploadImage[] }) => void;
  onScheduleRemove: () => void;
  onReservationClick: () => void;
  isPublished: boolean;
};

export const PostEditor = ({
  mode,
  initialContent: storeContent,
  initialImages: storeImages,
  linkedSchedule,
  onChange,
  onScheduleRemove,
  onReservationClick,
  isPublished,
}: PostEditorProps) => {
  /**
   * [플래그 역할 정의]
   * 1. canInitialize (전역): 페이지 진입 시 데이터 준비가 완료되었음을 알리는 신호 (부모 제어)
   * 2. isInitialized (전역): 게시글 데이터가 에디터에 "생애 최초 1회" 주입되었음을 의미 (재주입 방지)
   * 3. isLocalInitialized (지역): 현재 마운트된 에디터 인스턴스에 데이터가 주입되었는지 여부 (복귀 시 대응)
   */
  const {
    isEditorInitialized: isInitialized,
    setIsEditorInitialized: setIsInitialized,
    canInitialize,
  } = usePostFormStore();

  const isLocalInitialized = useRef(false);
  const contentRef = useRef<string>(storeContent);

  const {
    inputRef,
    images,
    setImages,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
    openPicker,
  } = useImageManager();

  const keyboardOffset = useKeyboardOffset();
  const { MAX_IMAGES } = POST_VALIDATION;
  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);

  // --- 1. Editor Callbacks ---

  const onUpdate = useCallback(
    (html: string) => {
      contentRef.current = html;
      // 초기화가 완료된 후, 유효한 페이지 세션 내에서만 부모 스토어 업데이트 전파
      if (isInitialized && canInitialize) {
        onChange({ content: html, images });
      }
    },
    [onChange, images, isInitialized, canInitialize],
  );

  const editor = usePostEditor(storeContent, onUpdate);

  // --- 2. Data Initialization (로컬 & 전역 동기화) ---

  /**
   * [CASE A: 일정 페이지 복귀 대응]
   * 전역 초기화는 이미 끝났지만(true), 컴포넌트가 재마운트되어 로컬 상태가 비어있을 때 실행
   */
  useEffect(() => {
    if (!canInitialize || !editor) return;

    if (isInitialized && !isLocalInitialized.current) {
      if (storeContent) editor.commands.setContent(storeContent);
      setImages(storeImages || []);

      isLocalInitialized.current = true;
      return;
    }
  }, [canInitialize, isInitialized, editor, storeContent, storeImages, setImages]);

  /**
   * [CASE B: 게시글 최초 진입 및 데이터 주입]
   * 수정 모드의 상세 데이터를 기다리거나, 생성 모드 진입 시 최초 1회 실행
   */
  useEffect(() => {
    if (!editor || isInitialized || !canInitialize) return;

    if (mode === 'create') {
      setImages(storeImages || []);
      setIsInitialized(true);
      isLocalInitialized.current = true;
      return;
    }

    if (mode === 'edit') {
      // 수정 모드는 서버 데이터(storeContent)가 로드될 때까지 대기
      if (!storeContent) return;

      const currentHtml = editor.getHTML();
      if (currentHtml !== storeContent) {
        editor.commands.setContent(storeContent);
        contentRef.current = storeContent;
      }

      setImages(storeImages || []);
      setIsInitialized(true);
      isLocalInitialized.current = true;
    }
  }, [
    editor,
    isInitialized,
    canInitialize,
    storeContent,
    storeImages,
    mode,
    setImages,
    setIsInitialized,
  ]);

  // --- 3. Side Effects ---

  /**
   * [이미지 변경 감지 및 부모 전파]
   * 로컬 주입(isMountedRef)이 끝난 상태에서만 변경 사항을 전역 스토어로 전달 (역류 방지)
   */
  useEffect(() => {
    if (!isInitialized || !canInitialize || !isLocalInitialized.current) return;

    onChange({ content: contentRef.current, images });
  }, [images, onChange, isInitialized, canInitialize]);

  // --- 4. Handlers & Render Helpers ---

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

  if (!editor) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* 본문 에디터 영역 */}
      <div className="text-foreground-normal text-body-body7 relative flex flex-1 overflow-y-auto px-13 break-all">
        {/* PostEditor.style.css에서 placeholder 및 focusing 스타일 정의 */}
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
          onReservationClick={onReservationClick}
          isReservationDisabled={isPublished}
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
