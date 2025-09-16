import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'shared/ui/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    id: 'toggle-default',
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Controlled 모드에서 토글 상태',
    },
    isDefaultChecked: {
      control: 'boolean',
      description: 'Uncontrolled 초기값',
    },
    isDisabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    label: {
      control: 'text',
      description: '옆에 표시할 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: '기본 토글',
  },
};

export const Checked: Story = {
  args: {
    label: '체크된 토글',
    isChecked: true,
  },
};

export const Uncontrolled: Story = {
  args: {
    label: 'Uncontrolled 초기 체크',
    isDefaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화 토글',
    isDisabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    isDefaultChecked: false,
  },
};
