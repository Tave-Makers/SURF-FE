import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostHeader } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  title: 'Shared/UI/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    category: { control: 'text' },
    subCategory: { control: 'text' },
  },
  args: {
    title: '제목',
    category: '공지사항',
    subCategory: '행사',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* 검색창 */
export const Default: Story = {
  render: (args) => {
    return <PostHeader {...args} />;
  },
  args: {
    title: '제목',
    category: '공지사항',
    subCategory: '행사',
  },
};
