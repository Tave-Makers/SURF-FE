import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventTitle } from './EventTitle';

const meta = {
  title: 'Entities/UI/Schedule/EventTitle',
  component: EventTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EventTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AsMainTitle: Story = {
  args: {
    isTitle: true,
    title: '정규행사',
  },
};

export const AsPlaceholder: Story = {
  args: {
    isTitle: false,
    title: '제목을 입력해주세요.',
  },
};

export const LongText: Story = {
  args: {
    isTitle: true,
    title: '2026년 정규 세션 전반기 만남의 장 – 사전 모임',
  },
};
