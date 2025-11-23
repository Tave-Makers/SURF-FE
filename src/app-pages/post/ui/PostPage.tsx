'use client';

import { POST_CATEGORIES, PostCategory } from '@/entities/post/model/constants';
import { createPost } from '@/features/post/create-post/api/createPost';
import { usePicker } from '@/shared/hooks/usePicker';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { Header, HeaderMode } from '@/shared/ui/header/Header';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { UploadImage } from '@/entities/image/model/types';
import { usePostDetail } from '@/features/post/get-post/model/usePostDetailQuery';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';

type Mode = 'create' | 'edit';

type PostPageProps = {
  mode: Mode;
  postId?: string;
};

type EditorState = {
  content: string;
  images: UploadImage[];
};

export default function PostPage({ mode, postId }: PostPageProps) {
  /** 수정 모드 초기 데이터 로드 */
  const { data: postDetail } = usePostDetail(mode === 'edit' ? Number(postId) : -1);

  const initialContent = postDetail?.content ?? '';

  /** 초기 이미지 정렬 */
  const initialImages = useMemo(
    () => (postDetail?.images ?? []).sort((a, b) => a.sequence - b.sequence),
    [postDetail?.images],
  );

  /** 제목 */
  const [title, setTitle] = useState('');

  /** 초기화 완료 여부 */
  const initialLoadedRef = useRef(false);

  /** 이미지 변경 여부 */
  const [isImageChanged, setIsImageChanged] = useState(false);

  /** 카테고리 */
  const sheetId = 'post-category-sheet';
  const {
    isOpen,
    open,
    close,
    value: category,
    select,
  } = usePicker<PostCategory>({
    defaultValue: POST_CATEGORIES[0],
  });

  /** 제목 초기화 */
  useEffect(() => {
    if (mode === 'edit' && postDetail) {
      setTitle(postDetail.title);
    }
  }, [mode, postDetail]);

  /** 서버 category 초기화 */
  useEffect(() => {
    if (mode !== 'edit' || !postDetail) return;

    const matchedCategory = POST_CATEGORIES.find((item) => item.label === postDetail.categoryName);
    if (matchedCategory) {
      select(matchedCategory);
    }
  }, [mode, postDetail, select]);

  /** 에디터 내용 저장 ref (리렌더 방지) */
  const editorStateRef = useRef<EditorState>({
    content: '',
    images: [],
  });

  /** PostEditor 변경 콜백 */
  const handleEditorChange = useCallback(
    (updatedData: EditorState) => {
      editorStateRef.current = updatedData; // 리렌더 방지

      if (!initialLoadedRef.current) return; // 초기 로딩 안되었을시 리턴

      // 이미지가 바뀌었는지 검사
      const updatedUrls = updatedData.images.map((img) => img.uploadedUrl ?? null);
      const initialUrls = initialImages.map((img) => img.originalUrl ?? null);

      setIsImageChanged(JSON.stringify(updatedUrls) !== JSON.stringify(initialUrls));
    },
    [initialImages],
  );

  /** PostEditor 초기화 완료 콜백 */
  const handleEditorInitialized = useCallback(() => {
    initialLoadedRef.current = true;
  }, []);

  /** 게시글 수정 mutation */
  const { mutateAsync } = useUpdatePost(Number(postId));

  const handleSubmit = async () => {
    const { content, images } = editorStateRef.current;

    // 서버 전송용 이미지 리스트 가공
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({
        originalUrl: img.uploadedUrl!,
        sequence: idx,
      }));

    try {
      if (mode === 'create') {
        const res = await createPost({
          boardId: 1, // 필요시 동적 변경
          categoryId: category!.id,
          title,
          content,
          pinned: false,
          reserved: false,
          imageUrlList,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('게시글 등록 성공', res);
        }
      } else if (mode === 'edit') {
        const res = await mutateAsync({
          title,
          content,
          categoryId: category!.id,
          pinned: false,
          isReservationChanged: false,
          reservedAt: '',
          isImageChanged,
          imageUrlList,
          hasSchedule: false,
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('게시글 수정 성공', res);
        }
      }
    } catch (err) {
      console.error('게시글 처리 실패', err);
      alert('게시글 처리 실패');
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {/* 상단 헤더 */}
      <Header
        mode={HeaderMode.TextBtn}
        title="공지사항"
        text={mode == 'create' ? '등록' : '수정'}
        hasLeftIcon={true}
        isDisabled={!title}
        onClickTextBtn={() => {
          void handleSubmit();
        }}
      />

      {/* 카테고리 선택 */}
      <div className="px-13">
        <AccordionSelect
          title={category!.label}
          isOpen={isOpen}
          onClick={open}
          controlsId={sheetId}
        />
      </div>

      {/* 카테고리 선택 시트 */}
      <ModalSheet
        isOpen={isOpen}
        onClose={close}
        aria-labelledby={sheetId}
        className="mx-auto flex w-full sm:w-[360px]"
      >
        <ModalSheet.Container>
          <ModalSheet.Header />
          <ModalSheet.Content>
            <div id={sheetId} className="flex flex-col gap-4 px-15 py-16">
              {POST_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item)}
                  className={`rounded-md px-12 py-10 text-left transition-colors ${
                    category!.id === item.id
                      ? 'bg-background-background-secondary font-semibold'
                      : 'hover:bg-background-background-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onTap={close} />
      </ModalSheet>

      {/* 제목 입력 */}
      <div className="flex w-full px-13">
        <label htmlFor="post-title" className="sr-only">
          게시글 제목
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
          aria-required="true"
          className="text-foreground-foreground-normal placeholder:foreground-foreground-tertiary-lighter text-body-body3 flex flex-1 pt-10 pb-5 focus:outline-none"
        />
      </div>

      {/* 본문 에디터 */}
      <div className="flex h-full flex-1 overflow-auto">
        <PostEditor
          initialContent={initialContent}
          initialImages={initialImages}
          onChange={handleEditorChange}
          onInitialized={handleEditorInitialized}
        />
      </div>
    </div>
  );
}
