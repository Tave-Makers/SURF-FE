import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppNavigation } from './AppNavigation';

const meta: Meta<typeof AppNavigation> = {
  title: 'Widgets/UI/BottomNavigation',
  component: AppNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AppNavigation>;

export const Default: Story = {
  render: () => {
    return <AppNavigation />;
  },
};
