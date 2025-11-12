import type { Meta, StoryObj } from '@storybook/nextjs';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Shared/UI/Chip',
  component: Chip,
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: '13기 데이터 분석',
  },
};
