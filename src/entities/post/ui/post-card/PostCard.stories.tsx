import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostCard } from './PostCard';
import type { Post } from '@/entities/post/model/types';

const meta: Meta<typeof PostCard> = {
  title: 'Entities/Post/UI/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const mockPost: Post = {
  id: 1,
  title: '프론트엔드 스터디 모집합니다!',
  content: 'React 19, Zustand, Tanstack Query 중심으로 학습해요 🚀',
  writer: '보라',
  date: '2025-11-12',
  likeCount: 42,
  isLiked: false,
  commentCount: 8,
  category: 'event',
  isReserved: false,
  thumbnailUrl: 'https://images.unsplash.com/photo-1522204507765-4b9e8f69e4f1?w=200&h=200&fit=crop',
};

export const Default: Story = {
  args: {
    post: mockPost,
    currentCategory: 'all',
    userLevel: 'member',
  },
};

export const Liked: Story = {
  args: {
    post: {
      ...mockPost,
      isLiked: true,
      likeCount: 99,
    },
    currentCategory: 'all',
    userLevel: 'member',
  },
};

export const AdminView: Story = {
  args: {
    post: {
      ...mockPost,
      isReserved: true,
    },
    currentCategory: 'release',
    userLevel: 'manager',
  },
};

export const WithoutThumbnail: Story = {
  args: {
    post: {
      ...mockPost,
      thumbnailUrl: undefined,
    },
    currentCategory: 'all',
    userLevel: 'member',
  },
};
