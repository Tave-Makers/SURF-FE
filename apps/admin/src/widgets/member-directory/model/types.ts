export interface MemberCountSummary {
  /** 전체 멤버 수(전체 합) */
  totalMemberCount: number;
}

export interface MemberGenerationList {
  /** 기수 목록 */
  generations: number[];
}

export type MemberDirectoryInfo = MemberCountSummary & MemberGenerationList;
