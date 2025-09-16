import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SolidButton from './SolidButton';

const meta = {
  title: 'Shared/UI/SolidButton',
  component: SolidButton,
  tags: ['autodocs'],
  args: {
    btnText: '버튼',
    size: 'm',
    variant: 'primary',
    isDisabled: false,
    leftIconName: null,
    rightIconName: null,
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
    btnText: { control: 'text' },
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
      <SolidButton {...args} size="s" btnText="Small" />
      <SolidButton {...args} size="m" btnText="Medium" />
      <SolidButton {...args} size="l" btnText="Large" />
    </div>
  ),
};

// 아이콘 상태들 비교
export const NoIcons: Story = {
  args: { leftIconName: null, rightIconName: null, btnText: '아이콘 없음' },
};

export const WithRightIcon: Story = {
  args: {
    rightIconName: 'ChevronRight',
    btnText: '오른쪽 아이콘',
  },
};

export const BothIcons: Story = {
  args: {
    leftIconName: 'Plus',
    rightIconName: 'ChevronRight',
    btnText: '양쪽 아이콘',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    btnText: '비활성화',
    leftIconName: 'Plus',
    rightIconName: 'ChevronRight',
  },
};
