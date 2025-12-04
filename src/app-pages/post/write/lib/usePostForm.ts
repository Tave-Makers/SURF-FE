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

type Props = {
  mode: PostPageMode;
  postId?: string;
};

export const usePostForm = ({ mode, postId }: Props) => {
  const router = useRouter();
  const numericPostId = mode === 'edit' && postId ? Number(postId) : undefined;

  // 1. 데이터 로드
  const { data: postDetail } = usePostDetail(numericPostId!, {
    enabled: mode === 'edit' && !!numericPostId,
  });

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

      // 스냅샷 저장
      initialSnapshot.current = {
        title: postDetail.title,
        category: initialCategory,
        content: postDetail.content ?? '',
        imageUrls: (postDetail.imageUrlList || [])
          .sort((a, b) => a.sequence - b.sequence)
          .map((img) => img.originalUrl),
      };
    }
  }, [mode, postDetail, selectCategory]);

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
    };
    const init = initialSnapshot.current;

    const isTitleChanged = current.title !== init.title;
    const isCategoryChanged = current.category !== init.category;
    const isContentChanged = current.content !== init.content;
    const isImagesChanged = JSON.stringify(current.imageUrls) !== JSON.stringify(init.imageUrls);

    const isEmpty =
      !current.title && stripHtml(current.content) === '' && current.imageUrls.length === 0;

    return {
      hasChanges: isTitleChanged || isCategoryChanged || isContentChanged || isImagesChanged,
      isImagesChanged,
      isEmpty,
    };
  }, [title, category]);

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

    const { isImagesChanged } = checkHasChanges();
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({ originalUrl: img.uploadedUrl!, sequence: idx }));
    const categoryId = POST_CATEGORIES[category!].id;

    try {
      // TODO : 게시글 생성/수정 성공시 postId에 따른 라우팅 로직 추가
      // let targetPostId = numericPostId; // 수정 모드면 기존 ID가 기본값
      if (mode === 'create') {
        await createMutate({
          boardId: 1, // TODO: params에서 boardId 동적 받아오기
          categoryId,
          title,
          content,
          pinned: false,
          reserved: false,
          imageUrlList,
          hasSchedule: false,
        });
        // targetPostId = res.postId;
      } else {
        await updateMutate({
          title,
          content,
          categoryId,
          pinned: false,
          isReservationChanged: false,
          reservedAt: '',
          isImageChanged: isImagesChanged,
          imageUrlList,
          hasSchedule: false,
        });
      }
      // if (targetPostId) {
      //   router.replace(`/posts/${targetPostId}`);
      // }
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
    isSubmitDisabled: !title || isContentEmpty,

    // Handlers
    handleEditorChange,
    handleBack,
    handleSubmit,
  };
};
