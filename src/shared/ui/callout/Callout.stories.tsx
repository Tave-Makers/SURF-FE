import type { Meta, StoryObj } from '@storybook/nextjs';
import { Callout } from './Callout';

const meta: Meta<typeof Callout> = {
  title: 'Shared/UI/Callout',
  component: Callout,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  args: {
    userImage: '',
    userName: '',
  },
};

export const Interactive: Story = {
  args: {
    userImage: '',
    userName: '홍길동',
  },
};
