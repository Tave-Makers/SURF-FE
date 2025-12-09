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
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { usePostReservationStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { ScheduleCategory } from '@/entities/schedule/model/types';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { useCreatePostSchedule } from '@/features/schedule/create-post-schedule/model/useCreatePostSchedule';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

type Props = {
  mode: PostPageMode;
  boardId: string;
  postId?: string;
};

const isSameSchedule = (storeData: ScheduleFormData | null, serverData: ScheduleFormData) => {
  if (!storeData) return false; // 스토어가 비어있으면 다르다고 판단 (업데이트 필요)

  // 1. ID 비교
  if (storeData.id !== serverData.id) return false;

  // 2. 텍스트 데이터 비교
  if (storeData.title !== serverData.title) return false;
  if (storeData.category !== serverData.category) return false;
  if (storeData.location !== serverData.location) return false;

  // 3. 날짜 비교 (Date 객체는 getTime()으로 밀리초 단위 비교가 필수)
  const storeStart = new Date(storeData.startDate).getTime();
  const serverStart = new Date(serverData.startDate).getTime();
  if (storeStart !== serverStart) return false;

  const storeEnd = new Date(storeData.endDate).getTime();
  const serverEnd = new Date(serverData.endDate).getTime();
  if (storeEnd !== serverEnd) return false;

  return true; // 모든 검사를 통과하면 같은 데이터임
};

export const usePostForm = ({ mode, boardId, postId }: Props) => {
  const router = useRouter();

  // 스토어 데이터
  const { linkedSchedule, setLinkedSchedule, clearLinkedSchedule } = useCreatePostScheduleStore();
  const { reserved, setReserved, reservedAt, setReservedAt, resetReservation } =
    usePostReservationStore();
  const resetPostState = useCallback(() => {
    clearLinkedSchedule();
    resetReservation();
    isScheduleInitializedRef.current = false;
  }, [clearLinkedSchedule, resetReservation]);

  // 예약 모달 상태
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const openReservationModal = () => setIsReservationModalOpen(true);
  const closeReservationModal = () => setIsReservationModalOpen(false);

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
  const { mutateAsync: createScheduleMutate } = useCreatePostSchedule();

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

  // 4. 초기화 로직
  useEffect(() => {
    if (mode === 'create' || isScheduleInitializedRef.current) return;
    if (linkedSchedule) {
      isScheduleInitializedRef.current = true; // 초기화된 것으로 간주
      return;
    }

    if (mode === 'edit' && postDetail) {
      setTitle(postDetail.title);

      const matchedEntry = Object.entries(POST_CATEGORIES).find(
        ([_, value]) => value.label === postDetail.categoryLabel,
      );
      const initialCategory = matchedEntry ? (matchedEntry[0] as PostCategoryKey) : 'event';
      selectCategory(initialCategory);

      // 예약 정보 초기화 로직
      let initialReserved = false;
      let initialReservedAt: Date | null = null;

      if (postDetail.postedAt) {
        const postedDate = new Date(postDetail.postedAt);
        if (postedDate > new Date()) {
          initialReserved = true;
          initialReservedAt = postedDate;
        }
      }

      setReserved(initialReserved);
      setReservedAt(initialReservedAt);

      // 일정 정보 초기화 로직
      let initialScheduleData: ScheduleFormData | null = null;

      if (postSchedule) {
        // 카테고리 매핑 로직
        const mappedCategory =
          postSchedule.category === 'operation' || postSchedule.category === 'other'
            ? postSchedule.category
            : 'regular';

        const newScheduleData = {
          id: postSchedule.scheduleId,
          title: postSchedule.title,
          startDate: new Date(postSchedule.startAt),
          endDate: new Date(postSchedule.endAt),
          location: postSchedule.location ?? '미정',
          category: mappedCategory as ScheduleCategory,
        };
        initialScheduleData = newScheduleData;

        const shouldSyncStore = !isSameSchedule(linkedSchedule, newScheduleData);
        if (shouldSyncStore) {
          setLinkedSchedule(newScheduleData);
          isScheduleInitializedRef.current = true;
        }
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
        scheduleId: postSchedule?.scheduleId || null,
        initialSchedule: initialScheduleData,
      };
    }
  }, [
    mode,
    postDetail,
    postSchedule,
    linkedSchedule,
    selectCategory,
    setReserved,
    setReservedAt,
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

    // [수정] 일정 변경 감지 로직 (여기서 계산)
    let isScheduleChanged = false;

    const currentSchedule = linkedSchedule;
    const initialSchedule = init.initialSchedule;

    if (!currentSchedule && !initialSchedule) {
      // 둘 다 없으면 변경 없음
      isScheduleChanged = false;
    } else if (!currentSchedule || !initialSchedule) {
      // 둘 중 하나만 있으면 변경됨 (추가 or 삭제)
      isScheduleChanged = true;
    } else {
      // 둘 다 있으면 내용 비교 (!isSameSchedule 활용)
      // 주의: isSameSchedule의 첫 번째 인자가 null 허용하도록 수정하셨다면 그대로 쓰면 됩니다.
      isScheduleChanged = !isSameSchedule(currentSchedule, initialSchedule);
    }

    const isEmpty =
      !current.title && stripHtml(current.content) === '' && current.imageUrls.length === 0;

    return {
      hasChanges:
        isTitleChanged ||
        isCategoryChanged ||
        isContentChanged ||
        isImagesChanged ||
        isReservationChanged ||
        isImagesChanged ||
        isScheduleChanged,
      isImagesChanged,
      isReservationChanged,
      isEmpty,
    };
  }, [title, category, reserved, reservedAt, linkedSchedule]);

  // 6. 핸들러들
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
          const res = await editScheduleMutate({
            scheduleId: linkedSchedule.id,
            data: {
              category: linkedSchedule.category,
              title: linkedSchedule.title,
              startAt: linkedSchedule.startDate.toISOString(),
              endAt: linkedSchedule.endDate.toISOString(),
              location: linkedSchedule.location ?? '미정',
            },
          });
          console.log(res);
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
