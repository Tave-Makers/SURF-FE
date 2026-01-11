import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

import { Sheet } from './Sheet';
import { CheckList } from '../check-list/CheckList';

const meta: Meta<typeof Sheet> = {
  title: 'Shared/UI/Sheet',
  tags: ['autodocs'],
  component: Sheet,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    children: { table: { disable: true } },
  },
  args: {
    title: '약관 동의',
    description: '약관 확인 후 동의해주세요.',
  },
};
export default meta;

type Story = StoryObj<typeof Sheet>;

/* children이 체크리스트인 경우 */
export const WithCheckList: Story = {
  render: (args) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
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
      setCheckedItems((prev) => ({ ...prev, [id]: next }));
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
};

export const WithBox: Story = {
  args: {
    title: '박스 예제',
    description: '임의의 콘텐츠를 넣을 수 있습니다',
  },
  render: (args) => (
    <div className="w-[20rem]">
      <Sheet {...args}>
        <div className="bg-background-badge-darker flex h-32 w-full items-center justify-center">
          콘텐츠 박스
        </div>
      </Sheet>
    </div>
  ),
};
