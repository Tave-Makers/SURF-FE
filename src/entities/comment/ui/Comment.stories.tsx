import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Comment from './Comment';

const meta: Meta<typeof Comment> = {
  title: 'Entities/UI/Comment',
  component: Comment,
  tags: ['autodocs'],
  args: {
    name: '홍길동',
    date: '2026.10.16',
    time: '01:21',
    content: '정말 좋은 글이네요! 잘 읽었습니다 😊',
    likes: 12,
  },
};
export default meta;

type Story = StoryObj<typeof Comment>;

// 기본 스토리
export const Default: Story = {};

// 좋아요가 많은 댓글
export const ManyLikes: Story = {
  args: {
    likes: 132,
  },
};

// 긴 댓글 예시
export const LongContent: Story = {
  args: {
    content:
      '이 프로젝트 정말 흥미롭네요! 구현 구조나 상태 관리 로직도 잘 되어있고, 디자인도 깔끔합니다. 앞으로의 업데이트가 기대됩니다.',
  },
};
