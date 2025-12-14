// SheetItem.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Avatar } from '../avatar/Avatar';
import { SheetItem } from './SheetItem';

const meta: Meta<typeof SheetItem> = {
  title: 'Shared/UI/SheetItem',
  component: SheetItem,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SheetItem>;

/* -----------------------------------------------------
 * 1) 기본 예제
 * ----------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <div className="flex w-[20rem] flex-col gap-4">
      <SheetItem title="기본 항목" />
      <SheetItem title="아이콘 있는 항목" node={<SurfIcon name="Heart" />} />
      <SheetItem title="클릭 이벤트" onClick={() => alert('클릭됨')} />
    </div>
  ),
};

/* -----------------------------------------------------
 * 2) Sheet 내부에서 "수정하기 / 삭제하기"
 * ----------------------------------------------------- */
export const WithSheetActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-[20rem]">
        <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => setOpen(true)}>
          옵션 모달 열기
        </button>

        <ModalSheet isOpen={open} onClose={() => setOpen(false)}>
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <Sheet title="게시글 옵션">
                <div className="flex flex-col">
                  <SheetItem
                    title="수정하기"
                    node={<SurfIcon name="EditSolid" />}
                    onClick={() => alert('수정하기 클릭')}
                  />
                  <SheetItem
                    title="삭제하기"
                    node={<SurfIcon name="TrashOneSolid" className="text-foreground-danger" />}
                    onClick={() => alert('삭제하기 클릭')}
                    textColor="danger"
                  />
                </div>
              </Sheet>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop />
        </ModalSheet>
      </div>
    );
  },
};

/* -----------------------------------------------------
 * 3) Sheet + 좋아요 리스트 모달
 * ----------------------------------------------------- */
export const LikedUsersInSheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const users = [
      { id: 1, name: '홍길동' },
      { id: 2, name: '김철수' },
      { id: 3, name: '이영희' },
    ];

    return (
      <div>
        <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => setOpen(true)}>
          좋아요 목록 열기
        </button>

        <ModalSheet isOpen={open} onClose={() => setOpen(false)}>
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <Sheet title="좋아요를 누른 사람">
                <div className="flex flex-col">
                  {users.map((user) => (
                    <SheetItem
                      key={user.id}
                      title={user.name}
                      node={<Avatar size="xs" className="rounded-3!" />}
                      onClick={() => alert(`${user.name} 클릭`)}
                    />
                  ))}
                </div>
              </Sheet>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop />
        </ModalSheet>
      </div>
    );
  },
};

/* -----------------------------------------------------
 * 4) Sheet + 좋아요 목록 - 긴 리스트 (스크롤)
 * ----------------------------------------------------- */
export const LikedUsersLargeListInSheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    // 30명 dummy user 생성
    const manyUsers = Array.from({ length: 30 }).map((_, idx) => ({
      id: idx + 1,
      name: `사용자 ${idx + 1}`,
    }));

    return (
      <div className="w-[20rem]">
        <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => setOpen(true)}>
          좋아요 긴 목록 열기
        </button>

        <ModalSheet isOpen={open} onClose={() => setOpen(false)}>
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <Sheet title="좋아요를 누른 사람">
                {/* 리스트 영역 (스크롤 지원) */}
                <div className="flex flex-col pr-2">
                  {manyUsers.map((user) => (
                    <SheetItem
                      key={user.id}
                      title={user.name}
                      node={<Avatar size="xs" className="rounded-3!" />}
                      onClick={() => alert(`${user.name} 클릭`)}
                    />
                  ))}
                </div>
              </Sheet>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop />
        </ModalSheet>
      </div>
    );
  },
};
