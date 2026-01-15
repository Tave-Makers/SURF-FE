import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostBadge } from './PostBadge';
import { PostCategoryLabel } from '@/entities/post/model/category';

const meta: Meta<typeof PostBadge> = {
  title: 'Entities/UI/Post/PostBadge',
  component: PostBadge,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PostBadge>;

export const CategoryEvent: Story = {
  args: {
    type: 'category',
    label: '행사' as PostCategoryLabel,
  },
};

export const CategoryActivity: Story = {
  args: {
    type: 'category',
    label: '활동' as PostCategoryLabel,
  },
};

export const Reservation: Story = {
  args: {
    type: 'reservation',
  },
};
