import type { ReportGuideSectionItem, ReportReason } from './types';

// 신고 사유 목록 (중복 선택 불가 — 단일 선택만 허용)
export const REPORT_REASONS: ReportReason[] = [
  { code: 'HATE_OR_ABUSE', label: '혐오차별적/생명경시/욕설 표현입니다.' },
  { code: 'SPAM_OR_PROMOTION', label: '스팸홍보/도배글입니다.' },
  { code: 'ILLEGAL_CONTENT', label: '불법정보를 포함하고 있습니다.' },
  { code: 'OBSCENE_CONTENT', label: '음란물입니다.' },
  { code: 'UNPLEASANT_EXPRESSION', label: '불쾌한 표현이 있습니다.' },
];

// 신고 접수 및 처리 안내
export const REPORT_GUIDE_SECTIONS: ReportGuideSectionItem[] = [
  {
    title: '신고 처리 프로세스',
    descriptions: ['접수된 신고는 SURF 운영진이 검토 후 약관 및 운영 정책에 따라 처리됩니다.'],
  },
  {
    title: '허위 신고 제재 안내',
    descriptions: [
      '허위 또는 악의적인 목적으로 신고를 반복할 경우, 서비스 이용에 제한(활동 정지 등)을 받을 수 있습니다.',
    ],
  },
  {
    title: '처리 기준 및 비밀보장',
    descriptions: [
      '신고 내용 및 신고자 정보는 비밀로 유지되며, 작성자에게 노출되지 않습니다.',
      '신고된 게시글/댓글은 운영진 검토 완료 시까지 즉시 블라인드(숨김) 처리될 수 있습니다.',
    ],
  },
];

export const REPORT_SUCCESS_MESSAGE = '신고접수가 완료되었습니다.';
export const REPORT_ERROR_MESSAGE = '신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.';
