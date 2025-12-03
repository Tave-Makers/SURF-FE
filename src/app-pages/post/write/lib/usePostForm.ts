import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { stripHtml } from '@/shared/lib/stripHtml';
import { usePostDetail } from '@/features/post/get-post/model/usePostDetailQuery';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { createPost } from '@/features/post/create-post/api/createPost';
import { usePicker } from '@/shared/hooks/usePicker';
import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { EditorState, PostPageMode, PostSnapshot } from '../model/types';

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

  const { mutateAsync: createMutate } = useMutation({ mutationFn: createPost });
  const { mutateAsync: updateMutate } = useUpdatePost(numericPostId ?? 0);

  const handleSubmit = async () => {
    const { content, images } = editorStateRef.current;
    const { isImagesChanged } = checkHasChanges();
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({ originalUrl: img.uploadedUrl!, sequence: idx }));
    const categoryId = POST_CATEGORIES[category!].id;

    try {
      if (mode === 'create') {
        await createMutate({
          boardId: 1,
          categoryId,
          title,
          content,
          pinned: false,
          reserved: false,
          imageUrlList,
          hasSchedule: false,
        });
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
      // 성공 처리 (라우팅 등)
    } catch (err) {
      console.error(err);
      alert('처리 실패');
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
