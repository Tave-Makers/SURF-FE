import type { Meta, StoryObj } from '@storybook/nextjs';
import { MenuItem } from './MenuItem';

const meta: Meta<typeof MenuItem> = {
  title: 'Shared/UI/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="items-center justify-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: '메뉴 아이템의 텍스트입니다.' },
    isSelected: { control: 'boolean', description: '선택된 상태인지 여부입니다.' },
    onClick: { action: 'clicked', description: 'MenuItem 클릭 이벤트를 처리합니다.' },
  },
  args: {
    label: '기본 텍스트',
    isSelected: false,
  },
};
export default meta;

type Story = StoryObj<typeof MenuItem>;

export const Standard: Story = {};

export const Selected: Story = {
  args: {
    label: '선택된 아이템',
    isSelected: true,
  },
};
