'use client';

import type { CareerDTO } from '@/entities/user/model/types';
import EmploymentStatusBadge from '@/shared/assets/icons/profile/employment-status-badge.svg';

type Props = { item: CareerDTO };

const formatYmForView = (ym?: string | null) => {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  return y && m ? `${y}.${m}` : ym;
};

const asMonthString = (ym?: string | null) => (ym ? ym : undefined);

export function CareerCard({ item }: Props) {
  const isWorking = item.isWorking === true;

  const startView = formatYmForView(item.startDate);
  const startDT = asMonthString(item.startDate);

  const endView = isWorking ? '현재' : formatYmForView(item.endDate);
  const endDT = isWorking ? undefined : asMonthString(item.endDate);

  return (
    <article
      className="bg-background-normal-darker relative w-full rounded-[0.5rem] px-[0.75rem] py-[0.625rem]"
      aria-label={`${item.companyName} / ${item.position}`}
    >
      {isWorking && (
        <EmploymentStatusBadge
          aria-hidden="true"
          className="pointer-events-none absolute top-[0.625rem] right-[0.75rem] h-[1.25rem] w-[3rem] select-none"
        />
      )}

      <header className="flex min-w-0 items-center pr-[3.25rem]">
        <h3 className="text-body-14-600--1-24 text-foreground-normal truncate">
          {item.companyName}
        </h3>
      </header>
      <div className="text-body-14-400--2-22 text-foreground-normal truncate">{item.position}</div>

      <div className="text-foreground-hint-darker mt-[0.25rem] flex items-center gap-[0.25rem]">
        <time className="text-body-12-400--2" dateTime={startDT}>
          {startView}
        </time>
        <span className="text-body-12-400--2">~</span>
        {endDT ? (
          <time className="text-body-12-400--2" dateTime={endDT}>
            {endView}
          </time>
        ) : (
          <span className="text-body-12-400--2">{endView}</span>
        )}
      </div>
    </article>
  );
}
