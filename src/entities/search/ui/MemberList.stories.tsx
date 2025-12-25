import type { Meta, StoryObj } from '@storybook/nextjs';

import { MemberList } from './MemberList';
import type { MemberSearchItem } from '../model/types';

const meta: Meta<typeof MemberList> = {
  title: 'Entities/UI/Search/MemberList',
  component: MemberList,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof MemberList>;

const mockMembers: MemberSearchItem[] = [
  {
    userId: 1,
    name: '테이브',
    bio: '프론트엔드와 블록체인을 좋아합니다',
    level: 'superManager',
    chips: ['15기 디자인', '15기 프론트엔드'],
    avatarUrl: null,
  },
  {
    userId: 2,
    name: '짱구',
    bio: '디자인 시스템에 관심이 많아요',
    level: 'executiveManager',
    chips: ['15기 디자인', '15기 백엔드'],
    avatarUrl: null,
  },
  {
    userId: 3,
    name: '도라에몽',
    bio: null,
    level: 'manager',
    chips: ['15기 프론트엔드', '15기 백엔드'],
    avatarUrl: null,
  },
  {
    userId: 4,
    name: '스펀지밥',
    bio: null,
    level: 'member',
    chips: ['15기 딥러닝', '15기 데이터분석'],
    avatarUrl: null,
  },
];

export const Default: Story = {
  args: {
    members: mockMembers,
  },
};

export const SingleMember: Story = {
  args: {
    members: [mockMembers[0]],
  },
};

export const NoBioMembers: Story = {
  args: {
    members: mockMembers.map((m) => ({
      ...m,
      bio: null,
    })),
  },
};

export const ManyChips: Story = {
  args: {
    members: [
      {
        ...mockMembers[0],
        chips: ['15기 프론트엔드', '15기 백엔드', '15기 디자인', '15기 데이터분석', '15기 딥러닝'],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    members: [],
  },
};
