'use client';

import Calendar from '@/widgets/calendar/ui/Calendar';

export default function FaqPage() {
  // 임시로 캘린더 컴포넌트를 확인하기 위한 페이지. 나중에 삭제 및 올바른 곳으로 캘린더 컴포넌트 이동 예정
  return (
    <div className="flex flex-1 overflow-y-auto">
      <Calendar />
    </div>
  );
}
