'use client';

import { POST_CATEGORIES, PostCategory } from '@/entities/post/model/constants';
import { createPost } from '@/features/post/create-post/api/createPost';
import { usePicker } from '@/shared/hooks/usePicker';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { Header, HeaderMode } from '@/shared/ui/header/Header';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';
import { useCallback, useRef, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { UploadImage } from '@/shared/types/image';

type EditorState = {
  content: string;
  images: UploadImage[];
};

export default function PostPage() {
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

  const [title, setTitle] = useState('');

  // 에디터 내용 저장 ref (리렌더 방지)
  const editorStateRef = useRef<EditorState>({
    content: '',
    images: [],
  });

  // PostEditor -> 부모로 전달받는 콜백
  const handleEditorChange = useCallback((data: EditorState) => {
    editorStateRef.current = data; // 리렌더 방지
  }, []);

  const handleSubmit = async () => {
    const { content, images } = editorStateRef.current;

    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({
        originalUrl: img.uploadedUrl!,
        sequence: idx,
      }));

    try {
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
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('게시글 등록 실패', err);
      }
      alert('게시글 등록 실패');
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Header
        mode={HeaderMode.TextBtn}
        title="공지사항"
        text="등록"
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
            <div id={sheetId} className="flex flex-col gap-[0.25rem] p-15">
              {POST_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item)}
                  className={`rounded-md px-5 py-10 text-left transition-colors ${
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
        <PostEditor onChange={handleEditorChange} />
      </div>
    </div>
  );
}
