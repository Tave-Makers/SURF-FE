import type { Meta, StoryObj } from '@storybook/nextjs';
import { MenuTrigger } from './MenuTrigger';
import { usePicker } from '@/shared/hooks/usePicker';

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
  args: {
    label: 'Click Me',
    isOpen: false,
  },
  render: () => {
    const { isOpen, toggle } = usePicker();

    return <MenuTrigger label="메뉴열기" isOpen={isOpen} onClick={toggle} />;
  },
};
