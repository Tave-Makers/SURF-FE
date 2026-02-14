export interface MemberCountSummary {
  /** 전체 멤버 수(전체 합) */
  totalMemberCount: number;
}

export interface MemberGeneration {
  /**기수 번호 */
  generation: number;
  /**기수 명 */
  label: string;
}

export interface MemberGenerationList {
  /** 기수 목록 */
  generations: MemberGeneration[];
}

export type MemberDirectoryInfo = MemberCountSummary & MemberGenerationList;
