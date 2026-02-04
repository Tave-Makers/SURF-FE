import { toSignupRequestMember } from './mapper';

describe('toSignupRequestMember', () => {
  test('API DTO 필드를 도메인 모델로 매핑한다', () => {
    const dto = {
      memberId: 10,
      username: '테스트유저',
      university: '고려대학교',
      profileImageUrl: 'https://example.com/avatar.png',
      trackList: [{ generation: 17, part: 'WEB_FRONTEND' as const }],
      createdAt: '2026-01-21T12:00:00.000Z',
    };

    const member = toSignupRequestMember(dto);

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
});
