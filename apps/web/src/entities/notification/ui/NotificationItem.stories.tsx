import type { Meta, StoryObj } from '@storybook/nextjs';
import { NotificationItem, NOTIFICATION_BADGE } from './NotificationItem';

const meta: Meta<typeof NotificationItem> = {
  title: 'Entities/UI/Notification/NotificationItem',
  component: NotificationItem,
  args: {
    userImageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop',
    title: '테이브님이 회원님의 게시글에 댓글을 남겼습니다.',
    time: new Date('2025-01-15T09:30:00Z'),
    isRead: false,
  },
  argTypes: {
    badge: {
      control: 'radio',
      options: ['LIKE', 'MENTION'] as NOTIFICATION_BADGE[],
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
