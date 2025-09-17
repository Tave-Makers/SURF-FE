import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BottomNavigation } from './BottomNavigation';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Shared/UI/BottomNav',
  component: BottomNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[400px] w-[20rem]">
      <BottomNavigation />
    </div>
  ),
};
