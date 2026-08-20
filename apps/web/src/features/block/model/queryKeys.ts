export const blockQueryKeys = {
  all: ['block'] as const,

  // 차단한 회원 목록
  blockedMembers: () => [...blockQueryKeys.all, 'members'] as const,
};
