import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Comment from './Comment';
import { useState } from 'react';

const meta: Meta<typeof Comment> = {
  title: 'Entities/UI/Comment',
  component: Comment,
  tags: ['autodocs'],
  args: {
    name: '홍길동',
    date: '2026.10.16',
    time: '01:21',
    content: '정말 좋은 글이네요! 잘 읽었습니다 😊',
    likeCount: 12,
    isLiked: false,
  },
  argTypes: {
    onLikeToggle: {
      action: '좋아요 상태 변경됨',
      description: '좋아요 버튼 클릭 시 호출되는 콜백',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Comment>;

// 기본 스토리
export const Default: Story = {};

// 좋아요 누른 상태
export const Liked: Story = {
  args: {
    isLiked: true,
    likeCount: 123,
  },
};

// 긴 댓글 예시
export const LongContent: Story = {
  args: {
    content:
      '이 프로젝트 정말 흥미롭네요! 구현 구조나 상태 관리 로직도 잘 되어있고, 디자인도 깔끔합니다. 앞으로의 업데이트가 기대됩니다. 특히 UI 디테일이 너무 좋네요!',
  },
};

// 좋아요 클릭 이벤트 확인용
export const InteractiveLike: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(args.isLiked);
    const [count, setCount] = useState(args.likeCount ?? 0);

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

    return <Comment {...args} isLiked={liked} likeCount={count} onLikeToggle={handleToggle} />;
  },
};
