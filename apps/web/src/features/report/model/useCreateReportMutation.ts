import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createReport } from '../api/createReport.client';
import { REPORT_ERROR_MESSAGE, REPORT_SUCCESS_MESSAGE } from './constants';
import { toCreateReportRequest } from './mappers';
import type { ReportFormValue } from './types';

// 신고 접수 뮤테이션
export const useCreateReportMutation = () => {
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: (value: ReportFormValue) => createReport(toCreateReportRequest(value)),
    onSuccess: () => {
      // 토스트는 전역 store라 뒤로가기 후 게시글 상세에서 그대로 노출됩니다.
      showToast(REPORT_SUCCESS_MESSAGE);
      router.back();
    },
    onError: (error) => {
      console.error('신고 접수 실패:', error);
      showToast(REPORT_ERROR_MESSAGE);
    },
  });
};
