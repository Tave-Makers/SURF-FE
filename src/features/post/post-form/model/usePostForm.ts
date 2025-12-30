import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { stripHtml } from '@/shared/lib/stripHtml';
import { usePicker } from '@/shared/hooks/usePicker';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { POST_VALIDATION } from '@/entities/post/model/validation';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { useGetSingleSchedule } from '@/features/schedule/edit/model/useGetSingleSchedule';
import { useCreatePost } from '@/features/post/create-post/model/useCreatePost';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { useCreatePostSchedule } from '@/features/schedule/create-post-schedule/model/useCreatePostSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';

import { usePostFormStore } from './usePostFormStore';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { usePostInitialization } from '@/features/post/post-form/model/usePostInitialization';
import { usePostDirtyCheck } from '@/features/post/post-form/model/useDirtyCheck';

import { EditorState, PostPageMode } from './types';
import { useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

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

  // 일정 조회 API
  const scheduleId = postDetail?.scheduleId;
  const shouldFetchSchedule = !!scheduleId;
  const { data: postSchedule, isFetching: isScheduleFetching } = useGetSingleSchedule(scheduleId, {
    enabled: shouldFetchSchedule,
    staleTime: 0,
  });

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
    isScheduleFetching,
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

  const queryClient = useQueryClient();

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

        if (linkedSchedule) {
          if (linkedSchedule.id) {
            // 기존에 일정이 있었던 경우 -> 수정 훅 호출
            try {
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
            } catch (err) {
              console.error('일정 수정 실패:', err);
            }
          } else if (targetPostId) {
            // 기존에 일정이 없었는데 새로 추가한 경우 (id가 없음) -> 생성 훅 호출
            try {
              await createScheduleMutate({
                postId: targetPostId, // 수정 중인 현재 게시글 ID
                data: {
                  title: linkedSchedule.title,
                  startAt: linkedSchedule.startDate.toISOString(),
                  endAt: linkedSchedule.endDate.toISOString(),
                  location: linkedSchedule.location ?? '미정',
                  category: linkedSchedule.category,
                },
              });
            } catch (err) {
              console.error('일정 생성 실패:', err);
            }
          }
        }
      }

      // 캐시 무효화 작업
      // 게시글 저장 완료 후, 최신 데이터를 받도록 관련 캐시를 무효화합니다.
      const invalidatePromises = [
        // 게시글 상세 정보 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: postQueryKeys.detail(targetPostId!),
        }),
        // 게시글 목록 캐시 무효화 (필요시)
        queryClient.invalidateQueries({
          queryKey: postQueryKeys.lists(),
        }),
      ];

      // 만약 일정이 존재한다면 일정 관련 캐시도 모두 무효화
      if (linkedSchedule) {
        invalidatePromises.push(
          queryClient.invalidateQueries({
            queryKey: scheduleQueryKeys.lists(),
          }),
        );

        // 기존 일정 편집 시에만 해당 일정의 상세 캐시 무효화
        if (linkedSchedule.id) {
          invalidatePromises.push(
            queryClient.invalidateQueries({
              queryKey: scheduleQueryKeys.detail(linkedSchedule.id),
            }),
          );
        }
      }

      // 모든 무효화 작업이 완료될 때까지 대기
      await Promise.all(invalidatePromises);

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
    isScheduleFetching,

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
