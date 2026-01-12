import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ComponentProps } from 'react';
import { PostHeader } from './PostHeader';

type PostHeaderProps = ComponentProps<typeof PostHeader>;

const meta: Meta<typeof PostHeader> = {
  title: 'Entities/UI/Post/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    category: { control: 'object' },
    subCategory: { control: 'object' },
  },
  args: {
    title: '제목',
    category: { title: '공지사항', href: '/notice' },
    subCategory: { title: '행사', href: '/event' },
  },
};

export default meta;

type Story = StoryObj<typeof PostHeader>;

export const Default: Story = {
  render: (args: PostHeaderProps) => <PostHeader {...args} />,
};
