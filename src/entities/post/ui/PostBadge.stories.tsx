import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostBadge } from './PostBadge';

const meta: Meta<typeof PostBadge> = {
  title: 'Entities/UI/Post/PostBadge',
  component: PostBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variation: {
      control: 'radio',
      options: ['event', 'reservation'],
      description: '뱃지의 종류 (행사 / 예약중)',
    },
  },
};
export default meta;

type Story = StoryObj<typeof PostBadge>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────
export const Event: Story = {
  args: {
    variation: 'event',
  },
};

export const Reservation: Story = {
  args: {
    variation: 'reservation',
  },
};

// ───────────────────────────────
// 여러 배지 비교용
// ───────────────────────────────
export const AllVariations: Story = {
  render: () => (
    <div className="flex gap-8">
      <PostBadge id={1} variation="reservation" />
      <PostBadge id={2} variation="event" />
    </div>
  ),
};
