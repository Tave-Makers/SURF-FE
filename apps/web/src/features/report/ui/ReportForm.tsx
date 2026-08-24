'use client';

import { SolidButton } from '@surf/ui/button';

import type { ReportTargetType } from '../model/types';
import { useReportForm } from '../model/useReportForm';
import { ReportGuideSection } from './ReportGuideSection';
import { ReportReasonList } from './ReportReasonList';
import { ReportTargetSummary } from './ReportTargetSummary';

type ReportFormProps = {
  targetType: ReportTargetType;
  targetId: number;
  writer: string;
  contentLabel: string;
  content: string;
};

export const ReportForm = ({
  targetType,
  targetId,
  writer,
  contentLabel,
  content,
}: ReportFormProps) => {
  const { state, actions } = useReportForm({ targetType, targetId });

  return (
    <div className="bg-background-normal flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ReportTargetSummary writer={writer} contentLabel={contentLabel} content={content} />
        <ReportReasonList
          selectedReason={state.selectedReason}
          onSelectReason={actions.selectReason}
        />
        <ReportGuideSection />
      </div>

      <div className="shrink-0 px-13 pt-13 pb-15">
        <SolidButton
          size="l"
          variant="primary"
          onClick={actions.submit}
          isDisabled={!state.isSubmittable}
        >
          {state.isPending ? '접수 중...' : '신고하기'}
        </SolidButton>
      </div>
    </div>
  );
};
