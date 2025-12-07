import type { Meta, StoryObj } from '@storybook/nextjs';
import { InfoBadge } from './InfoBadge';

const meta: Meta<typeof InfoBadge> = {
  title: 'Shared/UI/InfoBadge',
  component: InfoBadge,
};

export default meta;
type Story = StoryObj<typeof InfoBadge>;

export const Default: Story = {
  args: {
    children: '13기 데이터 분석',
  },
};

export const MultipleBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <InfoBadge>13기 데이터 분석</InfoBadge>
      <InfoBadge>14기 디자인</InfoBadge>
      <InfoBadge>+2</InfoBadge>
    </div>
  ),
};
