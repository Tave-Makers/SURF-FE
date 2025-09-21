// Sheet.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sheet } from './Sheet';
import { CheckList } from '../check-list/CheckList';
import { useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';

const meta: Meta<typeof Sheet> = {
  title: 'Shared/UI/Sheet',
  tags: ['autodocs'],
  component: Sheet,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    children: { table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof Sheet>;

/* children이 체크리스트인 경우 */
export const WithCheckList: Story = {
  render: (args) => {
    // 체크 여부 상태 관리
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
      1: false,
      2: false,
      3: false,
    });

    const items = [
      { id: '1', title: '1번 약관입니다.' },
      { id: '2', title: '2번 약관입니다.' },
      { id: '3', title: '3번 약관입니다.' },
    ];

    const handleToggle = (next: boolean, id: string) => {
      setCheckedItems((prev) => ({
        ...prev,
        [id]: next,
      }));
    };

    return (
      <div className="w-[20rem]">
        <Sheet {...args}>
          <div className="flex flex-col gap-[0.5rem]">
            {items.map((item) => (
              <CheckList
                key={item.id}
                id={item.id}
                title={item.title}
                isChecked={checkedItems[item.id]}
                onChange={handleToggle}
                onClickItem={(id) => alert(`${id}번 약관 상세로 이동합니다.`)}
              />
            ))}
          </div>
        </Sheet>
      </div>
    );
  },
  args: {
    title: '약관 동의',
    description: '약관 확인 후 동의해주세요.',
    primaryBtnLabel: '선택하기',
    secondaryBtnLabel: '취소하기',
    textBtnLabel: '자세히보기',
  },
};

/* children이 사각형 div인 경우 */
export const WithBox: Story = {
  render: (args) => (
    <div className="w-[20rem]">
      <Sheet {...args}>
        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-[var(--color-background-tertiary)]">
          콘텐츠 박스
        </div>
      </Sheet>
    </div>
  ),
  args: {
    title: '박스 예제',
    description: '임의의 콘텐츠를 넣을 수 있습니다',
  },
};

/* react-modal-sheet 라이브러리 사용 예시 */
export const InModalSheetLib: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    return (
      <div>
        <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => setOpen(true)}>
          모달 열기
        </button>

        <ModalSheet isOpen={open} onClose={() => setOpen(false)} className="w-[20rem]">
          <ModalSheet.Container>
            <ModalSheet.Header />
            <ModalSheet.Content>
              <Sheet {...args}>
                <CheckList
                  id={'1'}
                  title="약관에 동의합니다."
                  isChecked={checked}
                  onChange={(next) => setChecked(next)}
                  onClickItem={(id) => alert(`${id}번 약관 상세로 이동합니다.`)}
                />
              </Sheet>
            </ModalSheet.Content>
          </ModalSheet.Container>
          <ModalSheet.Backdrop />
        </ModalSheet>
      </div>
    );
  },
  args: {
    title: '모달 시트',
    description: 'react-modal-sheet 안에서 사용 예시',
    primaryBtnLabel: '선택하기',
    secondaryBtnLabel: '취소하기',
    textBtnLabel: '자세히보기',
  },
};
