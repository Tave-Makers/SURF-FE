// Sheet.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sheet from './Sheet';
import CheckList from '../check-list/CheckList';
import { useState } from 'react';

const meta: Meta<typeof Sheet> = {
  title: 'Shared/UI/Sheet',
  tags: ['autodocs'],
  component: Sheet,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    hasTitleSection: { control: 'boolean' },
    hasBtn: { control: 'boolean' },
    hasTwoSolidBtns: { control: 'boolean' },
    hasTextBtn: { control: 'boolean' },
    hasGrabber: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof Sheet>;

/* children이 체크리스트인 경우 */
export const WithCheckList: Story = {
  render: (args) => {
    // 체크 여부 상태 관리
    const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
      1: false,
      2: false,
      3: false,
    });

    const items = [
      { id: 1, title: '1번 약관입니다.' },
      { id: 2, title: '2번 약관입니다.' },
      { id: 3, title: '3번 약관입니다.' },
    ];

    const handleToggle = (next: boolean, id: number) => {
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
    hasBtn: true,
    hasTwoSolidBtns: true,
    hasTextBtn: true,
    hasTitleSection: true,
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
    hasBtn: false,
    hasTitleSection: true,
  },
};
