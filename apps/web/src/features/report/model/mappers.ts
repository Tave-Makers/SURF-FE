import type { CreateReportRequest, ReportTargetTypeDTO } from '../api/types';
import type { ReportFormValue, ReportTargetType } from './types';

const REPORT_TARGET_TYPE_DTO: Record<ReportTargetType, ReportTargetTypeDTO> = {
  post: 'POST',
  comment: 'COMMENT',
  profile: 'PROFILE',
};

/** 신고 폼 값 → POST /v1/user/reports 요청 바디 */
export const toCreateReportRequest = ({
  targetType,
  targetId,
  reasonCode,
}: ReportFormValue): CreateReportRequest => ({
  targetType: REPORT_TARGET_TYPE_DTO[targetType],
  targetId,
  // 사유 코드는 BE ReportReasonType과 이름이 같다. 어긋나면 타입 에러로 잡힌다.
  reasonType: reasonCode,
});
