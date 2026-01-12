import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ComponentProps } from 'react';
import { PostProfile } from './PostProfile';

type PostProfileProps = ComponentProps<typeof PostProfile>;

const meta: Meta<typeof PostProfile> = {
  title: 'Entities/UI/Post/PostProfile',
  component: PostProfile,
  tags: ['autodocs'],
  argTypes: {
    profileImgUrl: { control: 'text' },
    nickname: { control: 'text' },
    date: { control: 'text' },
    time: { control: 'text' },
    viewCount: { control: 'number' },
  },
  args: {
    nickname: '사용자 이름',
    date: '2023-01-01',
    time: '12:00',
    viewCount: 100,
  },
};

export default meta;

type Story = StoryObj<typeof PostProfile>;

export const Default: Story = {
  render: (args: PostProfileProps) => <PostProfile {...args} />,
};
