import { RequestListTopBar } from '../../../features/signup-request/ui/RequestListTopBar';

import { SignupRequestList } from '@/features/signup-request/ui/SignupRequestList';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';

export const SignupRequestListWidget = () => {
  return (
    <>
      {/* 회원가입 요청 상단 바 (전체 멤버 수, 선택하기 버튼) */}
      <RequestListTopBar mode="view" selectCount={0} totalCount={0} />
      {/* 회원가입 요청 멤버 리스트 */}
      <SignupRequestList />
      {/* 바텀 액션바 */}
      <BottomActionBar
        actions={[
          {
            key: 'approve',
            label: '승인하기',
            onClick: () => {},
          },
          {
            key: 'reject',
            label: '거절하기',
            onClick: () => {},
          },
        ]}
      />
    </>
  );
};
