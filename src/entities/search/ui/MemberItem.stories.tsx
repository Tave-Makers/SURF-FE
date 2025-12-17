import type { Meta, StoryObj } from '@storybook/nextjs';

import { MemberItem } from './MemberItem';
import type { MemberItemUser } from '../model/types';

const meta: Meta<typeof MemberItem> = {
  title: 'Entities/UI/Notification/MemberItem',
  component: MemberItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof MemberItem>;

const mockUser: MemberItemUser = {
  userId: 1,
  name: '테이브',
  bio: '프론트엔드와 블록체인을 좋아합니다',
  level: 'superManager',
  chips: ['15기 프론트엔드', '15기 디자인'],
  avatarUrl: null,
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const NoBio: Story = {
  args: {
    user: {
      ...mockUser,
      bio: null,
    },
  },
};

export const ManyChips: Story = {
  args: {
    user: {
      ...mockUser,
      chips: ['15기 프론트엔드', '15기 디자인', '15기 백엔드', '15기 데이터분석', '15기 딥러닝'],
    },
  },
};

export const SuperManagerLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'superManager',
    },
  },
};

export const ExcecutiveManagerLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'executiveManager',
    },
  },
};

export const ManagerLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'manager',
    },
  },
};

export const MemberLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'member',
    },
  },
};

export const NoChips: Story = {
  args: {
    user: {
      ...mockUser,
      chips: [],
    },
  },
};
