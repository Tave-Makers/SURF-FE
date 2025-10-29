import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarTag } from './CalendarTag';

const meta: Meta<typeof CalendarTag> = {
  title: 'Entities/UI/Calendar/CalendarTag',
  component: CalendarTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variation: {
      control: 'radio',
      options: ['official', 'operation', 'other'],
      description: '일정의 유형에 따라 색상과 스타일이 다르게 표시됩니다.',
    },
  },
};
export default meta;
type Story = StoryObj<typeof CalendarTag>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────
export const Official: Story = {
  args: {
    variation: 'official',
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
export const Interactive: Story = {
  render: (args) => (
    <div className="flex gap-8">
      <CalendarTag {...args} variation="official" />
      <CalendarTag {...args} variation="operation" />
      <CalendarTag {...args} variation="other" />
    </div>
  ),
};
