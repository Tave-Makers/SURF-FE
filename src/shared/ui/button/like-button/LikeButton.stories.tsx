import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import LikeButton from './LikeButton';

// ---------- Meta ----------
const meta: Meta<typeof LikeButton> = {
  title: 'Shared/UI/Button/LikeButton',
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
    onLikeToggle: {
      action: 'toggled',
      description: '좋아요 클릭 콜백',
    },
  },
};
export default meta;

type Story = StoryObj<typeof LikeButton>;

// ---------- Story Variants ----------

// 기본 (좋아요 안 누른 상태)
export const Default: Story = {
  args: {
    isLiked: false,
    count: 23,
  },
};

// 좋아요 상태
export const Liked: Story = {
  args: {
    isLiked: true,
    count: 23,
  },
};

// 인터랙티브 Playground (상태 변화 확인)
export const Playground: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(args.isLiked);
    const [count, setCount] = useState(args.count ?? 0);

    /**
     * 좋아요 상태 클릭 시:
     * 1. 내부 liked/count 상태 갱신
     * 2. 외부(onToggle) 콜백 실행 → Storybook Actions 탭에 로그 출력
     */
    const handleToggle = (newState: boolean) => {
      setLiked(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onLikeToggle?.(newState);
    };

    return <LikeButton {...args} isLiked={liked} count={count} onLikeToggle={handleToggle} />;
  },
  args: {
    isLiked: true,
    count: 42,
  },
};
