import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileImage } from './ProfileImage';

const meta: Meta<typeof ProfileImage> = {
  title: 'Shared/UI/ProfileImage',
  component: ProfileImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { include: ['size'] },
  },
  argTypes: {
    size: {
      options: ['s', 'm', 'l', 'xl'],
      control: { type: 'radio' },
    },
  },
  args: {
    alt: '프로필 이미지',
    size: 'l',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
