import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventCard } from '../EventCard';

const meta: Meta<typeof EventCard> = {
  title: 'Entities/UI/Calendar/EventCard',
  component: EventCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '이벤트 제목',
    },
    type: {
      control: 'radio',
      options: ['official', 'operation', 'other'],
      description: '이벤트 태그의 종류',
    },
    mode: {
      control: 'radio',
      options: ['closeBtn', 'varogaggi', 'normal'],
      description: '이벤트 카드의 모드',
    },
    startDate: {
      control: 'date',
      description: '이벤트 시작일 (참고: 현재 컴포넌트 UI는 "미정"으로 표시됩니다)',
    },
    endDate: {
      control: 'date',
      description: '이벤트 종료일 (참고: 현재 컴포넌트 UI는 "미정"으로 표시됩니다)',
    },
    place: {
      control: 'text',
      description: '이벤트 장소',
    },
  },
  args: {
    title: '후반기 만남의 장',
    type: 'official',
    mode: 'normal',
    // 날짜 임시값
    startDate: new Date(),
    endDate: new Date(),
    place: '서울 강남구 어딘가',
  },
};
export default meta;
type Story = StoryObj<typeof EventCard>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────

/**
 * 'official' 타입 이벤트 카드
 */
export const OfficialEvent: Story = {
  args: {},
};

/**
 * 'operation' 타입 이벤트 카드
 */
export const OperationEvent: Story = {
  args: {
    title: '운영진 정기 회의',
    type: 'operation',
    place: '온라인 (Zoom)',
  },
};

/**
 * 'other' 타입 이벤트 카드
 */
export const OtherEvent: Story = {
  args: {
    title: 'UX/UI 스터디 모임',
    type: 'other',
    place: '성수동 카페',
  },
};

/**
 * 제목과 장소 텍스트가 길어질 경우 테스트 카드
 */
export const LongText: Story = {
  args: {
    title: '11월 전체 정기 회의 및 하반기 활동 보고의 건입니다. 모두 참석해주세요.',
    type: 'official',
    place: '서울특별시 강남구 테헤란로 123, 위워크 빌딩 10층 컨퍼런스룸 A',
  },
};
