import type { Meta, StoryObj } from '@storybook/nextjs';
import { MemberTrack } from '@/entities/member/model/types';
import { RemovableMemberCard } from '@/entities/member/ui/RemovableMemberCard/RemovableMemberCard';

const sampleTracks = [
  { generation: 12, part: 'WEB_FRONTEND' },
  { generation: 12, part: 'DESIGN' },
] as MemberTrack[];

const meta: Meta<typeof RemovableMemberCard> = {
  title: 'entities/ui/member/RemovableMemberCard',
  component: RemovableMemberCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    id: { control: { type: 'number' } },
    name: { control: { type: 'text' } },
    profileImageUrl: { control: { type: 'text' } },
    tracks: { control: false }, // 복잡하면 control 끄는 게 편함
    isRemovalEnabled: { control: { type: 'boolean' } },
    onRemoveMember: { action: 'removeMember' }, // Storybook Actions
  },
  args: {
    id: 1,
    name: '테이비',
    profileImageUrl: '',
    tracks: sampleTracks,
    isRemovalEnabled: true,
  },
};

export default meta;

type Story = StoryObj<typeof RemovableMemberCard>;

export const Default: Story = {};

export const RemovalDisabled: Story = {
  args: {
    isRemovalEnabled: false,
  },
};
