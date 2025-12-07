'use client';

import '@/features/post/post-editor/ui/PostEditor.style.css';
import { PostEditorToolbar } from '@/features/post/post-editor/ui/PostEditorToolbar';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { EditorContent } from '@tiptap/react';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import { useImageManager } from '@/features/image/model/useImageManager';
import { UploadImage } from '@/entities/image/model/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageItemResponse } from '@/entities/post/api/types';
import { Alert } from '@/shared/ui/alert/Alert';
import { safeUUID } from '@/shared/utils/uuid';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Sheet } from '@/shared/ui/sheet/Sheet';

export type PostEditorProps = {
  initialContent: string;
  initialImages: ImageItemResponse[];
  onChange: (data: { content: string; images: UploadImage[] }) => void;
  onInitialized: () => void;
  reserved: boolean;
  setReserved: (value: boolean) => void;
  reservedAt: Date | null;
  setReservedAt: (value: Date | null) => void;
};

export const PostEditor = ({
  initialContent,
  initialImages,
  onChange,
  onInitialized,
  setReserved,
  reservedAt,
  setReservedAt,
}: PostEditorProps) => {
  const { linkedSchedule, clearLinkedSchedule } = useCreatePostScheduleStore();

  const {
    inputRef,
    images,
    setImages,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
    openPicker,
  } = useImageManager();

  /** 최신 이미지/내용을 위한 ref */
  const imagesRef = useRef<UploadImage[]>([]);
  const contentRef = useRef<string>('');

  /** images 변화 → ref 반영 */
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  /**
   * TipTap onUpdate 콜백 안정화
   * (이미지는 ref에서 읽고, 여기서는 HTML만 업데이트)
   */
  const onUpdate = useCallback(
    (html: string) => {
      contentRef.current = html;
      onChange({
        content: html,
        images: imagesRef.current,
      });
    },
    [onChange],
  );

  const editor = usePostEditor(initialContent, onUpdate);

  /** 초기화 완료 체크 플래그 */
  const contentAppliedRef = useRef(false);
  const imagesAppliedRef = useRef(false);
  const initializedRef = useRef(false);

  /** 초기 content 적용 */
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(initialContent);
    contentAppliedRef.current = true;

    // content + images 둘 다 끝났다면 초기화 완료
    if (contentAppliedRef.current && imagesAppliedRef.current && !initializedRef.current) {
      initializedRef.current = true;
      onInitialized();
    }
  }, [editor, initialContent, onInitialized]);

  const mapInitialImages = useCallback((data: ImageItemResponse[]): UploadImage[] => {
    return data.map((img) => ({
      id: safeUUID(),
      file: null,
      preview: img.originalUrl,
      uploadedUrl: img.originalUrl,
      status: 'uploaded',
    }));
  }, []);

  /** 초기 images 적용 */
  useEffect(() => {
    if (!initialImages) return;
    setImages(mapInitialImages(initialImages));
    imagesAppliedRef.current = true;

    // content + images 둘 다 끝났다면 초기화 완료
    if (contentAppliedRef.current && imagesAppliedRef.current && !initializedRef.current) {
      initializedRef.current = true;
      onInitialized();
    }
  }, [initialImages, mapInitialImages, setImages, onInitialized]);

  /** 이미지 변경 시 부모에게 알림 (contentRef 사용) */
  useEffect(() => {
    if (!editor || !initializedRef.current) return;

    onChange({
      content: contentRef.current,
      images,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, editor]);

  /** 이미지 최대 장수 제한 */
  const { MAX_IMAGES } = POST_VALIDATION;
  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 지금 업로드한 파일 개수
    const newCount = files.length;
    // 이미 있는 이미지 개수
    const existingCount = imagesRef.current.length;

    if (existingCount + newCount > MAX_IMAGES) {
      setShowImageLimitAlert(true);
      e.target.value = '';
      return;
    }

    // 허용되면 기존 로직 실행
    await handleSelectAndUpload(e);
  };

  /** 키보드 높이 계산 */
  const keyboardOffset = useKeyboardOffset();

  /** 예약 시간 선택 모달 */
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [tempReservationDate, setTempReservationDate] = useState<Date>(new Date());

  const handleOpenReservation = useCallback(() => {
    setTempReservationDate(reservedAt || new Date());
    setIsReservationOpen(true);
  }, [reservedAt]);

  const handleSaveReservation = useCallback(() => {
    setReservedAt(tempReservationDate);
    setReserved(true);
    setIsReservationOpen(false);
  }, [tempReservationDate, setReservedAt, setReserved]);

  const handleCloseReservation = useCallback(() => {
    setIsReservationOpen(false);
  }, []);

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
          void handleImageUpload(e);
        }}
      />

      {/* 연동된 일정 카드 */}
      {linkedSchedule && (
        <div className="p-13">
          <EventCard
            category={
              linkedSchedule.category === 'operation'
                ? 'operation'
                : linkedSchedule.category === 'other'
                  ? 'other'
                  : 'official'
            }
            title={linkedSchedule.title}
            startDate={linkedSchedule.startDate}
            endDate={linkedSchedule.endDate}
            location={linkedSchedule.location}
            mode="reservation"
            isAdmin={true}
            onDeleteSchedule={clearLinkedSchedule}
          />
        </div>
      )}

      {/* 툴바 */}
      <div style={{ paddingBottom: keyboardOffset }}>
        <PostEditorToolbar
          editor={editor}
          onCameraClick={openPicker}
          onScheduleClick={handleOpenReservation}
        />
      </div>

      {/* 예약 시간 선택 모달 */}
      <ModalSheet
        isOpen={isReservationOpen}
        onClose={handleCloseReservation}
        className="mx-auto flex w-full sm:w-[360px]"
      >
        <ModalSheet.Container>
          <ModalSheet.Header />
          <ModalSheet.Content>
            <Sheet
              title="게시글 예약 설정"
              description="해당 시간에 맞춰 게시글이 예약됩니다"
              primaryBtn={{
                label: '예약하기',
                onClick: handleSaveReservation,
              }}
              secondaryBtn={{
                label: '취소하기',
                onClick: handleCloseReservation,
              }}
            >
              <div>
                <DateTimePicker value={tempReservationDate} onChange={setTempReservationDate} />
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop
          onTap={handleCloseReservation}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }}
        />
      </ModalSheet>

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
