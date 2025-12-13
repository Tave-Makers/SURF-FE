import type { Meta, StoryObj } from '@storybook/nextjs';
import { BottomNavigation } from './BottomNavigation';
import { useState } from 'react';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Shared/UI/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('home');

    return (
      <BottomNavigation
        activeId={activeId}
        onNavigate={(id) => setActiveId(id)} // 클릭하면 상태 변경
      />
    );
  },
};
