import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostProfile } from './PostProfile';

const meta: Meta<typeof PostProfile> = {
  title: 'Entities/UI/Post/PostProfile',
  component: PostProfile,
  tags: ['autodocs'],
  argTypes: {
    memberId: { control: 'number' },
    profileImgUrl: { control: 'text' },
    nickname: { control: 'text' },
    date: { control: 'text' },
    time: { control: 'text' },
    viewCount: { control: 'number' },
  },
  args: {
    memberId: 1,
    nickname: '사용자 이름',
    date: '2023-01-01',
    time: '12:00',
    viewCount: 100,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Withdrawn: Story = {
  args: {
    memberId: null,
    nickname: '탈퇴한 사용자',
    profileImgUrl: undefined,
  },
};
