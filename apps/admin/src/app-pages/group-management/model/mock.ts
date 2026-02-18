import type { MemberBase } from '@/entities/member/model/types';

export const mockLeader: MemberBase = {
  id: 1,
  name: '테이비',
  university: '홍익대학교',
  profileImageUrl: '',
  tracks: [
    {
      generation: 15,
      part: 'DESIGN', // 실제 part enum에 맞게 수정
    },
  ],
  registeredAt: '2024-03-12',
  role: 'MEMBER', // 실제 MemberRole 값에 맞게 수정
  status: 'approve', // 실제 MemberStatus 값에 맞게 수정
};

export const mockMembers: MemberBase[] = [
  {
    id: 2,
    name: '이테이버',
    university: '홍익대학교',
    profileImageUrl: '',
    tracks: [{ generation: 15, part: 'DESIGN' }],
    registeredAt: '2024-03-15',
    role: 'MEMBER',
    status: 'approve',
  },
  {
    id: 3,
    name: '박프론트',
    university: '연세대학교',
    profileImageUrl: '',
    tracks: [{ generation: 15, part: 'DESIGN' }],
    registeredAt: '2024-03-18',
    role: 'MEMBER',
    status: 'approve',
  },
  {
    id: 4,
    name: '최백엔드',
    university: '고려대학교',
    profileImageUrl: '',
    tracks: [{ generation: 15, part: 'DESIGN' }],
    registeredAt: '2024-03-21',
    role: 'MEMBER',
    status: 'approve',
  },
  {
    id: 5,
    name: '정디자인',
    university: '서강대학교',
    profileImageUrl: '',
    tracks: [{ generation: 15, part: 'DESIGN' }],
    registeredAt: '2024-03-25',
    role: 'MEMBER',
    status: 'approve', // 상태 테스트용
  },
  {
    id: 6,
    name: '김데이터',
    university: '서강대학교',
    profileImageUrl: '',
    tracks: [{ generation: 15, part: 'DATA_ANALYSIS' }],
    registeredAt: '2024-03-25',
    role: 'MEMBER',
    status: 'approve', // 상태 테스트용
  },
];

export const mockEmptyLeader: MemberBase | undefined = undefined;
export const mockEmptyMembers: MemberBase[] = [];

export const mockMembersWithLeaderInside: MemberBase[] = [mockLeader, ...mockMembers];
