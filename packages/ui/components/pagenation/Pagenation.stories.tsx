import type { Meta, StoryObj } from '@storybook/nextjs';
import { Pagenation } from './Pagenation';

const meta: Meta<typeof Pagenation> = {
  title: 'Shared/UI/Pagenation',
  component: Pagenation,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number' },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number' },
      description: '전체 페이지 수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagenation>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const MidPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};
