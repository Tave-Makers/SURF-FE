import type { Meta, StoryObj } from '@storybook/nextjs';
import { GroupMemberSection, type GroupManagementMode } from './GroupMemberSection';
import { MemberBase, MemberTrack } from '@/entities/member/model/types';

const tracks = [{ generation: 15, part: 'DESIGN' }] as MemberTrack[];

const leader = {
  id: 1,
  name: '테이버',
  profileImageUrl: '',
  tracks,
} as MemberBase;

const members = [
  { id: 2, name: '테이버', profileImageUrl: '', tracks },
  { id: 3, name: '테이버', profileImageUrl: '', tracks },
  { id: 4, name: '테이버', profileImageUrl: '', tracks },
  { id: 5, name: '테이버', profileImageUrl: '', tracks },
] as MemberBase[];

const meta: Meta<typeof GroupMemberSection> = {
  title: 'features/ui/group-management/GroupMemberSection',
  component: GroupMemberSection,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['view', 'edit', 'create'] satisfies GroupManagementMode[],
    },
    teamLeader: { control: false },
    teamMembers: { control: false },
    onPickLeader: { action: 'pickLeader' },
    onAddMembers: { action: 'addMembers' },
    onRemoveMember: { action: 'removeMember' },
  },
  args: {
    mode: 'view',
    teamLeader: leader,
    teamMembers: members,
  },
};

export default meta;
type Story = StoryObj<typeof GroupMemberSection>;

/** 조회 - 팀장/팀원 존재 */
export const ViewFilled: Story = {
  args: {
    mode: 'view',
    teamLeader: leader,
    teamMembers: members,
  },
};

/** 조회 - 팀장/팀원 없음 */
export const ViewEmpty: Story = {
  args: {
    mode: 'view',
    teamLeader: undefined,
    teamMembers: [],
  },
};

/** 수정 - 팀장/팀원 존재 (삭제 아이콘 + 하단 추가하기) */
export const EditFilled: Story = {
  args: {
    mode: 'edit',
    teamLeader: leader,
    teamMembers: members,
  },
};

/** 수정 - 팀장 없음(선택하기), 팀원 없음(추가하기) */
export const EditEmpty: Story = {
  args: {
    mode: 'edit',
    teamLeader: undefined,
    teamMembers: [],
  },
};

/** 생성 - 팀장 없음(선택하기), 팀원 있음(삭제 + 하단 추가하기) */
export const CreateLeaderEmptyMembersFilled: Story = {
  args: {
    mode: 'create',
    teamLeader: undefined,
    teamMembers: members,
  },
};

/** 생성 - 팀장/팀원 모두 없음 */
export const CreateEmpty: Story = {
  args: {
    mode: 'create',
    teamLeader: undefined,
    teamMembers: [],
  },
};
