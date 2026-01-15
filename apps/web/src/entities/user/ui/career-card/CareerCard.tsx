'use client';

import type { CareerDTO } from '@/entities/user/model/types';
import EmploymentStatusBadge from '@/shared/assets/icons/profile/employment-status-badge.svg';

const formatYmForView = (ym?: string | null) => {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  return y && m ? `${y}.${m}` : ym;
};

const asMonthString = (ym?: string | null) => (ym ? ym : undefined);

const containerStyle = 'bg-background-secondary-lighter rounded-4 relative w-full px-11 py-10';
const badgeStyle =
  'pointer-events-none absolute top-[0.625rem] right-[0.75rem] h-[1.25rem] w-[3rem] select-none';
const headerStyle =
  'text-body-body8 text-foreground-normal truncate flex min-w-0 items-center pr-[3.25rem]';
const scriptStyle = 'text-body-body9 text-foreground-normal truncate';
const dateStyle = 'text-foreground-tertiary text-body-body11 mt-5 flex items-center gap-5';

interface Props {
  item: CareerDTO;
}

export const CareerCard = ({ item }: Props) => {
  const isWorking = item.isWorking === true;

  const startView = formatYmForView(item.startDate);
  const startDT = asMonthString(item.startDate);

  const endView = isWorking ? '현재' : formatYmForView(item.endDate);
  const endDT = isWorking ? undefined : asMonthString(item.endDate);

  return (
    <article className={containerStyle} aria-label={`${item.companyName} / ${item.position}`}>
      {isWorking && <EmploymentStatusBadge aria-hidden="true" className={badgeStyle} />}

      <h3 className={headerStyle}>{item.companyName}</h3>
      <div className={scriptStyle}>{item.position}</div>

      <div className={dateStyle}>
        <time dateTime={startDT}>{startView}</time>
        <span>~</span>
        {endDT ? <time dateTime={endDT}>{endView}</time> : <span>{endView}</span>}
      </div>
    </article>
  );
};
