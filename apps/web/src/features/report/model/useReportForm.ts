'use client';

import { useState } from 'react';

import type { ReportReasonCode, ReportTargetType } from './types';
import { useCreateReportMutation } from './useCreateReportMutation';

type UseReportFormParams = {
  targetType: ReportTargetType;
  targetId: number;
};

export const useReportForm = ({ targetType, targetId }: UseReportFormParams) => {
  // 중복 사유 선택 불가 — 하나만 담는다
  const [selectedReason, setSelectedReason] = useState<ReportReasonCode | null>(null);
  const { mutate, isPending } = useCreateReportMutation();

  const submit = () => {
    if (!selectedReason || isPending) return;
    mutate({ targetType, targetId, reasonCode: selectedReason });
  };

  return {
    state: {
      selectedReason,
      isPending,
      isSubmittable: selectedReason !== null && !isPending,
    },
    actions: {
      selectReason: setSelectedReason,
      submit,
    },
  };
};
