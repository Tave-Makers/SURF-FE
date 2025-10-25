import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LikeButton from './LikeButton';

// Storybook 메타데이터
const meta: Meta<typeof LikeButton> = {
  title: 'Shared/UI/LikeButton',
  component: LikeButton,
  tags: ['autodocs'],
  argTypes: {
    isLiked: {
      control: 'boolean',
      description: '좋아요 상태',
    },
    count: {
      control: 'number',
      description: '좋아요 개수',
    },
  },
};
export default meta;

type Story = StoryObj<typeof LikeButton>;

// 💖 기본 (좋아요 안 누른 상태)
export const Default: Story = {
  args: {
    isLiked: false,
    count: 23,
  },
};

// ❤️ 좋아요 상태
export const Liked: Story = {
  args: {
    isLiked: true,
    count: 23,
  },
};

// 🧪 여러 크기 실험용 (선택)
export const Playground: Story = {
  args: {
    isLiked: false,
    count: 0,
  },
};
