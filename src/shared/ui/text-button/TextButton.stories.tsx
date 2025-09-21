import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextButton from './TextButton';

const meta = {
  title: 'Shared/UI/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  args: {
    size: 'm',
    variant: 'primary',
    disabled: false,
    leftIconName: null,
    rightIconName: null,
    children: '버튼',
    type: 'button',
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
    children: { control: 'text' },
    disabled: { control: 'boolean' },
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
      <TextButton {...args} size="s">
        Small
      </TextButton>
      <TextButton {...args} size="m">
        Medium
      </TextButton>
      <TextButton {...args} size="l">
        Large
      </TextButton>
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
    disabled: true,
    children: '비활성화',
    leftIconName: 'Plus',
    rightIconName: 'ChevronRight',
  },
};
