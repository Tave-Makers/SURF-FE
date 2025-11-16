import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostBadge } from './PostBadge';
import type { CategoryBadge } from '@/entities/post/model/types';

const meta: Meta<typeof PostBadge> = {
  title: 'Entities/Post/UI/PostBadge',
  component: PostBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PostBadge>;

const categories: CategoryBadge[] = ['event', 'activity', 'partnership', 'patch', 'etc'];

export const CategoryBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <PostBadge key={category} type="category" category={category} />
      ))}
    </div>
  ),
};

export const ReservationBadge: Story = {
  args: { type: 'reservation' },
};
