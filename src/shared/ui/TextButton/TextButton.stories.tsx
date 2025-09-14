import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SolidButton from './TextButton';

const meta = {
  title: 'Shared/UI/TextButton',
  component: SolidButton,
  tags: ['autodocs'],
  args: {
    title: '버튼',
    size: 'm',
    variant: 'primary',
    isDisabled: false,
    leftIcon: null,
    rightIcon: null,
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['s', 'm', 'l'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'warning'],
    },
    title: { control: 'text' },
    isDisabled: { control: 'boolean' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
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
export const Warning: Story = { args: { variant: 'warning' } };

// 사이즈 비교
export const Sizes: Story = {
  args: { variant: 'primary' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <SolidButton {...args} size="s" title="Small" />
      <SolidButton {...args} size="m" title="Medium" />
      <SolidButton {...args} size="l" title="Large" />
    </div>
  ),
};

// 아이콘 상태들
export const NoIcons: Story = {
  args: { leftIcon: null, rightIcon: null, title: '아이콘 없음' },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: 'ChevronRight',
    title: '오른쪽 아이콘',
  },
};

export const BothIcons: Story = {
  args: {
    leftIcon: 'Plus',
    rightIcon: 'ChevronRight',
    title: '양쪽 아이콘',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    title: '비활성화',
    leftIcon: 'Plus',
    rightIcon: 'ChevronRight',
  },
};
