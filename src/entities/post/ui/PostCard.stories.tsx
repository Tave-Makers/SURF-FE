import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostCard } from './PostCard';
import type { Post } from '../model/types';

const meta: Meta<typeof PostCard> = {
  title: 'entities/UI/Post/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: { action: '카드 클릭됨' },
    onLikeToggle: { action: '좋아요 토글됨' },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const basePost: Post = {
  id: 1,
  title: 'Surf 개발자 블로그 오픈 🎉',
  content: 'Next.js 기반 Surf 프로젝트의 공식 블로그가 오픈되었습니다!',
  writer: '김테이브',
  date: '25.10.31',
  likeCount: 42,
  isLiked: false,
  commentCount: 8,
  tags: [{ variation: 'event' }, { variation: 'reservation' }],
  thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
};

// -------------------------------
// 기본 상태
// -------------------------------
export const Default: Story = {
  args: { post: basePost },
};

// -------------------------------
// 좋아요가 눌린 상태
// -------------------------------
export const Liked: Story = {
  args: { post: { ...basePost, isLiked: true, likeCount: 43 } },
};

// -------------------------------
// 썸네일 없는 게시물
// -------------------------------
export const NoThumbnail: Story = {
  args: { post: { ...basePost, thumbnailUrl: undefined } },
};

// -------------------------------
// 실제 상태 전환 테스트용 (좋아요 토글)
// -------------------------------
export const InteractiveLike: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(args.post.isLiked);
    const [count, setCount] = useState(args.post.likeCount);

    /** 외부에서 상태 관리 + 내부 콜백 반영 */
    const handleToggle = (newState: boolean) => {
      setLiked(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onLikeToggle?.(newState);
    };

    return (
      <PostCard
        {...args}
        post={{
          ...args.post,
          isLiked: liked,
          likeCount: count,
        }}
        onLikeToggle={handleToggle}
      />
    );
  },
  args: {
    post: basePost,
  },
};
