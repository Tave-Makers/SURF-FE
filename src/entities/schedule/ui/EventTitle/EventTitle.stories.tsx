import type { Meta, StoryObj } from '@storybook/nextjs';
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
    placeholder: '제목을 입력해주세요.',
    title: '정규행사',
    onChange: (value: string) => {
      console.log('Title changed to:', value);
    },
  },
};

export const AsPlaceholder: Story = {
  args: {
    placeholder: '제목을 입력해주세요.',
    title: '제목을 입력해주세요.',
    onChange: (value: string) => {
      console.log('Title changed to:', value);
    },
  },
};

export const LongText: Story = {
  args: {
    placeholder: '제목을 입력해주세요.',
    title: '2026년 정규 세션 전반기 만남의 장 – 사전 모임',
    onChange: (value: string) => {
      console.log('Title changed to:', value);
    },
  },
};
