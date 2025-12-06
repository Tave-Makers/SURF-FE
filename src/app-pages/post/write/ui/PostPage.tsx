'use client';

import { POST_CATEGORIES } from '@/entities/post/model/category';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Alert } from '@/shared/ui/alert/Alert';
import { usePostForm } from '../lib/usePostForm';
import { useRouter } from 'next/navigation';
import { POST_VALIDATION } from '@/entities/post/model/validation';
import { POST_BOARDS } from '@/entities/post/model/board';
import { PostBadge } from '@/entities/post/ui/post-badge/PostBadge';

type PostPageProps =
  | { mode: 'create'; boardId: string }
  | { mode: 'edit'; boardId: string; postId: string };

export default function PostPage(props: PostPageProps) {
  const router = useRouter();

  const { mode, boardId } = props;
  const postId = mode === 'edit' ? props.postId : undefined;

  // 로직 훅 호출 (Logic과 View의 연결 고리)
  const {
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
    isSubmitDisabled,
    handleEditorChange,
    handleBack,
    handleSubmit,
  } = usePostForm({ mode, boardId, postId });

  const board = POST_BOARDS.find((b) => b.id === Number(boardId));
  const boardLabel = board ? board.label : '';

  const { MAX_TITLE_LENGTH } = POST_VALIDATION;

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {/* 1. 상단 헤더 */}
      <AppHeader
        customBack={handleBack}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: boardLabel,
          hasLeftIcon: true,
          text: mode === 'create' ? '등록' : '수정',
          btnVariant: 'secondary',
          isDisabled: isSubmitDisabled,
          onClickTextBtn: () => void handleSubmit(),
        }}
      />

      {/* 2. 카테고리 선택 */}
      <div className="px-13">
        <AccordionSelect
          title={POST_CATEGORIES[category!].label}
          isOpen={isCategoryOpen}
          onClick={openCategory}
          controlsId={categorySheetId}
        />
      </div>

      {/* 예약중 태그 */}
      {reserved && reservedAt && (
        <div className="px-13 pt-10">
          <PostBadge type="reservation" />
        </div>
      )}

      {/* 3. 카테고리 시트 */}
      <ModalSheet
        isOpen={isCategoryOpen}
        onClose={closeCategory}
        aria-labelledby={categorySheetId}
        className="mx-auto flex w-full sm:w-[360px]"
      >
        <ModalSheet.Container>
          <ModalSheet.Header />
          <ModalSheet.Content>
            <div id={categorySheetId} className="flex flex-col gap-5 p-15">
              {Object.values(POST_CATEGORIES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(item.key)}
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
        <ModalSheet.Backdrop onTap={closeCategory} />
      </ModalSheet>

      {/* 4. 제목 입력 */}
      <div className="flex w-full px-13">
        <label htmlFor="post-title" className="sr-only">
          게시글 제목
        </label>
        <input
          id="post-title"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
          className="text-foreground-foreground-normal placeholder:foreground-foreground-tertiary-lighter text-body-body3 flex flex-1 pt-10 pb-5 focus:outline-none"
        />
      </div>

      {/* 5. 본문 에디터 */}
      <div className="flex h-full flex-1 overflow-auto">
        <PostEditor
          initialContent={initialContent}
          initialImages={initialImages}
          onChange={handleEditorChange}
          onInitialized={() => {}}
          reserved={reserved}
          setReserved={setReserved}
          reservedAt={reservedAt}
          setReservedAt={setReservedAt}
        />
      </div>

      {/* 6. 뒤로가기 경고 모달 */}
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
