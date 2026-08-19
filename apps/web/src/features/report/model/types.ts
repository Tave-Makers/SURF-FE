// 신고 대상 종류 (UI) — 라우팅/쿼리스트링에서 소문자로 다룬다
export type ReportTargetType = 'post' | 'comment' | 'profile';

// 신고 사유 코드 (UI) — BE ReportReasonType과 이름을 1:1로 맞춘다
export type ReportReasonCode =
  | 'HATE_OR_ABUSE'
  | 'SPAM_OR_PROMOTION'
  | 'ILLEGAL_CONTENT'
  | 'OBSCENE_CONTENT'
  | 'UNPLEASANT_EXPRESSION';

// 신고 폼이 만들어내는 값
export type ReportFormValue = {
  targetType: ReportTargetType;
  targetId: number;
  reasonCode: ReportReasonCode;
};

// 사유 선택 목록 아이템
export type ReportReason = {
  code: ReportReasonCode;
  label: string;
};

// 신고 접수 및 처리 안내 문단
export type ReportGuideSectionItem = {
  title: string;
  descriptions: string[];
};
