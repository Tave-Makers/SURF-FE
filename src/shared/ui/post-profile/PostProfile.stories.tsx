import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostProfile } from './PostProfile';

const meta: Meta<typeof PostProfile> = {
  title: 'Shared/UI/PostProfile',
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return <PostProfile {...args} />;
  },
  args: {
    nickname: '사용자 이름',
    date: '2023-01-01',
    time: '12:00',
    viewCount: 100,
  },
};
