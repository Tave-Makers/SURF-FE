import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar } from '@surf/ui/avatar';
import { MemberCardBase } from './MemberCardBase';
import { RoleBadge } from './RoleBadge';

const meta: Meta<typeof MemberCardBase> = {
  title: 'Entities/UI/Member/MemberCardBase',
  component: MemberCardBase,
  args: {
    name: '테이비',
    tracks: [
      { generation: 15, part: 'DESIGN' },
      { generation: 16, part: 'WEB_FRONTEND' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof MemberCardBase>;

/**
 * 멤버 관리 목록에서 사용하는 형태.
 * Avatar(leftSlot) + RoleBadge(rightSlot).
 */
export const MemberDirectory: Story = {
  args: {
    leftSlot: <Avatar size="s" alt="테이비 프로필 이미지" />,
    rightSlot: <RoleBadge type="PRESIDENT" />,
  },
};
