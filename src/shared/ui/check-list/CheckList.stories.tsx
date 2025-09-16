import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CheckList } from './CheckList';

const meta: Meta<typeof CheckList> = {
  title: 'Shared/CheckList',
  component: CheckList,
  argTypes: {
    id: { table: { disable: true } },
    title: { control: 'text' },
    isChecked: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onClickItem: { table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof CheckList>;

/* 상태 토글 및 아이템 클릭 테스트*/
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="w-[20rem]">
        <CheckList
          {...args}
          id={1}
          isChecked={checked}
          onChange={(next, id) => {
            setChecked(next);
            alert(`체크 변경: ${id}, ${next}`);
          }}
          onClickItem={(id) => {
            alert(`아이템 클릭됨: ${id}`);
          }}
        />
      </div>
    );
  },
};
