import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectField } from './SelectField';

const meta: Meta<typeof SelectField> = {
  title: 'Shared/UI/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio', options: ['m', 'l'] },
    },
    label: {
      control: 'text',
    },
    isDisabled: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof SelectField>;

export const Size: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <SelectField {...args} isOpen={isOpen} onClick={() => setIsOpen(true)} />
        {isOpen && (
          <div className="mt-2 rounded-md bg-gray-100 p-4">
            <p>여기에 바텀시트 내용 또는 옵션을 표시할 수 있습니다.</p>
            <button onClick={() => setIsOpen(false)}>닫기</button>
          </div>
        )}
      </>
    );
  },
  args: {
    size: 'm',
    label: '옵션을 선택하세요',
    isDisabled: false,
    isOpen: false,
  },
};
