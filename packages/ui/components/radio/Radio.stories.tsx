import type { Meta, StoryObj } from '@storybook/nextjs';
import { Radio } from './Radio';

// 반드시 default export 필요
const meta: Meta<typeof Radio> = {
  title: 'Shared/UI/Radio', // 좌측 네비게이션 경로
  component: Radio,
  tags: ['autodocs'], // Docs 탭 자동 생성
};

export default meta;

type Story = StoryObj<typeof Radio>;

// named export로 스토리 정의
export const Default: Story = {
  args: {
    id: 'radio-default',
    name: 'example-default',
    value: 'one',
    label: 'Option One',
  },
};

export const Checked: Story = {
  args: {
    id: 'radio-checked',
    name: 'example-checked',
    value: 'two',
    label: 'Option Two',
    isDefaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'radio-disabled',
    name: 'example-disabled',
    value: 'three',
    label: 'Option Three',
    isDisabled: true,
  },
};
