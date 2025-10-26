import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostHeader } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  title: 'Shared/UI/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { include: ['size'] },
  },
  argTypes: {
    title: { control: 'text' },
    category: { control: 'text' },
    subCategory: { control: 'text' },
  },
  args: {
    title: '포스트 제목',
    category: '카테고리',
    subCategory: '서브카테고리',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
