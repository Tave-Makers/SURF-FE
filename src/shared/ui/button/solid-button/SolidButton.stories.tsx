import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SolidButton } from './SolidButton';

const meta = {
  title: 'Shared/UI/Button/SolidButton',
  component: SolidButton,
  tags: ['autodocs'],
  args: {
    size: 'm',
    variant: 'primary',
    isDisabled: false,
    leftIconName: null,
    rightIconName: null,
    children: '버튼',
    type: 'button',
    onClick: () => alert('SolidButton 클릭!'),
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['s', 'm', 'l'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger', 'warning'],
    },
    children: { control: 'text' },
    isDisabled: { control: 'boolean' },
    leftIconName: { control: false },
    rightIconName: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: '프로젝트 공통 SolidButton 입니다.',
      },
    },
  },
} satisfies Meta<typeof SolidButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Warning: Story = { args: { variant: 'warning' } };

// 사이즈 비교
export const Sizes: Story = {
  args: { variant: 'primary' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <SolidButton {...args} size="s">
        Small
      </SolidButton>
      <SolidButton {...args} size="m">
        Medium
      </SolidButton>
      <SolidButton {...args} size="l">
        Large
      </SolidButton>
    </div>
  ),
};

// 아이콘 상태들 비교
export const NoIcons: Story = {
  args: { leftIconName: null, rightIconName: null, children: '아이콘 없음' },
};

export const WithRightIcon: Story = {
  args: {
    rightIconName: 'ChevronRight',
    children: '오른쪽 아이콘',
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIconName: 'Plus',
    children: '왼쪽 아이콘',
  },
};

export const BothIcons: Story = {
  args: {
    leftIconName: 'Plus',
    rightIconName: 'ChevronRight',
    children: '양쪽 아이콘',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: '비활성화',
    leftIconName: 'Plus',
    rightIconName: 'ChevronRight',
  },
};
