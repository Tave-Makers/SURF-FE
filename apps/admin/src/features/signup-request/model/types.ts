import { Member } from '@/entities/member/model/types';

/**
 * 가입 신청 목록 아이템
 *
 * 가입 신청 목록에서 사용하는 멤버 정보입니다.
 * Member의 부분 집합으로, email/phoneNumber/role 정보는 제외됩니다.
 *
 * @example
 * const signupRequestMember: SignupRequestMember = {
 *   id: 1,
 *   name: '홍길동',
 *   university: '서울대학교',
 *   profileImageUrl: 'https://...',
 *   tracks: [{ generation: 15, part: 'BACKEND' }],
 *   registeredAt: new Date('2026-01-20'),
 * };
 */
export type SignupRequestMember = Pick<
  Member,
  'id' | 'name' | 'university' | 'profileImageUrl' | 'tracks' | 'registeredAt'
>;
