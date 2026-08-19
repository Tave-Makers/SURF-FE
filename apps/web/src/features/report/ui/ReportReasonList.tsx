'use client';

import { SurfIcon } from '@surf/ui/icon';

import { REPORT_REASONS } from '../model/constants';
import type { ReportReasonCode } from '../model/types';

type ReportReasonListProps = {
  selectedReason: ReportReasonCode | null;
  onSelectReason: (code: ReportReasonCode) => void;
};

/** 신고 사유 선택 — 중복 선택이 불가능하므로 radiogroup으로 구성 */
export const ReportReasonList = ({ selectedReason, onSelectReason }: ReportReasonListProps) => (
  <section className="flex flex-col gap-11 px-15 py-13">
    <h2 className="text-body-body6 text-foreground-normal">사유 선택</h2>
    <div role="radiogroup" aria-label="신고 사유" className="flex flex-col gap-10">
      {REPORT_REASONS.map(({ code, label }) => {
        const isSelected = selectedReason === code;

        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectReason(code)}
            className="flex items-center gap-7 pr-10 text-left"
          >
            <SurfIcon
              name="Check"
              size="m"
              className={isSelected ? 'text-background-primary' : 'text-foreground-tertiary'}
            />
            <span className="text-body-body8 text-foreground-normal-lighter">{label}</span>
          </button>
        );
      })}
    </div>
  </section>
);
