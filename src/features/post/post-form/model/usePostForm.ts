import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { stripHtml } from '@/shared/lib/stripHtml';
import { usePicker } from '@/shared/hooks/usePicker';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { POST_VALIDATION } from '@/entities/post/model/validation';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { useCreatePost } from '@/features/post/create-post/model/useCreatePost';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { useCreatePostSchedule } from '@/features/schedule/create-post-schedule/model/useCreatePostSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';

import { usePostFormStore } from './usePostFormStore';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { usePostInitialization } from '@/features/post/post-form/model/usePostInitialization';
import { usePostDirtyCheck } from '@/features/post/post-form/model/useDirtyCheck';

import { EditorState, PostPageMode } from './types';

type Props = {
  mode: PostPageMode;
  boardId: string;
  postId?: string;
};

export const usePostForm = ({ mode, boardId, postId }: Props) => {
  const router = useRouter();
  const numericPostId = mode === 'edit' && postId ? Number(postId) : undefined;
  const isScheduleInitializedRef = useRef(false);

  // 1. Store & State Management
  const {
    title,
    category,
    content,
    images,
    reserved,
    reservedAt,
    setField,
    setEditorState,
    resetForm,
  } = usePostFormStore();

  const { linkedSchedule, setLinkedSchedule, clearLinkedSchedule } = useCreatePostScheduleStore();

  const [showExitAlert, setShowExitAlert] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const openReservationModal = () => setIsReservationModalOpen(true);
  const closeReservationModal = () => setIsReservationModalOpen(false);

  // 2. Data Queries & Mutations

  // 상세 데이터 및 일정 조회
  const { data: postDetail } = usePostDetail(numericPostId!, {
    enabled: mode === 'edit' && !!numericPostId,
  });

  const { data: postSchedule } = useGetPostScheduleQuery(
    numericPostId!,
    mode === 'edit' && !!numericPostId && !!postDetail?.hasSchedule,
  );

  // 생성/수정 뮤테이션
  const { mutateAsync: createMutate, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdatePost(numericPostId!);
  const { mutateAsync: createScheduleMutate } = useCreatePostSchedule();
  const { mutateAsync: editScheduleMutate } = useEditSchedule();

  // 3. Logic Hooks (Initialization & Dirty Check)

  // 초기 데이터 진입 및 스냅샷 설정
  usePostInitialization({
    mode,
    postDetail,
    postSchedule,
    linkedSchedule,
    setField,
    setEditorState,
    setLinkedSchedule,
    isInitializedRef: isScheduleInitializedRef,
  });

  // 변경 사항 감지
  const { checkHasChanges } = usePostDirtyCheck();

  // 4. Utility Functions & Callbacks
  const resetPostState = useCallback(() => {
    clearLinkedSchedule();
    resetForm();
    isScheduleInitializedRef.current = false;
  }, [clearLinkedSchedule, resetForm]);

  const {
    isOpen: isCategoryOpen,
    open: openCategory,
    close: closeCategory,
  } = usePicker<PostCategoryKey>({
    defaultValue: 'event',
    onChange: (val) => val && setField('category', val),
  });

  const selectCategory = useCallback(
    (val: PostCategoryKey) => {
      setField('category', val);
      closeCategory();
    },
    [setField, closeCategory],
  );

  const isSubmitDisabled = useMemo(() => {
    const { isEmpty } = checkHasChanges();
    return !title.trim() || isEmpty;
  }, [title, checkHasChanges]);

  // 5. Event Handlers
  const handleEditorChange = useCallback(
    (updatedData: EditorState) => {
      setEditorState(updatedData.content, updatedData.images);
    },
    [setEditorState],
  );

  const handleBack = () => {
    const { hasChanges, isEmpty } = checkHasChanges();
    if (hasChanges && !isEmpty) {
      setShowExitAlert(true);
    } else {
      resetPostState();
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (isCreating || isUpdating) return;

    // Validation
    const { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_IMAGES } = POST_VALIDATION;
    const textContent = stripHtml(content);

    if (title.length > MAX_TITLE_LENGTH)
      return alert(`제목은 최대 ${MAX_TITLE_LENGTH}자까지입니다.`);
    if (textContent.length > MAX_CONTENT_LENGTH)
      return alert(`본문은 최대 ${MAX_CONTENT_LENGTH}자까지입니다.`);
    if (images.length > MAX_IMAGES) return alert(`이미지는 최대 ${MAX_IMAGES}개까지입니다.`);

    const { isContentChanged, isImagesChanged, isReservationChanged } = checkHasChanges();
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({ originalUrl: img.uploadedUrl!, sequence: idx }));

    const categoryId = POST_CATEGORIES[category].id;

    try {
      let targetPostId = numericPostId;

      if (mode === 'create') {
        const res = await createMutate({
          boardId: Number(boardId),
          categoryId,
          title,
          content,
          pinned: false,
          reservedAt: reservedAt ? reservedAt.toISOString() : '',
          imageUrlList,
          hasSchedule: !!linkedSchedule,
          reserved,
        });
        targetPostId = res.postId;

        if (linkedSchedule && targetPostId) {
          await createScheduleMutate({
            postId: targetPostId,
            data: {
              title: linkedSchedule.title,
              startAt: linkedSchedule.startDate.toISOString(),
              endAt: linkedSchedule.endDate.toISOString(),
              location: linkedSchedule.location ?? '미정',
              category: linkedSchedule.category,
            },
          });
        }
      } else {
        await updateMutate({
          title,
          content,
          categoryId,
          pinned: false,
          isReservationChanged,
          reservedAt: reservedAt ? reservedAt.toISOString() : '',
          isContentChanged,
          isImageChanged: isImagesChanged,
          imageUrlList,
          hasSchedule: !!linkedSchedule,
        });

        if (linkedSchedule?.id) {
          await editScheduleMutate({
            scheduleId: linkedSchedule.id,
            data: {
              category: linkedSchedule.category,
              title: linkedSchedule.title,
              startAt: linkedSchedule.startDate.toISOString(),
              endAt: linkedSchedule.endDate.toISOString(),
              location: linkedSchedule.location ?? '미정',
            },
          });
        }
      }

      resetPostState();
      if (targetPostId) router.replace(`/board/${boardId}/post/${targetPostId}`);
    } catch (err) {
      console.error('게시글 처리 실패', err);
      alert('게시글 저장 중 오류가 발생했습니다.');
    }
  };

  return {
    // Data & Fields
    title,
    setTitle: (val: string) => setField('title', val),
    category,
    categorySheetId: 'post-category-sheet',
    initialContent: content,
    initialImages: images,
    linkedSchedule,
    reserved,
    setReserved: (val: boolean) => setField('reserved', val),
    reservedAt,
    setReservedAt: (val: Date | null) => setField('reservedAt', val),

    // UI State
    isCategoryOpen,
    showExitAlert,
    isReservationModalOpen,
    isSubmitDisabled,

    // Actions
    openCategory,
    closeCategory,
    selectCategory,
    setShowExitAlert,
    openReservationModal,
    closeReservationModal,

    // Handlers
    handleEditorChange,
    handleBack,
    handleSubmit,
    handleScheduleRemove: clearLinkedSchedule,
    resetPostState,
  };
};
