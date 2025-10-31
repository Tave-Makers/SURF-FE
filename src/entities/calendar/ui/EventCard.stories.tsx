import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventCard } from './EventCard';

const meta: Meta<typeof EventCard> = {
  title: 'Entities/UI/Calendar/EventCard',
  component: EventCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // 컴포넌트 props를 Storybook 컨트롤 패널에서 제어할 수 있도록 설정
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
  // 모든 스토리에 공통으로 적용될 기본 props
  // EventCard 컴포넌트 내부의 기본값과 일치시켰습니다.
  args: {
    title: '후반기 만남의 장',
    type: 'official',
    // 날짜 prop은 Date 객체여야 하므로 임의의 값을 넣어줍니다.
    startDate: new Date('2025-11-20T10:00:00'),
    endDate: new Date('2025-11-21T18:00:00'),
    place: '서울 강남구 어딘가',
  },
};
export default meta;
type Story = StoryObj<typeof EventCard>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────

/**
 * 가장 기본적인 'official' 타입의 이벤트 카드입니다.
 */
export const Primary: Story = {
  args: {
    // meta.args에서 기본값을 상속받습니다.
  },
};

/**
 * 'operation' (운영) 타입의 이벤트 카드입니다.
 */
export const OperationEvent: Story = {
  args: {
    title: '운영진 정기 회의',
    type: 'operation',
    place: '온라인 (Zoom)',
  },
};

/**
 * 'other' (기타) 타입의 이벤트 카드입니다.
 */
export const OtherEvent: Story = {
  args: {
    title: 'UX/UI 스터디 모임',
    type: 'other',
    place: '성수동 카페',
  },
};

/**
 * 제목과 장소 텍스트가 길어질 경우를 테스트하는 카드입니다.
 */
export const LongText: Story = {
  args: {
    title: '11월 전체 정기 회의 및 하반기 활동 보고의 건입니다. 모두 참석해주세요.',
    type: 'official',
    place: '서울특별시 강남구 테헤란로 123, 위워크 빌딩 10층 컨퍼런스룸 A',
  },
};

// ───────────────────────────────
// 인터랙티브 상태
// ───────────────────────────────

// (참고: hover, active 등 의사 상태(pseudo-state)를 테스트하려면
// storybook-addon-pseudo-states 애드온이 필요할 수 있습니다.)
//
// export const Hovered: Story = {
//   parameters: {
//     pseudo: { hover: true },
//   },
// };
