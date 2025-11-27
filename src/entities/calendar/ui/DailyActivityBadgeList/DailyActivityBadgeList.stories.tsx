import type { Meta, StoryObj } from '@storybook/nextjs';
import { DailyActivityBadgeList } from './DailyActivityBadgeList';
import type { DailyActivity } from '@/entities/calendar/model/types';

const createDummyItems = (count: number): DailyActivity[] => {
  const types: DailyActivity['type'][] = ['official', 'operation', 'other'];
  return Array.from({ length: count }, (_, i) => ({
    id: `dummy-${i}`,
    type: types[i % 3],
    title: `일정 제목 ${i + 1}`,
  }));
};

const meta: Meta<typeof DailyActivityBadgeList> = {
  title: 'Entities/UI/Calendar/DailyActivityBadgeList',
  component: DailyActivityBadgeList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: '해당 날짜의 일정 목록',
    },
    maxVisible: {
      control: { type: 'number', min: 2, max: 3 },
      description: '한 셀에 최대로 보여줄 뱃지 개수 (나머지는 "더보기"로 표시)',
    },
    isCurrentMonth: {
      control: 'boolean',
      description: '현재 월 여부 (false일 경우 전체적으로 반투명 처리)',
    },
  },
  args: {
    maxVisible: 2,
    isCurrentMonth: true,
  },
  decorators: [
    (Story) => (
      <div className="h-[4rem] min-w-[3.12rem] items-start gap-3 overflow-hidden border border-gray-200 bg-white p-1">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DailyActivityBadgeList>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────

/**
 * 아이템이 1개일 때 (maxVisible 이하)
 */
export const SingleItem: Story = {
  args: {
    items: createDummyItems(1),
  },
};

/**
 * 아이템이 2개일 때 (maxVisible과 동일)
 */
export const TwoItems: Story = {
  args: {
    items: createDummyItems(2),
  },
};

/**
 * 아이템이 3개 이상일 때 (maxVisible 초과 -> 더보기 표시)
 */
export const OverflowItems: Story = {
  args: {
    items: createDummyItems(5), // 5개 아이템, 기본 maxVisible은 2
  },
};

// ───────────────────────────────
// 다양한 옵션 테스트
// ───────────────────────────────

/**
 * 현재 월이 아닐 때 (전체적으로 흐리게 표시)
 */
export const NotCurrentMonth: Story = {
  args: {
    isCurrentMonth: false,
    items: createDummyItems(4),
  },
};

/**
 * 빈 리스트
 */
export const EmptyList: Story = {
  args: {
    items: [],
  },
  decorators: [(Story) => <Story />],
};
