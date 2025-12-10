import type { Meta, StoryObj } from '@storybook/nextjs';
import { NotificationItem } from './NotificationItem';

const meta: Meta<typeof NotificationItem> = {
  title: 'Shared/UI/Notification/NotificationItem',
  component: NotificationItem,
  args: {
    userImageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop',
    title: '테이브님이 회원님의 게시글에 댓글을 남겼습니다.',
    time: '2026.10.16 14:30',
    isRead: false,
  },
  argTypes: {
    badge: {
      control: 'radio',
      options: ['LIKE', 'MENTION'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const LikeNotification: Story = {
  args: {
    badge: 'LIKE',
    title: '민지가 회원님의 게시글을 좋아합니다',
  },
};

export const MentionNotification: Story = {
  args: {
    badge: 'MENTION',
    title: '정우님이 회원님을 언급했습니다',
  },
};

export const ReadNotification: Story = {
  args: {
    isRead: true,
    badge: 'LIKE',
    title: '읽은 알림입니다',
  },
};

export const NonImageNotification: Story = {
  args: {
    title: '새로운 공지사항이 있습니다',
  },
};
