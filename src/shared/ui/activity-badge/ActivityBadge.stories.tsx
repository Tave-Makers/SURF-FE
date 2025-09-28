import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActivityBadge } from './ActivityBadge';

const meta: Meta<typeof ActivityBadge> = {
  title: 'Shared/UI/ActivityBadge',
  component: ActivityBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badgeName: '출석왕',
    timestamp: '2025-09-18',
  },
};

export const Loading: Story = {
  args: {
    badgeName: '출석왕',
    loading: true,
  },
};

export const Many: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <ActivityBadge badgeName="출석왕" timestamp="2025-09-18" />
      <ActivityBadge badgeName="열정러" timestamp="2025-08-02" />
      <ActivityBadge badgeName="베스트답변" timestamp="2025-07-15" />
      <ActivityBadge badgeName="기여자" timestamp="2025-05-30" />
      <ActivityBadge badgeName="스타터" timestamp="2025-03-10" />
      <ActivityBadge badgeName="챌린저" timestamp="2025-01-01" />
    </div>
  ),
};
