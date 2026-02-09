import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar } from '@surf/ui/avatar';
import { MemberCard } from './MemberCard';
import { MemberStatusBadge } from './MemberStatusBadge';
import { RoleBadge } from './RoleBadge';

const meta: Meta<typeof MemberCard> = {
  title: 'Entities/UI/Member/MemberCard',
  component: MemberCard,
  args: {
    name: '테이비',
    tracks: [
      { generation: 15, part: 'DESIGN' },
      { generation: 16, part: 'WEB_FRONTEND' },
    ],
    checked: false,
  },
};

export default meta;
type Story = StoryObj<typeof MemberCard>;

/**
 * 멤버 관리 목록에서 사용하는 형태.
 * Avatar(leftAddon) + RoleBadge(rightSlot) + 상세보기 버튼.
 */
export const MemberDirectory: Story = {
  args: {
    leftAddon: <Avatar size="s" alt="테이비 프로필 이미지" />,
    rightSlot: <RoleBadge type="PRESIDENT" />,
    onClick: () => {
      console.log('상세보기');
    },
  },
};

/**
 * 가입 신청 목록에서 사용하는 형태.
 * registeredAt + RequestStatusBadge(rightSlot) + 상세보기 버튼.
 */
export const SignupRequest: Story = {
  args: {
    registeredAt: '25.12.31 16:32',
    rightSlot: <MemberStatusBadge status="waiting" />,
    onClick: () => {
      console.log('상세보기');
    },
  },
};

/**
 * 회원 그룹 관리 - 팀원 설정 화면에서 사용하는 형태
 * Avatar(leftAddon) + Name + Track
 */
export const GeneralMember: Story = {
  args: {
    isSelectionEnabled: true,
    leftAddon: <Avatar size="s" alt="테이비 프로필 이미지" />,
  },
};
