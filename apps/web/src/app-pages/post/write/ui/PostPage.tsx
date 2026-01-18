'use client';

import { AccordionSelect } from '@surf/ui/accordion';
import { HeaderMode } from '@surf/ui/header';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { POST_BOARDS } from '@/entities/post/model/board';
import { POST_CATEGORIES } from '@/entities/post/model/category';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { PostBadge } from '@/entities/post/ui/post-badge/PostBadge';
import { usePostForm } from '@/features/post/post-form/model/usePostForm';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';

type PostPageProps =
  | { mode: 'create'; boardId: string }
  | { mode: 'edit'; boardId: string; postId: string };

const PostPage = (props: PostPageProps) => {
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const { mode, boardId } = props;
  const postId = mode === 'edit' ? props.postId : undefined;

  // 초기화 허용 플래그 설정
  const { setCanInitialize } = usePostFormStore();

  // 로직 훅 호출 (Logic과 View의 연결 고리)
  const {
    title,
    setTitle,
    category,
    categorySheetId,
    isCategoryOpen,
    openCategory,
    closeCategory,
    selectCategory,
    initialContent,
    initialImages,
    linkedSchedule,
    handleScheduleRemove,
    showExitAlert,
    setShowExitAlert,
    reserved,
    setReserved,
    reservedAt,
    setReservedAt,
    isSubmitDisabled,
    handleEditorChange,
    handleBack,
    handleSubmit,
    resetPostState,
    isPublished,
    isReserved,
  } = usePostForm({ mode, boardId, postId });

  // 마운트시 초기화 허용
  useEffect(() => {
    setCanInitialize(true);
  }, [setCanInitialize]);

  const closeExitAlert = useCallback(() => {
    setShowExitAlert(false);
    closeAlert();
  }, [closeAlert, setShowExitAlert]);

  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  const handleSaveReservation = (date: Date) => {
    setReservedAt(date);
    setReserved(true);
  };

  // 실제 예약 취소
  const handleConfirmRemove = () => {
    setReserved(false);
    setReservedAt(null);
    closeAlert();
    closeBottomSheet();
  };

  const handleRemoveReservation = () => {
    openAlert({
      state: 'default',
      title: '설정한 예약이 취소됩니다',
      infoText: '예약 취소하기를 누를 경우 게시글 내 설정된 예약이 삭제됩니다.',
      actions: [
        { type: 'solid', label: '취소', variant: 'secondary', onClick: closeAlert },
        { type: 'solid', label: '삭제하기', variant: 'danger', onClick: handleConfirmRemove },
      ],
    });
  };

  const handleOpenReservation = () => {
    openBottomSheet({
      type: 'reservation',
      props: {
        reserved,
        defaultDate: reservedAt,
        onSave: handleSaveReservation,
        onRemove: handleRemoveReservation,
      },
    });
  };

  const board = POST_BOARDS.find((b) => b.id === Number(boardId));
  const boardLabel = board ? board.label : '';

  const { MAX_TITLE_LENGTH } = POST_VALIDATION;

  useEffect(() => {
    if (!showExitAlert) return;
    openAlert({
      state: 'default',
      title: '변경 내용을 저장하지 않고 나가시겠습니까?',
      infoText: '작성 중인 내용은 저장되지 않습니다.',
      actions: [
        { type: 'solid', label: '취소', variant: 'secondary', onClick: closeExitAlert },
        {
          type: 'solid',
          label: '나가기',
          variant: 'danger',
          onClick: () => {
            closeExitAlert();
            resetPostState();
            setCanInitialize(false);
            router.back();
          },
        },
      ],
    });
    setShowExitAlert(false);
  }, [
    closeExitAlert,
    openAlert,
    resetPostState,
    router,
    setShowExitAlert,
    showExitAlert,
    setCanInitialize,
  ]);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {/* 1. 상단 헤더 */}
      <AppHeader
        customBack={handleBack}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: boardLabel,
          hasLeftIcon: true,
          text: mode === 'create' ? '등록' : '수정',
          btnVariant: 'secondary',
          isDisabled: isSubmitDisabled,
          onClickTextBtn: () => void handleSubmit(),
        }}
      />

      {/* 2. 카테고리 선택 */}
      <div className="px-13">
        <AccordionSelect
          title={POST_CATEGORIES[category].label}
          isOpen={isCategoryOpen}
          onClick={openCategory}
          controlsId={categorySheetId}
        />
      </div>

      {/* 예약중 태그 */}
      {isReserved && (
        <div className="px-13 pt-10">
          <PostBadge type="reservation" />
        </div>
      )}

      {/* 3. 카테고리 시트 */}
      <ModalSheet
        isOpen={isCategoryOpen}
        onClose={closeCategory}
        aria-labelledby={categorySheetId}
        className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
      >
        <ModalSheet.Container>
          <ModalSheet.Header className="bg-background-normal-lighter rounded-t-4" />
          <ModalSheet.Content>
            <div
              id={categorySheetId}
              className="bg-background-normal-lighter flex flex-col gap-5 p-15"
            >
              {Object.values(POST_CATEGORIES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(item.key)}
                  className={`rounded-md px-5 py-10 text-left transition-colors ${
                    category === item.key
                      ? 'bg-background-secondary font-semibold'
                      : 'hover:bg-background-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onTap={closeCategory} />
      </ModalSheet>

      {/* 4. 제목 입력 */}
      <div className="flex w-full px-13">
        <label htmlFor="post-title" className="sr-only">
          게시글 제목
        </label>
        <input
          id="post-title"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
          className="text-foreground-normal placeholder:text-foreground-tertiary-lighter text-body-body3 flex flex-1 pt-10 pb-5 focus:outline-none"
        />
      </div>

      {/* 5. 본문 에디터 */}
      <div className="flex h-full flex-1 overflow-auto">
        <PostEditor
          mode={mode}
          initialContent={initialContent}
          initialImages={initialImages}
          linkedSchedule={linkedSchedule}
          onChange={handleEditorChange}
          onScheduleRemove={handleScheduleRemove}
          onReservationClick={handleOpenReservation}
          isPublished={isPublished}
        />
      </div>
    </div>
  );
};

export default PostPage;
