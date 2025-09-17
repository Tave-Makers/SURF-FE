import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Alert from './Alert';

const meta = {
  title: 'Shared/UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    state: 'default',
    title: '제목입니다',
    infoText: '부가 설명 텍스트가 들어갑니다.',
    hasTwoBtn: true,
    rightBtnText: '확인',
    leftBtnText: '취소',
    rightSolidButtonVariant: 'primary',
    leftSolidButtonVariant: 'secondary',
    textButtonVariant: 'primary',
  },
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: ['default', 'error'],
      description: '알림 상태',
    },
    title: { control: 'text', description: '제목' },
    infoText: { control: 'text', description: '설명 텍스트' },
    hasTwoBtn: {
      control: 'boolean',
      description: '좌/우 두 개 버튼 표시 (error 상태에서는 내부 로직상 무시됨)',
    },
    rightBtnText: { control: 'text', description: '오른쪽(확인) 버튼 라벨' },
    leftBtnText: { control: 'text', description: '왼쪽(취소) 버튼 라벨' },

    rightSolidButtonVariant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'danger', 'warning'],
      description: '오른쪽 SolidButton variant',
    },
    leftSolidButtonVariant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'danger', 'warning'],
      description: '왼쪽 SolidButton variant',
    },
    textButtonVariant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'warning'],
      description: 'error 상태에서 사용하는 TextButton variant',
    },

    onRightBtnClick: { action: 'right clicked', description: '오른쪽 버튼 클릭' },
    onLeftBtnClick: { action: 'left clicked', description: '왼쪽 버튼 클릭' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTwoButtons: Story = {
  name: 'Default/TwoButtons',
  args: {
    state: 'default',
    hasTwoBtn: true,
    title: '로그아웃 하시겠어요?',
    infoText: '진행 중인 작업이 저장되지 않을 수 있어요.',
    leftBtnText: '취소',
    rightBtnText: '로그아웃',
    leftSolidButtonVariant: 'secondary',
    rightSolidButtonVariant: 'primary',
  },
};

export const OneButton: Story = {
  name: 'Default/One Button',
  args: {
    state: 'default',
    hasTwoBtn: false,
    title: '설정이 저장되었습니다',
    infoText: '변경 사항이 정상적으로 반영되었어요.',
    rightBtnText: '확인',
    rightSolidButtonVariant: 'primary',
  },
};

export const Error: Story = {
  name: 'ErrorState/One Button',
  args: {
    state: 'error',
    // 컴포넌트 내부에서 hasTwoBtn은 false로 처리됨
    title: '문제가 발생했어요',
    infoText: '네트워크 상태를 확인한 뒤 다시 시도해 주세요.',
    rightBtnText: '확인',
    textButtonVariant: 'primary',
  },
};

export const CustomSolidVariants: Story = {
  name: 'CustomSolidVariants',
  args: {
    state: 'default',
    hasTwoBtn: true,
    title: '영구 삭제하시겠어요?',
    infoText: '이 작업은 되돌릴 수 없습니다.',
    leftBtnText: '취소',
    rightBtnText: '삭제',
    leftSolidButtonVariant: 'secondary',
    rightSolidButtonVariant: 'danger',
  },
};

export const LongText: Story = {
  name: 'LongText/TwoButtons',
  args: {
    state: 'default',
    hasTwoBtn: true,
    title: '이 작업을 진행하시겠습니까? 되돌릴 수 없습니다.',
    infoText:
      '진행 시 현재 계정과 연결된 모든 데이터가 삭제되며, 향후 복구가 불가능합니다. 반드시 백업을 완료했는지 확인해 주세요. 예상 소요 시간은 1~3분입니다.',
    leftBtnText: '취소',
    rightBtnText: '진행',
    leftSolidButtonVariant: 'secondary',
    rightSolidButtonVariant: 'primary',
  },
};
