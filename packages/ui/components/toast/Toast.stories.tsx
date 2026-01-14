import type { Meta, StoryObj } from '@storybook/nextjs';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Shared/UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: {
      control: 'text',
      description: '토스트에 표시될 문구',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    text: '성공했습니다',
  },
};

export const LongText: Story = {
  args: {
    text: '저장이 완료되었습니다. 변경 사항이 정상적으로 반영되었습니다.',
  },
};
