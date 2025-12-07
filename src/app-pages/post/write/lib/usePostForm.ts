import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { stripHtml } from '@/shared/lib/stripHtml';
import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { usePicker } from '@/shared/hooks/usePicker';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { EditorState, PostPageMode, PostSnapshot } from '../model/types';
import { useCreatePost } from '@/features/post/create-post/model/useCreatePost';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { usePostScheduleStore } from '@/features/calendar/schedule/post-schedule/model/usePostScheduleStore';
import { usePostReservationStore } from '@/features/calendar/schedule/post-schedule/model/usePostScheduleStore';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { useEditSchedule } from '@/features/calendar/schedule/edit/model/useEditSchedule';

type Props = {
  mode: PostPageMode;
  boardId: string;
  postId?: string;
};

export const usePostForm = ({ mode, boardId, postId }: Props) => {
  const router = useRouter();
  const { linkedSchedule, setLinkedSchedule, clearLinkedSchedule } = usePostScheduleStore();
  const { reserved, setReserved, reservedAt, setReservedAt, resetReservation } =
    usePostReservationStore();
  const resetPostState = () => {
    clearLinkedSchedule();
    resetReservation();
  };

  const numericPostId = mode === 'edit' && postId ? Number(postId) : undefined;

  // 1. 데이터 로드
  const { data: postDetail } = usePostDetail(numericPostId!, {
    enabled: mode === 'edit' && !!numericPostId,
  });

  const { data: postSchedule } = useGetPostScheduleQuery(
    numericPostId!,
    mode === 'edit' && !!numericPostId && !!postDetail?.hasSchedule,
  );

  const { mutateAsync: editScheduleMutate } = useEditSchedule();

  // 2. UI State
  const [title, setTitle] = useState('');
  const [showExitAlert, setShowExitAlert] = useState(false);

  // 버튼 활성화용 상태 (렌더링 최적화를 위해 내용 유무만 state로 관리)
  const [isContentEmpty, setIsContentEmpty] = useState(true);

  // 카테고리 Picker
  const categorySheetId = 'post-category-sheet';
  const {
    isOpen: isCategoryOpen,
    open: openCategory,
    close: closeCategory,
    value: category,
    select: selectCategory,
  } = usePicker<PostCategoryKey>({ defaultValue: 'event' });

  // 3. Refs (스냅샷 및 에디터 상태)
  const initialSnapshot = useRef<PostSnapshot>({
    title: '',
    category: 'event',
    content: '',
    imageUrls: [],
    reserved: false,
    reservedAt: null,
  });

  const editorStateRef = useRef<EditorState>({
    content: '',
    images: [],
  });

  // 4. 초기화 로직
  useEffect(() => {
    if (mode === 'create') return;

    if (mode === 'edit' && postDetail) {
      setTitle(postDetail.title);

      const matchedEntry = Object.entries(POST_CATEGORIES).find(
        ([_, value]) => value.label === postDetail.categoryLabel,
      );
      const initialCategory = matchedEntry ? (matchedEntry[0] as PostCategoryKey) : 'event';
      selectCategory(initialCategory);

      // 예약 정보 초기화 로직
      let initialReserved = reserved; // Store에 있는 현재 값 (또는 기본값 false)
      let initialReservedAt = reservedAt; // Store에 있는 현재 값

      // API 데이터 기반으로 초기 예약 상태 계산
      if (!reserved && postDetail.postedAt) {
        const postedDate = new Date(postDetail.postedAt);
        const now = new Date();

        if (postedDate > now) {
          initialReserved = true;
          initialReservedAt = postedDate;
          setReserved(true);
          setReservedAt(postedDate);
        }
      }

      // 일정 정보 초기화 로직
      if (!linkedSchedule && postSchedule) {
        // 카테고리 매핑 로직
        const mappedCategory =
          postSchedule.category === 'operation' || postSchedule.category === 'other'
            ? postSchedule.category
            : 'regular';

        setLinkedSchedule({
          id: postSchedule.scheduleId,
          title: postSchedule.title,
          startDate: new Date(postSchedule.startAt),
          endDate: new Date(postSchedule.endAt),
          location: postSchedule.location,

          category: mappedCategory as ScheduleCategory,
        });
      }

      // 스냅샷 저장
      initialSnapshot.current = {
        title: postDetail.title,
        category: initialCategory,
        content: postDetail.content ?? '',
        imageUrls: (postDetail.imageUrlList || [])
          .sort((a, b) => a.sequence - b.sequence)
          .map((img) => img.originalUrl),
        reserved: initialReserved,
        reservedAt: initialReservedAt,
      };
    }
  }, [
    mode,
    postDetail,
    postSchedule,
    selectCategory,
    reserved,
    reservedAt,
    setReserved,
    setReservedAt,
    linkedSchedule,
    setLinkedSchedule,
  ]);

  // 에디터 초기값 (메모이제이션)
  const initialContent = useMemo(() => postDetail?.content ?? '', [postDetail]);
  const initialImages = useMemo(
    () =>
      (postDetail?.imageUrlList ? [...postDetail.imageUrlList] : []).sort(
        (a, b) => a.sequence - b.sequence,
      ),
    [postDetail?.imageUrlList],
  );

  // 5. 변경 감지 함수 (Dirty Check)
  const checkHasChanges = useCallback(() => {
    const current = {
      title,
      category: category!,
      content: editorStateRef.current.content,
      imageUrls: editorStateRef.current.images.map((img) => img.uploadedUrl ?? null),
      reserved,
      reservedAt,
    };
    const init = initialSnapshot.current;

    const isTitleChanged = current.title !== init.title;
    const isCategoryChanged = current.category !== init.category;
    const isContentChanged = current.content !== init.content;
    const isImagesChanged = JSON.stringify(current.imageUrls) !== JSON.stringify(init.imageUrls);

    const isReservedToggleChanged = current.reserved !== init.reserved;
    const currentTime = current.reservedAt ? current.reservedAt.getTime() : null;
    const initTime = init.reservedAt ? init.reservedAt.getTime() : null;
    const isReservedTimeChanged = currentTime !== initTime;

    // 최종 예약 변경 여부 (상태가 바뀌었거나, 시간이 바뀌었을 때)
    const isReservationChanged = isReservedToggleChanged || isReservedTimeChanged;

    const isEmpty =
      !current.title && stripHtml(current.content) === '' && current.imageUrls.length === 0;

    return {
      hasChanges: isTitleChanged || isCategoryChanged || isContentChanged || isImagesChanged,
      isImagesChanged,
      isReservationChanged,
      isEmpty,
    };
  }, [title, category, reserved, reservedAt]);

  // 6. 핸들러들
  const handleEditorChange = useCallback((updatedData: EditorState) => {
    editorStateRef.current = updatedData;
    setIsContentEmpty(stripHtml(updatedData.content) === '');
  }, []);

  const handleBack = () => {
    const { hasChanges, isEmpty } = checkHasChanges();
    if (hasChanges && !isEmpty) setShowExitAlert(true);
    else router.back();
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
              location: linkedSchedule.location ?? '',
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
    showExitAlert,
    setShowExitAlert,
    reserved,
    setReserved,
    reservedAt,
    setReservedAt,
    isSubmitDisabled: !title || isContentEmpty,

    // Handlers
    handleEditorChange,
    handleBack,
    handleSubmit,
  };
};
