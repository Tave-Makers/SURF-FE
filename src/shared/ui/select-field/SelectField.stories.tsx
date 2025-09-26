import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, useId } from 'react';
import { SelectField } from './SelectField';

const meta: Meta<typeof SelectField> = {
  title: 'Shared/UI/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['m', 'l'],
    },
    selectedValue: { control: 'text' },
    placeholder: { control: 'text' },
    isDisabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    size: 'm',
    placeholder: '기수 및 파트를 선택해주세요',
    selectedValue: '',
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Placeholder: Story = {};

export const Selected: Story = {
  args: {
    selectedValue: '5기 - 디자인',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <SelectField size="m" placeholder="선택해주세요" selectedValue="" />
      <SelectField size="l" placeholder="선택해주세요" selectedValue="백엔드" />
    </div>
  ),
};

export const WithBottomSheet: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const listId = useId();

    const options = ['1기 - 데이터 분석', '2기 - 디자인', '3기 - 백엔드', '4기 - 프론트엔드'];

    return (
      <div className="relative w-[250px]">
        <SelectField
          size="m"
          placeholder="기수 및 파트를 선택해주세요"
          selectedValue={selectedValue}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listId}
        />

        {isOpen && (
          <div
            id={listId}
            role="listbox"
            className="absolute top-full z-10 mt-2 w-full rounded border bg-white shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt}
                aria-selected={selectedValue === opt}
                role="option"
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setSelectedValue(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
};
