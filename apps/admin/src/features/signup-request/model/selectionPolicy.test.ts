import { createMemberStatusMap, getSelectionPolicy } from './selectionPolicy';
import { createSignupRequestMember } from '@/test/factories/signupRequest';

describe('selectionPolicy', () => {
  test('선택된 항목이 모두 waiting이면 승인/거절이 활성화된다', () => {
    const members = [
      createSignupRequestMember({ id: 1, status: 'waiting' }),
      createSignupRequestMember({ id: 2, status: 'waiting' }),
    ];
    const selectedIds = new Set([1, 2]);

    const policy = getSelectionPolicy(createMemberStatusMap(members), selectedIds);

    expect(policy.canApprove).toBe(true);
    expect(policy.canReject).toBe(true);
  });

  test('waiting이 아닌 상태가 포함되면 승인/거절이 비활성화된다', () => {
    const members = [
      createSignupRequestMember({ id: 1, status: 'waiting' }),
      createSignupRequestMember({ id: 2, status: 'approve' }),
    ];
    const selectedIds = new Set([1, 2]);

    const policy = getSelectionPolicy(createMemberStatusMap(members), selectedIds);

    expect(policy.canApprove).toBe(false);
    expect(policy.canReject).toBe(false);
  });
});
