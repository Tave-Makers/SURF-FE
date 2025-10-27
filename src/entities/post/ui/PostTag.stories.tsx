import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostTag } from './PostTag';

const meta: Meta<typeof PostTag> = {
  title: 'Entities/UI/Post/PostTag',
  component: PostTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variation: {
      control: 'radio',
      options: ['event', 'reservation'],
      description: '태그의 종류 (행사 / 예약중)',
    },
  },
};
export default meta;

type Story = StoryObj<typeof PostTag>;

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
// 여러 태그 비교용
// ───────────────────────────────
export const AllVariations: Story = {
  render: () => (
    <div className="flex gap-8">
      <PostTag variation="reservation" />
      <PostTag variation="event" />
    </div>
  ),
};
