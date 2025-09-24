import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileImage } from './ProfileImage';

const meta: Meta<typeof ProfileImage> = {
  title: 'Shared/ProfileImage',
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

export const Loading: Story = {
  args: {
    src: 'https://wrong-url.png',
    size: 'l',
    fallback: <div className="bg-background-quaternary h-full w-full animate-pulse" />,
  },
};
