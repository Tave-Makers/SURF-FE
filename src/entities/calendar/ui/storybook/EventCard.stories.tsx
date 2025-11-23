import type { Meta, StoryObj } from '@storybook/nextjs';
import { EventCard } from '../EventCard';
import type { ActivityType, EventCardType } from '../../model/types';

// 더미 데이터
const SAMPLE_START_DATE = new Date('2025-11-08T14:00:00');
const SAMPLE_END_DATE = new Date('2025-11-08T18:00:00');

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
      options: ['official', 'operation', 'other'] as ActivityType[],
      description: '이벤트 태그의 종류',
    },
    mode: {
      control: 'radio',
      options: ['reservation', 'calendar'] as EventCardType[],
      description: '이벤트 카드의 모드 (reservation: 작성/수정 중, calendar: 조회 중)',
    },
    startDate: {
      control: 'date',
      description: '이벤트 시작일',
    },
    endDate: {
      control: 'date',
      description: '이벤트 종료일',
    },
    place: {
      control: 'text',
      description: '이벤트 장소',
    },
    isAdmin: {
      control: 'boolean',
      description: '관리자(운영진) 여부',
    },
    hasNotice: {
      control: 'boolean',
      description: '공지사항 연동 여부 (mode="calendar"일 때만 유효)',
    },
    onClickCard: { action: 'clicked card' },
    onDeleteSchedule: { action: 'clicked delete' },
  },
  args: {
    title: '후반기 만남의 장',
    type: 'official',
    mode: 'calendar',
    startDate: SAMPLE_START_DATE,
    endDate: SAMPLE_END_DATE,
    place: '추후 공지',
    isAdmin: false,
    hasNotice: false,
  },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

// ───────────────────────────────
// 1. 주요 케이스 (디자인 시안 기준)
// ───────────────────────────────

/**
 * Case 1: 운영진의 일정 화면에 노출 (공지 연동 시)
 * - 모드: calendar (조회)
 * - 권한: 운영진 (isAdmin=true)
 * - 공지: 연동됨 (hasNotice=true) -> '공지사항 바로가기' 링크 노출
 * - 액션: 더보기(...) 버튼 노출
 */
export const AdminWithNotice: Story = {
  args: {
    mode: 'calendar',
    isAdmin: true,
    hasNotice: true,
  },
};

/**
 * Case 2: 회원의 일정 화면에 노출 (공지 미연동 시) + 회원의 공지사항 화면 고정값
 * - 모드: calendar (조회)
 * - 권한: 일반 회원 (isAdmin=false)
 * - 공지: 미연동 (hasNotice=false) -> 링크 없음
 * - 액션: 버튼 없음
 */
export const MemberNoNotice: Story = {
  args: {
    mode: 'calendar',
    isAdmin: false,
    hasNotice: false,
  },
};

/**
 * Case 3: 공지사항 작성 중 화면 (일정 연동/운영진 전용)
 * - 모드: reservation (작성 중)
 * - 권한: 운영진 (isAdmin=true)
 * - 액션: 삭제(X) 버튼 노출
 */
export const AdminWriting: Story = {
  args: {
    mode: 'reservation',
    isAdmin: true,
    // hasNotice는 reservation 모드에서 무시됨
  },
};

/**
 * Case 4: 회원의 일정 화면에 노출 (공지 연동 시)
 * - 모드: calendar (조회)
 * - 권한: 일반 회원 (isAdmin=false)
 * - 공지: 연동됨 (hasNotice=true) -> '공지사항 바로가기' 링크 노출
 * - 액션: 버튼 없음
 */
export const MemberWithNotice: Story = {
  args: {
    mode: 'calendar',
    isAdmin: false,
    hasNotice: true,
  },
};

// ───────────────────────────────
// 2. 추가 케이스 (운영진 조회 - 공지 미연동)
// ───────────────────────────────

/**
 * Case 5 (추가): 운영진의 일정 화면에 노출 (공지 미연동 시)
 * - 모드: calendar
 * - 권한: 운영진 (isAdmin=true)
 * - 공지: 미연동 (hasNotice=false) -> 링크 없음
 * - 액션: 더보기(...) 버튼 노출
 */
export const AdminNoNotice: Story = {
  args: {
    mode: 'calendar',
    isAdmin: true,
    hasNotice: false,
  },
};

// ───────────────────────────────
// 3. 기타 변형 (태그 타입, 텍스트 길이 등)
// ───────────────────────────────

export const OperationType: Story = {
  args: {
    type: 'operation',
    title: '운영진 정기 회의',
    place: '온라인 (Zoom)',
  },
};

export const OtherType: Story = {
  args: {
    type: 'other',
    title: 'UX/UI 스터디 모임',
    place: '성수동 카페',
  },
};

export const LongText: Story = {
  args: {
    title: '11월 전체 정기 회의 및 하반기 활동 보고의 건입니다. 모두 참석해주세요.',
    place: '서울특별시 강남구 테헤란로 123, 위워크 빌딩 10층 컨퍼런스룸 A',
    hasNotice: true, // 긴 제목과 공지 링크가 함께 있을 때 레이아웃 확인용
  },
};
