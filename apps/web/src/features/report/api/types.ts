import type { CommonResponse } from '@/shared/api/types';

// BE ReportTargetType
export type ReportTargetTypeDTO = 'POST' | 'COMMENT' | 'PROFILE';

// BE ReportReasonType
export type ReportReasonTypeDTO =
  | 'HATE_OR_ABUSE'
  | 'SPAM_OR_PROMOTION'
  | 'ILLEGAL_CONTENT'
  | 'OBSCENE_CONTENT'
  | 'UNPLEASANT_EXPRESSION';

// POST /v1/user/reports 요청
export type CreateReportRequest = {
  targetType: ReportTargetTypeDTO;
  targetId: number;
  reasonType: ReportReasonTypeDTO;
};

export type CreateReportResponse = CommonResponse<null>;
