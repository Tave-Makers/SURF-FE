'use client';
import { SurfIcon } from '@surf/ui/icon';
import { addMonths, format } from 'date-fns';
import { ko } from 'date-fns/locale';

type Props = {
  month: Date;
  onChange: (m: Date) => void;
};

export const MonthNavigator = ({ month, onChange }: Props) => {
  const prev = () => onChange(addMonths(month, -1));
  const next = () => onChange(addMonths(month, 1));

  return (
    <div className="flex items-center justify-center gap-10">
      <button
        type="button"
        onClick={prev}
        aria-label="이전 달로 이동"
        className="text-foreground-normal"
      >
        <SurfIcon name="ChevronLeft" size="l" />
      </button>

      <div className="text-body-body4 text-foreground-normal select-none">
        {format(month, 'yyyy년 M월', { locale: ko })}
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="다음 달로 이동"
        className="text-foreground-normal"
      >
        <SurfIcon name="ChevronRight" size="l" />
      </button>
    </div>
  );
};
