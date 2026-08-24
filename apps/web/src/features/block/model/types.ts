/** 차단한 회원 목록에 표시되는 회원 */
export type BlockedMember = {
  memberId: number;
  name: string;
  /** Avatar는 src가 없으면 기본 이미지를 쓰므로 null을 undefined로 좁힌다 */
  profileImageUrl?: string;
};
