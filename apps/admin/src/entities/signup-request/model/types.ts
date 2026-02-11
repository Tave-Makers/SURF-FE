import { MemberBase, MemberStatus } from '@/entities/member/model/types';

/**
 * 가입 신청 회원
 *
 * @example
 * const signupRequestMember: SignupRequestMember = {
 *   id: 1,
 *   name: '홍길동',
 *   university: '서울대학교',
 *   profileImageUrl: 'https://...',
 *   tracks: [{ generation: 15, part: 'BACKEND' }],
 *   registeredAt: new Date('2026-01-20'),
 *   status: 'waiting',
 * };
 */
export interface SignupRequestMember extends MemberBase {
  status: MemberStatus;
}
