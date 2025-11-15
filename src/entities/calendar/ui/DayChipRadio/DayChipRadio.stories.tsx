import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DayChipRadio } from './DayChipRadio';
import { addDays, subMonths, format } from 'date-fns';
import type { ActivityMap, DailyActivity } from '@/entities/calendar/model/types';
import type { Modifiers, CalendarDay } from 'react-day-picker';

// 날짜 포맷 유틸리티
const toYmd = (date: Date) => format(date, 'yyyy-MM-dd');

// 더미 데이터
const TODAY = new Date();
const TOMORROW = addDays(TODAY, 1);
const PREV_MONTH_DAY = subMonths(TODAY, 1);

const createActivity = (id: string, type: DailyActivity['type'], title: string): DailyActivity => ({
  id,
  type,
  title,
});

const createMockDay = (date: Date, displayMonth: Date = TODAY): CalendarDay => {
  return {
    date,
    displayMonth,
  } as CalendarDay;
};

// mock 데이터
const mockActivityMap: ActivityMap = {
  [toYmd(TODAY)]: [
    createActivity('1', 'official', '오늘 공식 일정'),
    createActivity('2', 'operation', '오늘 운영 회의'),
    createActivity('3', 'other', '추가 일정 (더보기)'),
  ],
  [toYmd(TOMORROW)]: [
    createActivity('4', 'official', '내일 일정 하나'),
    createActivity('5', 'official', '내일 일정 하나'),
  ],
  [toYmd(PREV_MONTH_DAY)]: [createActivity('6', 'other', '지난달 일정')],
};

type DayChipRadioProps = React.ComponentProps<typeof DayChipRadio>;

const meta: Meta<DayChipRadioProps> = {
  title: 'Entities/UI/Calendar/DayChipRadio',
  component: DayChipRadio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    displayMonth: { control: 'date', description: '현재 달력에 표시 중인 월' },
    activityMap: { control: 'object', description: '날짜별 일정 맵' },
    onSelect: { action: 'selected' },
    day: { table: { disable: true } },
    modifiers: { table: { disable: true } },
  },
  args: {
    displayMonth: TODAY,
    activityMap: mockActivityMap,
    day: createMockDay(TODAY),
    modifiers: {} as Modifiers,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<DayChipRadioProps>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────

export const TodayWithActivities: Story = {
  args: {
    day: createMockDay(TODAY),
    modifiers: { today: true },
    className:
      'px-2 rounded-3 h-[5rem] w-[3.12rem] gap-3 inline-flex truncate border border-gray-200',
  },
};

export const NormalDayWithActivity: Story = {
  args: {
    day: createMockDay(TOMORROW),
    modifiers: {},
    className:
      'px-2 rounded-3 h-[5rem] w-[3.12rem] gap-3 inline-flex truncate border border-gray-200',
  },
};

export const NoActivityDay: Story = {
  args: {
    day: createMockDay(addDays(TODAY, 2)),
    modifiers: {},
    className:
      'px-2 rounded-3 h-[5rem] w-[3.12rem] gap-3 inline-flex truncate border border-gray-200',
  },
};

// ───────────────────────────────
// 특수 상태들
// ───────────────────────────────

export const OutsideMonthDay: Story = {
  args: {
    day: createMockDay(PREV_MONTH_DAY, TODAY),
    modifiers: { outside: true },
    className:
      'px-2 rounded-3 h-[5rem] w-[3.12rem] gap-3 inline-flex truncate border border-gray-200',
  },
};

export const SelectedDay: Story = {
  args: {
    day: createMockDay(TOMORROW),
    modifiers: { selected: true },
    className:
      'px-2 rounded-3 h-[5rem] w-[3.12rem] gap-3 inline-flex truncate border border-gray-200',
  },
  parameters: {
    docs: {
      description: {
        story: '현재 컴포넌트 구현상 선택된 스타일이 적용되지 않을 수 있습니다.',
      },
    },
  },
};
