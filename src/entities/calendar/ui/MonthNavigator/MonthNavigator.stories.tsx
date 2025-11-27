import type { Meta, StoryObj } from '@storybook/nextjs';
import { MonthNavigator } from './MonthNavigator';
import { useState } from 'react';
import { format } from 'date-fns';

const meta: Meta<typeof MonthNavigator> = {
  title: 'Entities/UI/Calendar/MonthNavigator',
  component: MonthNavigator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    month: {
      control: 'date',
      description: '현재 표시 중인 월',
    },
    onChange: {
      action: 'month changed',
      description: '월 변경 시 호출되는 콜백 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MonthNavigator>;

// ───────────────────────────────
// 기본 상태
// ───────────────────────────────

/**
 * 기본 렌더링 (현재 월 기준)
 */
export const Default: Story = {
  args: {
    month: new Date(),
  },
};

/**
 * 특정 과거 날짜 (예: 2023년 1월)
 */
export const PastDate: Story = {
  args: {
    month: new Date('2023-01-15'),
  },
};

/**
 * 특정 미래 날짜 (예: 2030년 12월)
 */
export const FutureDate: Story = {
  args: {
    month: new Date('2030-12-25'),
  },
};

// ───────────────────────────────
// 인터랙티브 예시
// ───────────────────────────────

/**
 * 실제로 동작하는 예시 (useState 사용)
 * - 화살표 버튼을 클릭하여 월을 변경해보세요.
 */
export const Interactive: Story = {
  render: () => {
    // 스토리 내부에서 상태 관리

    const [currentMonth, setCurrentMonth] = useState(new Date());

    return (
      <div className="flex flex-col items-center gap-10 rounded-lg p-4">
        <MonthNavigator month={currentMonth} onChange={(newMonth) => setCurrentMonth(newMonth)} />
        <div className="text-sm text-gray-500">
          현재 선택된 날짜: {format(currentMonth, 'yyyy-MM-dd')}
        </div>
      </div>
    );
  },
};
