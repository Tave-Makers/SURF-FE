import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextButton from './TextButton';

const meta = {
  title: 'Shared/UI/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  args: {
    btnText: '버튼',
    size: 'm',
    variant: 'primary',
    isDisabled: false,
    leftIconName: null,
    rightIconName: null,
    onClick: () => alert('TextButton 클릭!'),
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
    btnText: { control: 'text' },
    isDisabled: { control: 'boolean' },
    leftIconName: { control: 'text' },
    rightIconName: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: '프로젝트 공통 TextButton 입니다.',
      },
    },
  },
} satisfies Meta<typeof TextButton>;

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
      <TextButton {...args} size="s" btnText="Small" />
      <TextButton {...args} size="m" btnText="Medium" />
      <TextButton {...args} size="l" btnText="Large" />
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
