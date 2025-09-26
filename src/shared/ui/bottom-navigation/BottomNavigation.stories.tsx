import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BottomNavigation } from './BottomNavigation';
import { useState } from 'react';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Shared/UI/BottomNav',
  component: BottomNavigation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('home');

    return (
      <div className="relative h-[400px] w-[20rem]">
        <BottomNavigation
          activeId={activeId}
          onNavigate={(id) => setActiveId(id)} // 클릭하면 상태 변경
        />
      </div>
    );
  },
};
