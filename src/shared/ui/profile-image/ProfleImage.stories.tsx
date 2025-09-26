import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileImage } from './ProfileImage';

const meta: Meta<typeof ProfileImage> = {
  title: 'Shared/UI/ProfileImage',
  component: ProfileImage,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ProfileImage>;

export const Default: Story = {
  args: {
    size: 'l',
  },
};
