import type { Meta, StoryObj } from '@storybook/nextjs';
import { Alert } from './Alert';

const meta = {
  title: 'Shared/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: ['default', 'error'],
      description: '알림 상태',
    },
    title: { control: 'text', description: '제목' },
    infoText: { control: 'text', description: '설명 텍스트' },
    actions: { table: { disable: true } },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTwoButtons: Story = {
  name: 'Default/Two Buttons',
  args: {
    state: 'default',
    title: '로그아웃 하시겠어요?',
    infoText: '진행 중인 작업이 저장되지 않을 수 있어요.',
    actions: [
      { type: 'solid', label: '취소', variant: 'secondary', onClick: () => console.log('cancel') },
      { type: 'solid', label: '로그아웃', variant: 'primary', onClick: () => alert('confirm') },
    ],
    isOpen: true,
    onClose: () => alert('모달 닫기'),
  },
};

export const OneButton: Story = {
  name: 'Default/One Button',
  args: {
    state: 'default',
    title: '설정이 저장되었습니다',
    infoText: '변경 사항이 정상적으로 반영되었어요.',
    actions: [{ type: 'solid', label: '확인', variant: 'primary', onClick: () => alert('ok') }],
    isOpen: true,
    onClose: () => alert('모달 닫기'),
  },
};

export const ErrorState: Story = {
  name: 'ErrorState/One Button',
  args: {
    state: 'error',
    title: '문제가 발생했어요',
    infoText: '네트워크 상태를 확인한 뒤 다시 시도해 주세요.',
    actions: [{ type: 'text', label: '확인', variant: 'primary', onClick: () => alert('ack') }],
    isOpen: true,
    onClose: () => alert('모달 닫기'),
  },
};

export const CustomSolidVariants: Story = {
  name: 'CustomSolidVariants',
  args: {
    state: 'default',
    title: '영구 삭제하시겠어요?',
    infoText: '이 작업은 되돌릴 수 없습니다.',
    actions: [
      { type: 'solid', label: '취소', variant: 'secondary', onClick: () => console.log('cancel') },
      { type: 'solid', label: '삭제', variant: 'danger', onClick: () => alert('delete') },
    ],
    isOpen: true,
    onClose: () => alert('모달 닫기'),
  },
};

export const LongText: Story = {
  name: 'LongText/TwoButtons',
  args: {
    state: 'default',
    title: '이 작업을 진행하시겠습니까? 되돌릴 수 없습니다.',
    infoText:
      '진행 시 현재 계정과 연결된 모든 데이터가 삭제되며, 향후 복구가 불가능합니다. 반드시 백업을 완료했는지 확인해 주세요. 예상 소요 시간은 1~3분입니다.',
    actions: [
      { type: 'solid', label: '취소', variant: 'secondary', onClick: () => console.log('cancel') },
      { type: 'solid', label: '진행', variant: 'primary', onClick: () => alert('proceed') },
    ],
    isOpen: true,
    onClose: () => alert('모달 닫기'),
  },
};
