import type { Meta, StoryObj } from '@storybook/nextjs';
import { ActivityBadge } from './ActivityBadge';
import type { DailyActivity } from '@/entities/calendar/model/types';

const createDummyItem = (
  category: DailyActivity['category'],
  title: string = '일정 제목',
): DailyActivity => ({
  id: 1,
  category,
  title,
  startDate: new Date(),
  endDate: new Date(),
});

const meta: Meta<typeof ActivityBadge> = {
  title: 'Entities/UI/Calendar/ActivityBadge',
  component: ActivityBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    item: {
      control: 'object',
      description: '일정 정보 객체 (타입, 제목 등 포함)',
    },
    isCurrentMonth: {
      control: 'boolean',
      description: '현재 월에 속하는 일정인지 여부 (false일 경우 반투명 처리)',
    },
  },
  // 공통 기본 args 설정
  args: {
    isCurrentMonth: true,
  },
  decorators: [
    (Story) => (
      <div className="min-w-[3.12rem]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityBadge>;

// ───────────────────────────────
// 기본 상태들 (타입별)
// ───────────────────────────────
export const Official: Story = {
  args: {
    item: createDummyItem('official', '공식 일정'),
  },
};

export const Operation: Story = {
  args: {
    item: createDummyItem('operation', '운영 일정'),
  },
};

export const Other: Story = {
  args: {
    item: createDummyItem('other', '기타 일정'),
  },
};

// ───────────────────────────────
// 상태별 변형 (현재 월 여부, 긴 텍스트)
// ───────────────────────────────
export const NotCurrentMonth: Story = {
  args: {
    item: createDummyItem('official', '이전/다음 달 일정'),
    isCurrentMonth: false,
  },
};

export const LongTextTruncated: Story = {
  args: {
    item: createDummyItem('operation', '매우 긴 일정 제목은 말줄임표로 표시됩니다.'),
  },
  decorators: [
    (Story) => (
      <div className="w-[100px] border border-dashed border-gray-300 p-1">
        <Story />
      </div>
    ),
  ],
};

// ───────────────────────────────
// 한눈에 보기
// ───────────────────────────────
export const AllVariations: Story = {
  render: () => (
    <div className="flex w-[150px] flex-col gap-4">
      <div className="text-sm font-bold">Current Month</div>
      <ActivityBadge item={createDummyItem('official', '공식 일정')} isCurrentMonth={true} />
      <ActivityBadge item={createDummyItem('operation', '운영 일정')} isCurrentMonth={true} />
      <ActivityBadge item={createDummyItem('other', '기타 일정')} isCurrentMonth={true} />

      <div className="mt-4 text-sm font-bold">Other Month (Opacity 50%)</div>
      <ActivityBadge item={createDummyItem('official', '공식 일정')} isCurrentMonth={false} />
      <ActivityBadge item={createDummyItem('operation', '운영 일정')} isCurrentMonth={false} />
      <ActivityBadge item={createDummyItem('other', '기타 일정')} isCurrentMonth={false} />
    </div>
  ),
};
