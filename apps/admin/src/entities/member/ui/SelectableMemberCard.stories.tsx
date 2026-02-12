import type { Meta, StoryObj } from '@storybook/nextjs';
import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { MemberStatusBadge } from './MemberStatusBadge';
import { RoleBadge } from './RoleBadge';
import { SelectableMemberCard } from './SelectableMemberCard';

const meta: Meta<typeof SelectableMemberCard> = {
  title: 'Entities/UI/Member/SelectableMemberCard',
  component: SelectableMemberCard,
  args: {
    name: '테이비',
    tracks: [
      { generation: 15, part: 'DESIGN' },
      { generation: 16, part: 'WEB_FRONTEND' },
    ],
    isSelectionEnabled: true,
    checked: false,
    onToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SelectableMemberCard>;

/**
 * 가입 신청 목록에서 사용하는 형태.
 * registeredAt + MemberStatusBadge(rightSlot) + 상세보기 버튼.
 */
export const SignupRequest: Story = {
  args: {
    registeredAt: '25.12.31 16:32',
    rightSlot: (
      <>
        <MemberStatusBadge status="waiting" />
        <SurfIcon name="ChevronRight" />
      </>
    ),
  },
};

/**
 * 회원 그룹 관리 - 팀원 설정 화면에서 사용하는 형태.
 * Avatar(leftSlot) + RoleBadge(rightSlot).
 */
export const GeneralMember: Story = {
  args: {
    leftSlot: <Avatar size="s" alt="테이비 프로필 이미지" />,
    rightSlot: <RoleBadge type="PRESIDENT" />,
  },
};
