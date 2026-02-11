import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { MenuTrigger } from './MenuTrigger';

const meta: Meta<typeof MenuTrigger> = {
  title: 'Shared/UI/Menu/MenuTrigger',
  component: MenuTrigger,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuTrigger>;

export const Default: Story = {
  args: {
    label: '메뉴 열기',
    isOpen: false,
  },
};

export const Opened: Story = {
  args: {
    label: '메뉴 닫기',
    isOpen: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen((prev) => !prev);

    return (
      <MenuTrigger label={isOpen ? '메뉴 닫기' : '메뉴 열기'} isOpen={isOpen} onClick={toggle} />
    );
  },
};
