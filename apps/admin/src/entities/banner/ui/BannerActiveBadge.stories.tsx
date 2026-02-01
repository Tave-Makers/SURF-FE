import type { Meta, StoryObj } from '@storybook/nextjs';
import { BannerActiveBadge } from './BannerActiveBadge';

const meta: Meta<typeof BannerActiveBadge> = {
  title: 'Entities/Ui/Banner/BannerActiveBadge',
  component: BannerActiveBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isActive: {
      control: 'boolean',
      description: '배지 활성 여부',
    },
  },
};

export default meta;

type Story = StoryObj<typeof BannerActiveBadge>;

export const Active: Story = {
  args: {
    isActive: true,
  },
  parameters: {
    controls: { exclude: ['isActive'] },
  },
};

export const Inactive: Story = {
  args: {
    isActive: false,
  },
  parameters: {
    controls: { exclude: ['isActive'] },
  },
};

export const Playground: Story = {
  args: {
    isActive: true,
  },
};
