import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WheelPicker } from './WheelPicker';

const meta: Meta<typeof WheelPicker> = {
  title: 'Shared/UI/WheelPicker',
  component: WheelPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WheelPicker>;

export const Default: Story = {
  args: {},
};
