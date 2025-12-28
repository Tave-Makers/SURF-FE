import type { Meta, StoryObj } from '@storybook/nextjs';
import { DateTimePicker } from './DateTimePicker';
import { useState } from 'react';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Entities/UI/Schedule/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'date',
      description: '선택된 날짜 객체 (Date)',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  args: {
    value: new Date(),
  },
};

// 실제 동작 확인용
export const Interactive: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date>(args.value ? new Date(args.value) : new Date());

    const handleChange = (newDate: Date) => {
      setDate(newDate);
      args.onChange?.(newDate);
    };

    return (
      <div className="mx-auto max-w-md rounded-lg p-4 sm:w-[360px]">
        <div className="mb-4 text-center text-lg font-bold">
          선택된 날짜: {date.toLocaleString('ko-KR')}
        </div>
        <div className="border">
          <DateTimePicker value={date} onChange={handleChange} />
        </div>
      </div>
    );
  },
  args: {
    value: new Date(),
  },
};
