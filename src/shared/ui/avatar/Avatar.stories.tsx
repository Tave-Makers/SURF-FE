import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Shared/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { include: ['size'] },
  },
  argTypes: {
    size: {
      options: ['xs', 's', 'm', 'l', 'xl'],
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
