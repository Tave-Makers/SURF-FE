'use client';

import { usePicker } from '@/shared/hooks/usePicker';
import { AccordionSelect } from '@/shared/ui/accordion/AccordionSelect';
import { Header, HeaderMode } from '@/shared/ui/header/Header';
import { PostEditor } from '@/widgets/post/post-editor/PostEditor';
import { Sheet as ModalSheet } from 'react-modal-sheet';

export default function PostPage() {
  const { isOpen, open, close, value, select } = usePicker<string>();
  const sheetId = 'post-category-sheet';
  const items = ['행사', '활동', '제휴', '릴리즈', '기타'];

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Header
        mode={HeaderMode.TextBtn}
        title="공지사항"
        text="등록"
        hasLeftIcon={true}
        isDisabled={true}
      />

      <div className="px-13">
        <AccordionSelect
          title={value ?? '행사'}
          isOpen={isOpen}
          onClick={open}
          controlsId={sheetId}
        />
      </div>

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
              {items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => select(item)}
                  className={`rounded-md px-5 py-10 text-left transition-colors ${
                    value === item
                      ? 'bg-background-background-secondary font-semibold'
                      : 'hover:bg-background-background-secondary'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onTap={close} />
      </ModalSheet>

      <h1 className="flex w-full px-13">
        <input
          placeholder="제목을 입력해주세요."
          className="text-foreground-foreground-normal placeholder:foreground-foreground-tertiary-lighter text-body-body3 flex flex-1 pt-10 pb-5 focus:outline-none"
        />
      </h1>

      <div className="flex h-full flex-1 overflow-y-auto">
        <PostEditor />
      </div>
    </div>
  );
}
