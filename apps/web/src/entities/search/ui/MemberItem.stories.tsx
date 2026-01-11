import type { Meta, StoryObj } from '@storybook/nextjs';

import { MemberItem } from './MemberItem';
import type { MemberSearchItem } from '../model/types';

const meta: Meta<typeof MemberItem> = {
  title: 'Entities/UI/Search/MemberItem',
  component: MemberItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof MemberItem>;

const mockUser: MemberSearchItem = {
  userId: 1,
  name: '테이브',
  university: '홍익대학교',
  bio: '프론트엔드와 블록체인을 좋아합니다',
  level: 'admin',
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

export const AdminLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'admin',
    },
  },
};

export const PresidentLevel: Story = {
  args: {
    user: {
      ...mockUser,
      level: 'president',
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
