'use client';

import { POST_CATEGORIES, PostCategoryKey } from '@/entities/post/model/category';
import { createPost } from '@/features/post/create-post/api/createPost';
import { usePicker } from '@/shared/hooks/usePicker';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { UploadImage } from '@/entities/image/model/types';
import { usePostDetail } from '@/features/post/get-post/model/usePostDetailQuery';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { Alert } from '@/shared/ui/alert/Alert';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { useMutation } from '@tanstack/react-query';
import { stripHtml } from '@/shared/lib/stripHtml';

type PostPageProps = { mode: 'create' } | { mode: 'edit'; postId: string };

type EditorState = {
  content: string;
  images: UploadImage[];
};

export default function PostPage(props: PostPageProps) {
  const { mode } = props;

  /** 수정 모드 초기 데이터 로드 */
  const postId = mode === 'edit' ? Number(props.postId) : undefined;

  const { data: postDetail } = usePostDetail(postId!, {
    enabled: mode === 'edit' && !!postId,
  });

  const initialContent = postDetail?.content ?? '';

  /** 초기 이미지 정렬 */
  const initialImages = useMemo(
    () =>
      (postDetail?.imageUrlList ? [...postDetail.imageUrlList] : []).sort(
        (a, b) => a.sequence - b.sequence,
      ),
    [postDetail?.imageUrlList],
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
  } = usePicker<PostCategoryKey>({
    defaultValue: 'event',
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

    const matchedEntry = Object.entries(POST_CATEGORIES).find(
      ([_, value]) => value.label === postDetail.categoryLabel,
    );

    if (matchedEntry) {
      const [matchedKey] = matchedEntry; // event | activity | ...
      select(matchedKey as PostCategoryKey);
    } else {
      console.warn(`카테고리 매칭 실패: ${postDetail.categoryLabel}`);
    }
  }, [mode, postDetail, select]);

  /** 에디터 내용 저장 ref (리렌더 방지) */
  const editorStateRef = useRef<EditorState>({
    content: '',
    images: [],
  });

  /** 본문 빈 상태 저장
   *  헤더 등록 버튼 활성화 및 나가기 경고 모달 조건용 */
  const [isContentEmpty, setIsContentEmpty] = useState(true);

  const isEmptyContent = (html: string) => stripHtml(html) === '';

  /** PostEditor 변경 콜백 */
  const handleEditorChange = useCallback(
    (updatedData: EditorState) => {
      editorStateRef.current = updatedData; // 리렌더 방지

      // content 비었는지 확인 → state 업데이트
      setIsContentEmpty(isEmptyContent(updatedData.content));

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

  /** 게시글 생성 mutation */
  const { mutateAsync: createMutateAsync, isPending: isCreating } = useMutation({
    mutationFn: createPost,
  });

  /** 게시글 수정 mutation */
  const { mutateAsync, isPending: isUpdating } = useUpdatePost(postId ?? 0);

  const handleSubmit = async () => {
    // 중복 제출 방지
    if (isCreating || isUpdating) return;

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
        const res = await createMutateAsync({
          boardId: 1, // 필요시 동적 변경
          categoryId: POST_CATEGORIES[category!].id,
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
          categoryId: POST_CATEGORIES[category!].id,
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

  /** 게시글 작성 중 뒤로가기 시 경고 모달 */
  const [showExitAlert, setShowExitAlert] = useState(false);
  const router = useRouter();

  const handleAlert = () => {
    if (title || !isContentEmpty) {
      setShowExitAlert(true);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {/* 상단 헤더 */}
      <AppHeader
        customBack={handleAlert}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '공지사항',
          hasLeftIcon: true,
          text: mode === 'create' ? '등록' : '수정',
          btnVariant: 'secondary',
          isDisabled: !title || isContentEmpty,
          onClickTextBtn: () => void handleSubmit(),
        }}
      />

      {/* 카테고리 선택 */}
      <div className="px-13">
        <AccordionSelect
          title={POST_CATEGORIES[category!].label}
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
            <div id={sheetId} className="flex flex-col gap-[0.25rem] p-15">
              {Object.values(POST_CATEGORIES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item.key)}
                  className={`rounded-md px-5 py-10 text-left transition-colors ${
                    category === item.key
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
          onChange={(e) => {
            const next = e.target.value.slice(0, 50);
            setTitle(next);
          }}
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

      <Alert
        state="default"
        title="변경 내용을 저장하지 않고 나가시겠습니까?"
        infoText="작성 중인 내용은 저장되지 않습니다."
        isOpen={showExitAlert}
        onClose={() => setShowExitAlert(false)}
        actions={[
          {
            type: 'solid',
            label: '취소',
            variant: 'secondary',
            onClick: () => setShowExitAlert(false),
          },
          {
            type: 'solid',
            label: '나가기',
            variant: 'danger',
            onClick: () => {
              setShowExitAlert(false);
              router.back();
            },
          },
        ]}
      />
    </div>
  );
}
