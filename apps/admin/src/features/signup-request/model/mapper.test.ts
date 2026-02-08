import { SignupRequestItem } from '../api/types';
import { toSignupRequestMember } from './mapper';

describe('toSignupRequestMember', () => {
  const baseDto: SignupRequestItem = {
    memberId: 10,
    username: '테스트유저',
    university: '고려대학교',
    profileImageUrl: 'https://example.com/avatar.png',
    trackList: [{ generation: 17, part: 'WEB_FRONTEND' }],
    createdAt: '2026-01-21T12:00:00.000Z',
    memberStatus: 'WAITING',
  };

  test('API DTO 필드를 도메인 모델로 매핑한다', () => {
    const member = toSignupRequestMember(baseDto);

    expect(member).toEqual({
      id: 10,
      name: '테스트유저',
      university: '고려대학교',
      profileImageUrl: 'https://example.com/avatar.png',
      tracks: [{ generation: 17, part: 'WEB_FRONTEND' }],
      registeredAt: '2026-01-21T12:00:00.000Z',
      status: 'waiting',
    });
  });

  test('memberStatus를 도메인 MemberStatus로 변환한다', () => {
    expect(toSignupRequestMember({ ...baseDto, memberStatus: 'APPROVED' }).status).toBe('approve');
    expect(toSignupRequestMember({ ...baseDto, memberStatus: 'REJECTED' }).status).toBe('reject');
    expect(toSignupRequestMember({ ...baseDto, memberStatus: 'REGISTERING' }).status).toBe(
      'waiting',
    );
  });
});
