import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    id: 'checkbox',
    label: '체크박스 라벨',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  args: {
    isDefaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-2">
        <Checkbox
          id="checkbox-controlled"
          label="체크박스 라벨"
          isChecked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm">현재 상태: {checked ? '✅ 체크됨' : '❌ 체크 안 됨'}</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    isDefaultChecked: true,
    label: '비활성화 체크박스',
  },
};
