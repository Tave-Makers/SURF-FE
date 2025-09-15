import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ControlRadio } from './ControlRadio';

// 반드시 default export 필요
const meta: Meta<typeof ControlRadio> = {
  title: 'shared/ui/control/ControlRadio', // 좌측 네비게이션 경로
  component: ControlRadio,
  tags: ['autodocs'], // Docs 탭 자동 생성
};

export default meta;

type Story = StoryObj<typeof ControlRadio>;

// named export로 스토리 정의
export const Default: Story = {
  args: {
    id: 'radio-default',
    name: 'example',
    value: 'one',
    label: 'Option One',
    isChecked: false,
  },
};

export const Checked: Story = {
  args: {
    id: 'radio-checked',
    name: 'example',
    value: 'two',
    label: 'Option Two',
    isChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'radio-disabled',
    name: 'example',
    value: 'three',
    label: 'Option Three',
    isDisabled: true,
  },
};
