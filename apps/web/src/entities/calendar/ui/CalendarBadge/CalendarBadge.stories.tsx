import type { Meta, StoryObj } from '@storybook/nextjs';
import { CalendarBadge } from './CalendarBadge';

const meta: Meta<typeof CalendarBadge> = {
  title: 'Entities/UI/Calendar/CalendarBadge',
  component: CalendarBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variation: {
      control: 'radio',
      options: ['regular', 'operation', 'other'],
      description: '일정의 유형에 따라 색상과 스타일이 다르게 표시됩니다.',
    },
  },
};
export default meta;
type Story = StoryObj<typeof CalendarBadge>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────
export const Regular: Story = {
  args: {
    variation: 'regular',
  },
};

export const Operation: Story = {
  args: {
    variation: 'operation',
  },
};

export const Etc: Story = {
  args: {
    variation: 'other',
  },
};

// ───────────────────────────────
// 인터랙티브 상태
// ───────────────────────────────
export const AllVariations: Story = {
  render: () => (
    <div className="flex gap-8">
      <CalendarBadge variation="regular" />
      <CalendarBadge variation="operation" />
      <CalendarBadge variation="other" />
    </div>
  ),
};
