import type { Meta, StoryObj } from '@storybook/nextjs';
import { NotificationList } from './NotificationList';
import { NotificationItemProps } from './NotificationItem';

const meta: Meta<typeof NotificationList> = {
  title: 'Shared/UI/Notification/NotificationList',
  component: NotificationList,
};

export default meta;
type Story = StoryObj<typeof NotificationList>;

const mockData: NotificationItemProps[] = [
  {
    userImageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop',
    title: '민지가 회원님의 게시글을 좋아합니다',
    time: '3분 전',
    badge: 'LIKE',
    isRead: false,
  },
  {
    userImageUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
    title: '정우님이 댓글에서 회원님을 언급했습니다',
    time: '10분 전',
    badge: 'MENTION',
    isRead: true,
  },
  {
    title: '새로운 공지사항이 있습니다',
    time: '1시간 전',
    isRead: false,
  },
];

export const Default: Story = {
  args: {
    items: mockData,
  },
};
