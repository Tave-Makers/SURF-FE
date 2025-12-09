import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { stripHtml } from '@/shared/lib/stripHtml';
import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { usePicker } from '@/shared/hooks/usePicker';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { EditorState, PostPageMode, PostSnapshot } from './types';
import { useCreatePost } from '@/features/post/create-post/model/useCreatePost';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { usePostReservationStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { useCreatePostSchedule } from '@/features/schedule/create-post-schedule/model/useCreatePostSchedule';
import { ScheduleFormData } from '@/features/schedule/create/model/types';
import { usePostDirtyCheck } from '@/features/post/post-form/model/useDirtyCheck';
import { usePostInitialization } from '@/features/post/post-form/model/usePostInitialization';

type Props = {
  mode: PostPageMode;
  boardId: string;
  postId?: string;
};

export const usePostForm = ({ mode, boardId, postId }: Props) => {
  const router = useRouter();
  const numericPostId = mode === 'edit' && postId ? Number(postId) : undefined;

  // 1. Global State (Zustand)
  const { linkedSchedule, setLinkedSchedule, clearLinkedSchedule } = useCreatePostScheduleStore();
  const { reserved, setReserved, reservedAt, setReservedAt, resetReservation } =
    usePostReservationStore();

  const resetPostState = useCallback(() => {
    clearLinkedSchedule();
    resetReservation();
    isScheduleInitializedRef.current = false;
  }, [clearLinkedSchedule, resetReservation]);

  // 2. Local UI State
  const [title, setTitle] = useState('');
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(true);

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const openReservationModal = () => setIsReservationModalOpen(true);
  const closeReservationModal = () => setIsReservationModalOpen(false);

  const categorySheetId = 'post-category-sheet';
  const {
    isOpen: isCategoryOpen,
    open: openCategory,
    close: closeCategory,
    value: category,
    select: selectCategory,
  } = usePicker<PostCategoryKey>({ defaultValue: 'event' });

  // 3. Refs
  const initialSnapshot = useRef<PostSnapshot & { initialSchedule: ScheduleFormData | null }>({
    title: '',
    category: 'event',
    content: '',
    imageUrls: [],
    reserved: false,
    reservedAt: null,
    scheduleId: null,
    initialSchedule: null,
  });
  const editorStateRef = useRef<EditorState>({
    content: '',
    images: [],
  });
  const isScheduleInitializedRef = useRef(false);

  // 4. Queries
  const { data: postDetail } = usePostDetail(numericPostId!, {
    enabled: mode === 'edit' && !!numericPostId,
  });
  const { data: postSchedule } = useGetPostScheduleQuery(
    numericPostId!,
    mode === 'edit' && !!numericPostId && !!postDetail?.hasSchedule,
  );
  const { mutateAsync: editScheduleMutate } = useEditSchedule();
  const { mutateAsync: createScheduleMutate } = useCreatePostSchedule();

  // 5. [Hook 호출] 초기화 로직 분리
  usePostInitialization({
    mode,
    postDetail,
    postSchedule,
    linkedSchedule,
    setLinkedSchedule,
    setTitle,
    selectCategory,
    setReserved,
    setReservedAt,
    initialSnapshot,
    isScheduleInitializedRef,
  });

  // 에디터 초기값 (메모이제이션)
  const initialContent = useMemo(() => postDetail?.content ?? '', [postDetail]);
  const initialImages = useMemo(
    () =>
      (postDetail?.imageUrlList ? [...postDetail.imageUrlList] : []).sort(
        (a, b) => a.sequence - b.sequence,
      ),
    [postDetail?.imageUrlList],
  );

  // 6. 변경 감지 함수 (Dirty Check)
  const { checkHasChanges } = usePostDirtyCheck({
    title,
    category: category!,
    editorStateRef,
    linkedSchedule,
    reserved,
    reservedAt,
    initialSnapshot,
  });

  // 7. 핸들러들
  const handleEditorChange = useCallback((updatedData: EditorState) => {
    editorStateRef.current = updatedData;
    setIsContentEmpty(stripHtml(updatedData.content) === '');
  }, []);

  const handleBack = () => {
    const { hasChanges, isEmpty } = checkHasChanges();
    if (hasChanges && !isEmpty) setShowExitAlert(true);
    else {
      resetPostState();
      router.back();
    }
  };

  const { mutateAsync: createMutate, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdatePost(numericPostId!);

  const handleSubmit = async () => {
    // 중복 제출 방지
    if (isCreating || isUpdating) return;

    const { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_IMAGES } = POST_VALIDATION;

    if (title.length > MAX_TITLE_LENGTH) {
      alert(`제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }

    const { content, images } = editorStateRef.current;
    const textContent = stripHtml(content);

    if (textContent.length > MAX_CONTENT_LENGTH) {
      alert(`본문은 최대 ${MAX_CONTENT_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }

    if (images.length > MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지 첨부할 수 있습니다.`);
      return;
    }

    const { isImagesChanged, isReservationChanged } = checkHasChanges();
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({ originalUrl: img.uploadedUrl!, sequence: idx }));
    const categoryId = POST_CATEGORIES[category!].id;

    try {
      let targetPostId = numericPostId; // 수정 모드면 기존 ID가 기본값
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
            postId: targetPostId, // 생성된 게시글 ID 사용
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
          isReservationChanged: isReservationChanged,
          reservedAt: reservedAt ? reservedAt.toISOString() : '',
          isImageChanged: isImagesChanged,
          imageUrlList,
          hasSchedule: !!linkedSchedule,
        });

        if (linkedSchedule && linkedSchedule.id) {
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
      if (targetPostId) {
        router.replace(`/board/${boardId}/post/${targetPostId}`);
      }
    } catch (err) {
      console.error('게시글 처리 실패', err);
      alert('게시글 저장 중 오류가 발생했습니다.');
    }
  };

  return {
    // Data
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
    reserved,
    setReserved,
    reservedAt,
    setReservedAt,

    // UI State
    showExitAlert,
    setShowExitAlert,
    isReservationModalOpen,
    isSubmitDisabled: !title || isContentEmpty,

    // Handlers
    handleEditorChange,
    handleBack,
    handleSubmit,
    handleScheduleRemove: clearLinkedSchedule,
    openReservationModal,
    closeReservationModal,
    resetPostState,
  };
};
